#!/usr/bin/env bash
# Put a request back in the queue (testing only). usage: requeue.sh <id>
set -euo pipefail
id=$1; sk=$(printf 'REQ#%06d' "$id")
aws dynamodb update-item --region us-east-1 --table-name feedback-factory-prod --key "{\"pk\":{\"S\":\"REQ\"},\"sk\":{\"S\":\"$sk\"}}" \
  --update-expression "SET stage = :r, round = :z REMOVE publicReason, checks, previewUrl, prUrl, branch, sha, review, security, tests, releaseSha, releaseStep" \
  --expression-attribute-values '{":r":{"S":"received"},":z":{"N":"0"}}'
echo "requeued #$id"
