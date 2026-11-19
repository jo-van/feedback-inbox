#!/usr/bin/env bash
# Print stage changes for one request until it finishes. usage: watch.sh <id> [max_seconds]
id=$1; end=$((SECONDS+${2:-2400})); last=""
while [ $SECONDS -lt $end ]; do
  s=$(curl -s https://ideas-built-live.vercel.app/api/factory-status | python3 -I -c 'import json,sys;d=json.load(sys.stdin);t=[x for x in d["tickets"] if x["id"]==int(sys.argv[1])][0];print(t["stage"],"r"+str(t.get("round",0)),json.dumps(t.get("checks") or {}),(t.get("publicReason") or "")[:90])' "$id" 2>/dev/null)
  if [ "$s" != "$last" ]; then echo "$(date -u +%T) $s"; last=$s; fi
  case $s in released*|needs_human*|rejected*) exit 0;; esac
  sleep 8
done
