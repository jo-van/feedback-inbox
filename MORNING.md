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

__RESULTS__

Full evidence log: `docs/evidence.md`. Security review and fixes: `docs/security-review.md`.

## What does not work, or is weaker than planned

__GAPS__

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

__COSTS__

## Teardown (automatic)

- 4:44pm ET: AWS Scheduler deletes the secrets. 4:45pm: it deletes the whole AWS stack (server, database tables, roles).
- 4:50pm: if the server still exists, it switches itself off, and that deletes it.
- 5:00pm (and 5:30, 6:00 if the laptop was asleep): this laptop runs `infra/teardown.sh`, removes anything left plus the GitHub deploy key, and writes `TEARDOWN-RECEIPT.md`. Expected: every row empty.
- All three were proven tonight on throwaway copies. The Vercel site and GitHub repo stay (not AWS); after teardown the app has no data.
- To tear down early by hand: `~/projects/feedback-inbox/infra/teardown.sh`.

## Feedback I need from you

__FEEDBACK__
