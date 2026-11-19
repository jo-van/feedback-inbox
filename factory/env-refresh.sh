#!/usr/bin/env bash
# Pull secrets from SSM into a root-only env file.
set -euo pipefail
umask 077; mkdir -p /etc/ff
get() { aws ssm get-parameter --region us-east-1 --name "/feedback-factory/$1" --with-decryption --query Parameter.Value --output text; }
{
  echo "FF_TOKEN=$(get ff-token)"
  echo "CLAUDE_CODE_OAUTH_TOKEN=$(get claude-token)"
  echo "GEMINI_API_KEY=$(get gemini-key)"
  echo "AWS_REGION=us-east-1"
  cat /etc/ff/ff.conf 2>/dev/null || true
} > /etc/ff/ff.env.new
mv /etc/ff/ff.env.new /etc/ff/ff.env
