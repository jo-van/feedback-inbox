# Independent security review (overnight, 2026-11-19)

A separate reviewer with no prior context read the whole repo adversarially (read-only). Findings and what was done:

| Severity | Finding | Status |
|---|---|---|
| Critical | Builder-written code could write `.git` hooks/config that the host then runs as root (secrets, deploy key) | **Fixed**: sandbox and test containers see `.git` read-only; every host git call runs with `core.hooksPath=/dev/null` and `core.fsmonitor=false`; global `safe.directory=*` removed |
| High | Claude token reachable by builder-written code; Playwright container had open internet | **Fixed**: token only passed to Claude runs; Playwright runs on an internal network whose only exit is a proxy allowing our own Vercel hosts; repo mounted read-only there |
| High | Unscreened text shown on the projector before the Gatekeeper sees it | **Fixed**: production shows "New idea (being screened…)" until screened (`FF_MASK_UNSCREENED=1`) |
| High | Rate limits would lock out a room on one venue IP | **Fixed**: 100 submissions/10 min per IP, 400 global, 1000 votes/10 min per IP |
| Medium | Submission flood delays real work and burns usage | **Fixed**: screening in vote order; beyond the top 40 unscreened, requests are declined without model calls |
| Medium | Factory could add an API route that leaks future emails | **Fixed**: allowlist excludes `app/api/`, `lib/requests.ts`, `lib/db.ts`, `lib/contacts.ts`; `public/` limited to images |
| Medium | Public preview can be poisoned; tool output reached prompts unmarked | **Partly fixed**: tool output is now wrapped as untrusted data; `ff.sh reject <id>` added. Preview stays public (the Tester needs it); accepted for a one-day demo |
| Medium | No operator rollback for bad-but-working content; failed revert threw | **Fixed**: `ff.sh rollback`; release now reports a failed revert instead of crashing |
| Defense in depth | Pattern scan is easy to evade | **Added** a Content-Security-Policy (no external connections, frames, objects or form targets) |
| Low | Release can rebase onto newer main without re-testing | Accepted for the demo (only one release at a time) |

Checked and sound per the reviewer: contact tables are write-only for the app and denied to the VM; public API field whitelist; Floor escaping; proxy host matching; sandbox isolation (internal network, cap-drop ALL, no-new-privileges, non-root); IMDS hop limit; station service bound to localhost with a token; GitHub Actions run without secrets; atomic build cap.
