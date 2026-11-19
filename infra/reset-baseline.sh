#!/usr/bin/env bash
# Reset the demo to its clean talk-day baseline:
#  - app code (app/, components/, lib/, tests/e2e/) back to the pre-factory baseline commit
#  - factory/* branches deleted on GitHub
#  - production and preview data wiped and reseeded
#  - factory armed for the talk (3:02pm ET, cap 3, one build at a time)
# usage: reset-baseline.sh [baseline-commit]
set -euo pipefail
BASE=${1:-e7036d1}
cd "$(dirname "$0")/.."
git pull -q --rebase
git checkout "$BASE" -- app components lib tests/e2e
for f in tests/e2e/req-*.spec.ts; do [ -e "$f" ] && git rm -q -f "$f"; done
if git diff --cached --quiet; then echo "app already at baseline"; else
  git -c user.name="Jonathan Vanderford" -c user.email="jo-van@users.noreply.github.com" commit -qm "Reset app to the talk-day baseline

Rehearsal changes built by the factory overnight are removed so the
audience starts from the plain app.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
  git push -q && echo "pushed baseline app"
fi
for b in $(gh api repos/jo-van/feedback-inbox/branches --paginate --jq '.[].name' | grep '^factory/' || true); do
  gh api -X DELETE "repos/jo-van/feedback-inbox/git/refs/heads/$b" >/dev/null && echo "deleted branch $b"
done
infra/vm.sh -t 300 'export HOME=/root; cd /srv/ff/src && git -c safe.directory=/srv/ff/src pull -q; rm -rf /srv/ff/work/*; cd factory && node seed.mjs feedback-factory-prod --reset && node seed.mjs feedback-factory-preview --reset; git -C /srv/ff/mirror.git -c safe.directory="*" fetch -q --prune origin "+refs/heads/*:refs/heads/*"' | tail -4
infra/ff.sh live 2026-11-19T20:02:00Z 3 1
