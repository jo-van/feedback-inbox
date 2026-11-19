#!/usr/bin/env bash
# Run a shell script on the factory VM through SSM and print its output.
# usage: vm.sh [-i instance] [-t timeout_sec] <<'SCRIPT' ... SCRIPT   (or: vm.sh 'command')
set -euo pipefail
REGION=${AWS_REGION:-us-east-1}
INST=$(aws cloudformation describe-stacks --region "$REGION" --stack-name feedback-factory --query "Stacks[0].Outputs[?OutputKey=='InstanceId'].OutputValue" --output text)
TIMEOUT=1800
while getopts "i:t:" o; do case $o in i) INST=$OPTARG;; t) TIMEOUT=$OPTARG;; esac; done; shift $((OPTIND-1))
if [[ $# -gt 0 ]]; then SCRIPT="$*"; else SCRIPT=$(cat); fi
params=$(python3 -I -c 'import json,sys;print(json.dumps({"commands":[sys.argv[1]],"executionTimeout":[sys.argv[2]]}))' "$SCRIPT" "$TIMEOUT")
cid=$(aws ssm send-command --region "$REGION" --instance-ids "$INST" --document-name AWS-RunShellScript --timeout-seconds 60 --parameters "$params" --query Command.CommandId --output text)
while :; do
  sleep 3
  st=$(aws ssm get-command-invocation --region "$REGION" --command-id "$cid" --instance-id "$INST" --query Status --output text 2>/dev/null || echo Pending)
  case $st in Pending|InProgress|Delayed) continue;; esac
  break
done
aws ssm get-command-invocation --region "$REGION" --command-id "$cid" --instance-id "$INST" --query '[StandardOutputContent,StandardErrorContent]' --output text
[[ $st == Success ]] || { echo "[vm.sh] status: $st" >&2; exit 1; }
