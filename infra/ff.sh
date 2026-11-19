#!/usr/bin/env bash
# Operator controls for the feedback factory. Runs from the laptop (uses the default AWS profile).
#   ff.sh status                 show factory state and in-flight requests
#   ff.sh kill                   KILL SWITCH: stop admissions and stop running builds now
#   ff.sh resume                 undo kill
#   ff.sh rehearse <cap>         arm a rehearsal now with a build cap (resets the admitted count)
#   ff.sh live [armAtISO] [cap]  arm for the talk (default 2026-11-19T20:02:00Z = 3:02pm ET, cap 3)
#   ff.sh submit "<title>" "<done when>" [name]   submit a request through the real app
#   ff.sh vote <id> [n]          add n upvotes through the real app
#   ff.sh n8n                    open the n8n editor (SSM tunnel to localhost:5678)
#   ff.sh rollback               revert the most recent factory commit on main (production redeploys in ~1 min)
#   ff.sh reject <id> [reason]   take a request out of the queue
set -euo pipefail
export AWS_PAGER=""
TABLE=feedback-factory-prod
APP=${FF_APP_URL:-https://ideas-built-live.vercel.app}
R="--region us-east-1"
upd() { aws dynamodb update-item $R --table-name $TABLE --key '{"pk":{"S":"FACTORY"},"sk":{"S":"STATE"}}' "$@"; }

case ${1:-status} in
  status)
    curl -s "$APP/api/factory-status" | python3 -I -c '
import json,sys
d=json.load(sys.stdin); f=d["factory"]
print("factory:", {k:f.get(k) for k in ["mode","armed","armAt","cap","admitted","killed","health","heartbeat"]})
for t in sorted(d["tickets"], key=lambda t: t["id"]):
    print(f"#{t[\"id\"]:>3} {t[\"stage\"]:<12} r{t.get(\"round\",0)} v{t[\"votes\"]:<3} {t[\"title\"][:60]}  {t.get(\"publicReason\") or \"\"}")'
    ;;
  kill)
    upd --update-expression "SET killed = :t" --expression-attribute-values '{":t":{"BOOL":true}}'
    echo "KILL SWITCH ON: no new admissions; running builds are stopped within a minute and parked."
    ;;
  resume)
    upd --update-expression "SET killed = :f" --expression-attribute-values '{":f":{"BOOL":false}}'
    echo "kill switch off"
    ;;
  rehearse)
    upd --update-expression "SET #m = :m, armed = :t, cap = :c, admitted = :z, killed = :f" --expression-attribute-names '{"#m":"mode"}' \
      --expression-attribute-values "{\":m\":{\"S\":\"rehearsal\"},\":t\":{\"BOOL\":true},\":c\":{\"N\":\"${2:-1}\"},\":z\":{\"N\":\"0\"},\":f\":{\"BOOL\":false}}"
    echo "rehearsal armed, cap ${2:-1}"
    ;;
  live)
    upd --update-expression "SET #m = :m, armed = :f, armAt = :a, cap = :c, admitted = :z, killed = :f, allowSeeded = :f" --expression-attribute-names '{"#m":"mode"}' \
      --expression-attribute-values "{\":m\":{\"S\":\"live\"},\":f\":{\"BOOL\":false},\":a\":{\"S\":\"${2:-2026-11-19T20:02:00Z}\"},\":c\":{\"N\":\"${3:-3}\"},\":z\":{\"N\":\"0\"}}"
    echo "LIVE: auto-admission arms at ${2:-2026-11-19T20:02:00Z} (cap ${3:-3})"
    ;;
  submit)
    curl -s -X POST "$APP/api/requests" -H 'Content-Type: application/json' \
      -d "$(python3 -I -c 'import json,sys;print(json.dumps({"title":sys.argv[1],"doneWhen":sys.argv[2],"name":sys.argv[3]}))' "$2" "$3" "${4:-Rehearsal}")"; echo
    ;;
  vote)
    for _ in $(seq 1 "${3:-1}"); do curl -s -X POST "$APP/api/requests/$2/vote" >/dev/null; done; echo "voted $2 x${3:-1}"
    ;;
  rollback)
    d=$(mktemp -d); git clone -q https://github.com/jo-van/feedback-inbox.git "$d/r" && cd "$d/r"
    sha=$(git log --author='Feedback Factory' --format=%H -n 1 --no-merges main)
    [[ -n $sha ]] || { echo "no factory commit on main"; exit 1; }
    echo "reverting $(git log -1 --format='%h %s' "$sha")"
    git -c user.name="Jonathan Vanderford" -c user.email="jo-van@users.noreply.github.com" revert --no-edit "$sha"
    git push -q https://github.com/jo-van/feedback-inbox.git HEAD:main && echo "pushed revert; production redeploys in about a minute"
    ;;
  reject)
    sk=$(printf 'REQ#%06d' "$2")
    aws dynamodb update-item $R --table-name $TABLE --key "{\"pk\":{\"S\":\"REQ\"},\"sk\":{\"S\":\"$sk\"}}" \
      --update-expression "SET stage = :s, screened = :t, eligible = :f, publicReason = :why" \
      --expression-attribute-values "{\":s\":{\"S\":\"rejected\"},\":t\":{\"BOOL\":true},\":f\":{\"BOOL\":false},\":why\":{\"S\":\"${3:-Not a fit for today.}\"}}"
    echo "rejected #$2"
    ;;
  inject)  # rehearsal only: inject <id> xss|path|smoke|none
    if [[ ${3:-none} == none ]]; then
      upd --update-expression "REMOVE inject.#i" --expression-attribute-names "{\"#i\":\"$2\"}"
    else
      upd --update-expression "SET inject = if_not_exists(inject, :m)" --expression-attribute-values '{":m":{"M":{}}}'
      upd --update-expression "SET inject.#i = :k" --expression-attribute-names "{\"#i\":\"$2\"}" --expression-attribute-values "{\":k\":{\"S\":\"$3\"}}"
    fi
    echo "inject #$2 = ${3:-none}"
    ;;
  n8n)
    INST=$(aws cloudformation describe-stacks $R --stack-name feedback-factory --query "Stacks[0].Outputs[?OutputKey=='InstanceId'].OutputValue" --output text)
    echo "n8n editor: http://localhost:5678  (login in ~/.config/feedback-factory/n8n.env). Ctrl-C to close."
    (sleep 4; open http://localhost:5678) &
    aws ssm start-session $R --target "$INST" --document-name AWS-StartPortForwardingSession --parameters '{"portNumber":["5678"],"localPortNumber":["5678"]}'
    ;;
  *) sed -n 2,13p "$0"; exit 1 ;;
esac
