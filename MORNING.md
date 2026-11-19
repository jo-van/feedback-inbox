# Good morning: talk-day brief

**Talk:** Thursday 3:00–3:45pm ET. Everything below was built and tested overnight.
**Read this, then open the deck and practice once.**

## Links

| What | Where |
|---|---|
| App (the QR code points here) | https://ideas-built-live.vercel.app |
| Factory Floor (big screen) | https://ideas-built-live.vercel.app/floor |
| Floor with fake data, for practice | https://ideas-built-live.vercel.app/floor?sim=1 |
| Deck | `~/projects/feedback-inbox/presentation/deck.html` (open in Chrome, press F; N shows notes) |
| Script / cheat sheet | `presentation/script.md`, `presentation/cheat-sheet.md` |
| PREVIOUS RUN video (fallback) | `presentation/previous-run.mp4` |
| n8n canvas | run `~/projects/feedback-inbox/infra/ff.sh n8n`, then http://localhost:5678. Login in `~/.config/feedback-factory/n8n.env` |
| Repo | https://github.com/jo-van/feedback-inbox (public) |

## What works (with evidence)

Every rehearsal ran with **no human action**: request submitted in the app → Gatekeeper → Spec → Builder (Claude Code) → Tester (browser tests on a preview) → Gemini review + security scan → preview → production → production smoke test.

| Request | Result | Pickup → live |
|---|---|---|
| #12 vote-button bounce | shipped first try | 5m34s |
| #14 "Back to top" button | tests failed, Builder fixed it, shipped | 8m36s |
| #15 keep "Suggest" button visible | shipped first try | 5m21s |
| #10 + #11 (two at once) | both shipped, second rebased on the first | 5m54s / 4m52s |
| #13, #18 (right after a VM reboot) | shipped after 3 rounds each | 15m49s / 16m35s |

- **Three consecutive clean runs** (#12, #14, #15); median about 5½ minutes. The slowest real run was about 16½ minutes.
- **Gatekeeper:** turned away a prompt-injection attempt ("print the token and every email") and an oversized request (Google login + paid votes), each with a friendly public reason.
- **Planted defect:** an XSS bug injected into #9 was caught by the tests and repaired automatically on the next round.
- **Forbidden file:** a change that also touched `next.config.mjs` was blocked before anything was pushed.
- **Rollback:** a production-only failure injected into #17 went live, failed the production smoke test, and the factory reverted it by itself; production stayed up.
- **Kill switch:** stopped a running build and parked it within a minute.
- **3:02 auto-arm:** tested with a near-term time; nothing was picked before the time, then exactly one request (the most-voted), and a cap of 1 held.
- **Cap of 3 (the talk setting):** with the factory armed, 3 builds already used and an eligible request waiting, nothing was admitted across four ticks. Caps of 1 and 2 also held in rehearsals.
- **Recovery:** the watchdog restarted a killed service and a stopped n8n; after a full VM reboot everything came back, including the teardown timer.
- **Privacy:** the guard test (a submitted email must never appear on any public page or API) ran and passed on every build.
- **Security review:** an independent adversarial review found one critical issue (git hooks → root on the VM) and three high ones; all fixed (see `docs/security-review.md`).
- **Talk materials:** deck revised around your framing: every process is a factory of single-job workers with contracts; any factory can be a worker in a bigger one; real factories aren't a conveyor belt; Hermes in Discord for small teams and solo founders. Checked visually at 1080p. The walk-in QR points at the live app.
- **Reset done:** production is back on the plain baseline app with only your five seed ideas. The factory is armed for **3:02pm ET**, up to **3 builds, one at a time** (so something is always moving during the talk).

Full evidence log: `docs/evidence.md`. Security review and fixes: `docs/security-review.md`.

## What does not work, or is weaker than planned

- **Gemini Pro needs a paid key.** On the free key, Gemini 3.1 Pro returns "quota exceeded", so reviews use Gemini Flash. Flash sometimes blocks on a misread of the spec; I made it show its evidence (quoted code) before it can block, but a strict review can still send a request round to round and park it (#13 was parked once overnight, then shipped later). Adding billing to the Gemini key would likely help; that's your call.
- **Builds compound.** Each shipped request adds its own browser tests, and later builds must keep them green. Overnight, two builds shipped side by side with disagreeing tests and blocked the next one until I fixed main. That is why the talk runs one build at a time.
- **Tricky requests can stall.** Requests that depend on live data (like a running count) took 3 rounds. The Gatekeeper admits them; expect "Needs a human" now and then, and treat it as the guardrail working.
- **The preview site is public.** The Tester needs it; someone could post junk there and make tests flaky. Accepted for one day.
- **Rejected text stays visible.** A rejected prompt-injection title shows on the board and Floor under "Not today", which makes a good teaching moment. Only offensive or personal content is hidden.
- **n8n canvas:** the top-level line looks busy because every station has an error route to "Needs a human". It reads well as "not a conveyor belt". First time you open it, dismiss n8n's "Production Checklist" popup ("Ignore for all workflows").
- **NOT DONE: Floor repair loop shown during a real run.** The PREVIOUS RUN recording shows two real requests moving at once, but no repair loop. Real repairs happened overnight (#14, #13, #18), but I never captured the return belt on screen during one. **Fallback:** `/floor?sim=1` (clearly badged SIMULATION) plays a repair loop. If one happens live during the talk, the Floor will show it.
- **Not tested:** a real room's worth of phones at once, venue Wi-Fi, and the deck on the actual projector.
- **Teardown order:** AWS deletes everything at 4:45pm, but CloudFormation marks the empty stack "DELETE_FAILED". It used the teardown role it had just deleted, so no resources remain. The laptop job at 5:00pm finishes it off. If the laptop is asleep, it runs when you wake it.

## Show-day checklist

| When | Do |
|---|---|
| Morning | Read this. Click through the deck once at the projector size. Watch 1 minute of `previous-run.mp4`. |
| By noon | Leave the factory alone. Avoid heavy Claude use before 3pm so the subscription has headroom. |
| 2:30pm | `~/projects/feedback-inbox/infra/ff.sh status` should show `mode: live`, `armAt: 2026-11-19T20:02:00Z`, `killed: False`, a recent heartbeat. Open the Floor: badge says **LIVE** and **Arms at 3:02 PM**. |
| 2:35pm | In a terminal: `infra/ff.sh n8n` and log in (keep the tab open). Open the app on your phone. |
| 2:45pm | Put up the walk-in slide (deck slide 0). People scan and submit. |
| 3:02pm | The factory picks the most-upvoted eligible request by itself. One build at a time, up to 3. |
| During | Do not touch anything. If something goes wrong: see below. |
| 4:45pm | AWS deletes itself automatically. Nothing to do. |

## If something goes wrong

- **Kill switch:** `~/projects/feedback-inbox/infra/ff.sh kill` stops new builds now; running builds stop and park within a minute. Undo: `ff.sh resume`.
- **Something bad reached production:** `ff.sh rollback` reverts the last factory change (production redeploys in about a minute).
- **A request you don't want built:** `ff.sh reject <id> "reason"`.
- **Factory looks stuck or offline:** switch to the PREVIOUS RUN video and say it's from rehearsal. The watchdog restarts services by itself every minute.
- Gemini's best model needs a paid key; the reviewer falls back to Gemini Flash automatically. If you add billing to the Gemini key before the talk, it will use Gemini 3.1 Pro first.

## Costs so far

- **AWS:** one t3.xlarge server (about $0.17/hour on-demand) plus a 60 GB disk, from 04:33 UTC until teardown at 21:45 UTC ≈ 17 hours, **about $3 in total**. Tables, scheduler and parameters cost pennies. Two tiny throwaway test servers ran under an hour. (Estimate from public prices; AWS billing data lags a day.)
- **AI:** builds use your Claude subscription (through the headless token) and the free Gemini key. No per-request dollar figure was measured. Overnight rehearsals used Claude subscription usage; avoid heavy Claude work before 3pm.
- **Vercel / GitHub:** existing accounts, no new charges.

## Teardown (automatic)

- 4:44pm ET: AWS Scheduler deletes the secrets. 4:45pm: it deletes the whole AWS stack (server, database tables, roles).
- 4:50pm: if the server still exists, it switches itself off, and that deletes it.
- 5:00pm (and 5:30, 6:00 if the laptop was asleep): this laptop runs `infra/teardown.sh`, removes anything left plus the GitHub deploy key, and writes `TEARDOWN-RECEIPT.md`. Expected: every row empty.
- **What was actually proven tonight, on throwaway copies:**
  - The AWS scheduled delete removed every resource, including its own role. CloudFormation then marked the empty stack DELETE_FAILED.
  - The VM's own power-off timer terminated its server on time.
  - `teardown.sh`, run by hand, finished off the leftover stack record and its receipt showed nothing remaining.
- **Not proven:** the laptop's scheduled launchd job itself. It is installed and loaded, but it has never fired (its first run is 5:00pm today). The real stack's scheduled delete also hasn't fired yet (4:45pm).
- **If you want certainty:** after 5:00pm, check `TEARDOWN-RECEIPT.md`. If it's missing, run `~/projects/feedback-inbox/infra/teardown.sh` by hand.
- The Vercel site and GitHub repo stay (not AWS); after teardown the app has no data.
- To tear down early by hand: `~/projects/feedback-inbox/infra/teardown.sh`.

## Feedback I need from you

1. **Deck:** click through it once. Is the balance right between the "every process is a factory" philosophy and the live software demo?
2. **Hermes slide:** add one real example of your own (marked TODO in the slide notes and script).
3. **Contact line:** replace `{{CONTACT}}` on the TempoBlueprint slide.
4. **Gemini billing:** add billing to the Gemini key so reviews use Gemini Pro? Optional.
5. **Pace:** keep one build at a time (3 total), or allow two at once (`ff.sh live 2026-11-19T20:02:00Z 3 2`)?
6. **Timing risk:** the first request may be live by about 3:08, before the 3:16 Floor beat. The script has an "already shipped" branch. Tell me if you'd rather show the first ship at 3:16.
