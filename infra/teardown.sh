#!/usr/bin/env bash
# Idempotent teardown of everything for a prefix. Safe to run by hand any time.
# usage: teardown.sh [stack-name] [prefix] [receipt-path]
set -uo pipefail
STACK=${1:-feedback-factory}
PREFIX=${2:-feedback-factory}
RECEIPT=${3:-$HOME/projects/feedback-inbox/TEARDOWN-RECEIPT.md}
REGION=${AWS_REGION:-us-east-1}
export AWS_PAGER="" PATH="/opt/homebrew/bin:/usr/local/bin:$HOME/.local/bin:$PATH"
log() { echo "$(date -u +%FT%TZ) $*"; }

log "teardown start stack=$STACK prefix=$PREFIX"

# 1. SSM parameters
names=$(aws ssm get-parameters-by-path --region "$REGION" --path "/$PREFIX/" --recursive --query 'Parameters[].Name' --output text 2>/dev/null)
[[ -n $names ]] && aws ssm delete-parameters --region "$REGION" --names $names >/dev/null && log "deleted params: $names"

# 2. stack
status=$(aws cloudformation describe-stacks --region "$REGION" --stack-name "$STACK" --query 'Stacks[0].StackStatus' --output text 2>/dev/null || echo GONE)
if [[ $status != GONE && $status != DELETE_COMPLETE ]]; then
  log "deleting stack ($status)"
  aws cloudformation delete-stack --region "$REGION" --stack-name "$STACK"
  aws cloudformation wait stack-delete-complete --region "$REGION" --stack-name "$STACK" 2>/dev/null \
    || { log "stack delete did not complete cleanly; retrying once"; aws cloudformation delete-stack --region "$REGION" --stack-name "$STACK"; aws cloudformation wait stack-delete-complete --region "$REGION" --stack-name "$STACK"; }
fi

# 3. leftovers, explicitly by name / tag
for id in $(aws ec2 describe-instances --region "$REGION" --filters "Name=tag:project,Values=$PREFIX" "Name=instance-state-name,Values=pending,running,stopping,stopped" --query 'Reservations[].Instances[].InstanceId' --output text); do
  aws ec2 modify-instance-attribute --region "$REGION" --instance-id "$id" --no-disable-api-termination >/dev/null 2>&1
  aws ec2 terminate-instances --region "$REGION" --instance-ids "$id" >/dev/null && log "terminated $id"
  aws ec2 wait instance-terminated --region "$REGION" --instance-ids "$id"
done
for t in $(aws dynamodb list-tables --region "$REGION" --query "TableNames[?starts_with(@, '$PREFIX-')]" --output text); do
  aws dynamodb update-table --region "$REGION" --table-name "$t" --no-deletion-protection-enabled >/dev/null 2>&1
  aws dynamodb delete-table --region "$REGION" --table-name "$t" >/dev/null && log "deleted table $t"
done
for sg in $(aws ec2 describe-security-groups --region "$REGION" --filters "Name=tag:project,Values=$PREFIX" --query 'SecurityGroups[].GroupId' --output text); do
  aws ec2 delete-security-group --region "$REGION" --group-id "$sg" && log "deleted sg $sg"
done
for lt in $(aws ec2 describe-launch-templates --region "$REGION" --filters "Name=launch-template-name,Values=$PREFIX-*" --query 'LaunchTemplates[].LaunchTemplateId' --output text); do
  aws ec2 delete-launch-template --region "$REGION" --launch-template-id "$lt" >/dev/null && log "deleted launch template $lt"
done
for ip in $(aws iam list-instance-profiles --query "InstanceProfiles[?starts_with(InstanceProfileName, '$PREFIX-')].InstanceProfileName" --output text); do
  for r in $(aws iam get-instance-profile --instance-profile-name "$ip" --query 'InstanceProfile.Roles[].RoleName' --output text); do
    aws iam remove-role-from-instance-profile --instance-profile-name "$ip" --role-name "$r"
  done
  aws iam delete-instance-profile --instance-profile-name "$ip" && log "deleted instance profile $ip"
done
for r in $(aws iam list-roles --query "Roles[?starts_with(RoleName, '$PREFIX-')].RoleName" --output text); do
  for p in $(aws iam list-role-policies --role-name "$r" --query 'PolicyNames' --output text); do aws iam delete-role-policy --role-name "$r" --policy-name "$p"; done
  for p in $(aws iam list-attached-role-policies --role-name "$r" --query 'AttachedPolicies[].PolicyArn' --output text); do aws iam detach-role-policy --role-name "$r" --policy-arn "$p"; done
  aws iam delete-role --role-name "$r" && log "deleted role $r"
done
if [[ $PREFIX == feedback-factory ]]; then
  for o in $(aws iam list-open-id-connect-providers --query 'OpenIDConnectProviderList[].Arn' --output text | tr '\t' '\n' | grep 'oidc.vercel.com/jo-vans-projects'); do
    aws iam delete-open-id-connect-provider --open-id-connect-provider-arn "$o" && log "deleted oidc provider"
  done
fi
for s in $(aws scheduler list-schedules --region "$REGION" --name-prefix "$PREFIX" --query 'Schedules[].Name' --output text); do
  aws scheduler delete-schedule --region "$REGION" --name "$s" && log "deleted schedule $s"
done

# 4. receipt: what remains (expected: nothing)
{
  echo "# Teardown receipt: $PREFIX"
  echo
  echo "Run at $(date -u +%FT%TZ) by $(whoami)@$(hostname -s). Stack: $STACK ($(aws cloudformation describe-stacks --region "$REGION" --stack-name "$STACK" --query 'Stacks[0].StackStatus' --output text 2>/dev/null || echo 'gone'))."
  echo
  echo "| Check | Remaining |"
  echo "|---|---|"
  echo "| EC2 instances (not terminated) | $(aws ec2 describe-instances --region "$REGION" --filters "Name=tag:project,Values=$PREFIX" "Name=instance-state-name,Values=pending,running,stopping,stopped,shutting-down" --query 'Reservations[].Instances[].InstanceId' --output text | tr -s '\t' ' ' ) |"
  echo "| EBS volumes | $(aws ec2 describe-volumes --region "$REGION" --filters "Name=tag:project,Values=$PREFIX" --query 'Volumes[].VolumeId' --output text) |"
  echo "| Security groups | $(aws ec2 describe-security-groups --region "$REGION" --filters "Name=tag:project,Values=$PREFIX" --query 'SecurityGroups[].GroupId' --output text) |"
  echo "| DynamoDB tables | $(aws dynamodb list-tables --region "$REGION" --query "TableNames[?starts_with(@, '$PREFIX-')]" --output text) |"
  echo "| IAM roles | $(aws iam list-roles --query "Roles[?starts_with(RoleName, '$PREFIX-')].RoleName" --output text) |"
  echo "| Instance profiles | $(aws iam list-instance-profiles --query "InstanceProfiles[?starts_with(InstanceProfileName, '$PREFIX-')].InstanceProfileName" --output text) |"
  echo "| OIDC providers | $( [[ $PREFIX == feedback-factory ]] && aws iam list-open-id-connect-providers --query 'OpenIDConnectProviderList[].Arn' --output text | tr '\t' '\n' | grep -c 'oidc.vercel.com/jo-vans-projects' || echo n/a) |"
  echo "| SSM parameters | $(aws ssm get-parameters-by-path --region "$REGION" --path "/$PREFIX/" --recursive --query 'Parameters[].Name' --output text) |"
  echo "| Schedules | $(aws scheduler list-schedules --region "$REGION" --name-prefix "$PREFIX" --query 'Schedules[].Name' --output text) |"
} > "$RECEIPT"
cat "$RECEIPT"
log "teardown done"
