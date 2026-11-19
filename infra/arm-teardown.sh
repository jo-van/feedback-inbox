#!/usr/bin/env bash
# Arm laptop-independent teardown via EventBridge Scheduler.
# usage: arm-teardown.sh <stack-name> <prefix> <at-utc e.g. 2026-11-19T21:45:00>
set -euo pipefail
STACK=$1 PREFIX=$2 AT=$3
REGION=${AWS_REGION:-us-east-1}
export AWS_PAGER=""
role=$(aws cloudformation describe-stacks --region "$REGION" --stack-name "$STACK" \
  --query "Stacks[0].Outputs[?OutputKey=='TeardownRoleArn'].OutputValue" --output text)
[[ $role == arn:* ]] || { echo "no TeardownRoleArn output on $STACK" >&2; exit 1; }

# One minute earlier: delete SSM parameters under /<prefix>/ (they live outside the stack).
params_at=$(python3 -I -c "import datetime,sys;t=datetime.datetime.fromisoformat(sys.argv[1]);print((t-datetime.timedelta(minutes=1)).isoformat())" "$AT")
names=$(aws ssm get-parameters-by-path --region "$REGION" --path "/$PREFIX/" --recursive --query 'Parameters[].Name' --output json)

upsert() { # name expression target-arn input-json
  local args=(--region "$REGION" --name "$1" --schedule-expression "at($2)" --schedule-expression-timezone UTC
    --flexible-time-window Mode=OFF --action-after-completion DELETE
    --target "$(python3 -I -c 'import json,sys;print(json.dumps({"Arn":sys.argv[1],"RoleArn":sys.argv[2],"Input":sys.argv[3],"RetryPolicy":{"MaximumRetryAttempts":20,"MaximumEventAgeInSeconds":3600}}))' "$3" "$role" "$4")")
  if aws scheduler get-schedule --region "$REGION" --name "$1" >/dev/null 2>&1; then
    aws scheduler update-schedule "${args[@]}" >/dev/null
  else
    aws scheduler create-schedule "${args[@]}" >/dev/null
  fi
  echo "armed $1 at $2 UTC"
}

if [[ $names != "[]" ]]; then
  upsert "$PREFIX-delete-params" "$params_at" arn:aws:scheduler:::aws-sdk:ssm:deleteParameters "{\"Names\":$names}"
else
  echo "no SSM parameters under /$PREFIX/ yet (re-run this after adding any)"
fi
upsert "$PREFIX-delete-stack" "$AT" arn:aws:scheduler:::aws-sdk:cloudformation:deleteStack "{\"StackName\":\"$STACK\"}"
aws scheduler list-schedules --region "$REGION" --name-prefix "$PREFIX" --query 'Schedules[].[Name,State]' --output text
