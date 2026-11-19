# Cheat sheet · Your Ideas, Built Live · Thu 2026-11-19, 3:00–3:45pm ET

Deck keys: **→ / Space / PageDown** next · **← / PageUp** back · **N** notes · **F** fullscreen · **B** black screen. The counter (bottom right) is shown in [brackets] below.

## Timeline

| Clock | Counter | What | Key line |
| --- | --- | --- | --- |
| 2:45 | [0] | Walk-in QR | "Scan it, play, suggest, upvote." |
| **3:00** | [1] | Title + promise | "Something you asked for goes live before we finish. Nobody touches the code." |
| 3:01 | [2] | Your job today | "Scan, play, suggest, upvote. At 3:02 the factory takes the top one." |
| **3:02–3:05** | [2] | **LIVE A** · admission | Read the top 3 aloud. Read the Gatekeeper's decision and reason. Quick flip to the Floor. |
| 3:05 | [3] | Lovable / v0 / Replit | "Step one. Not a toy. It's how you found your customers." |
| 3:07 | [4] | Off the rails | "Fix one bug, two appear. You get scared to touch it." |
| 3:09 | [5] | Claude Code & Codex | "Real codebase, real tests. But you're still every handoff." |
| 3:11 | [6] | Your own AI-DLC | Capabilities → agents & skills → triggers & logic → factory. **Kyndly line (spoken only):** "one or two people shipping at the pace that used to take a team of twenty", framed as my own experience. |
| 3:14 | [7] | Factory diagram | Left to right, one sentence each. Point at the dashed "round 2" arrow. |
| **3:16–3:19** | [8] | **LIVE B** · Factory Floor | Crate, station lights (blue/green/red), clock, queue, "Shipped today." |
| 3:19 | [9] | Factories all the way down | "Every box has a contract: what goes in, what comes out." |
| **3:21–3:26** | [10] | **LIVE B2** · n8n | Top level → today's run → one station's input/output → open **Builder** → mini factory. |
| 3:26 | [11] | Second AI reviews | "Don't let the student grade their own exam." |
| 3:28:30 | [12] | What humans own | Choose what matters · define done · design factory & guardrails · own outcomes. |
| 3:31 | [13] | Cost | "Setup is weeks, not an afternoon. Running is a subscription, not salaries." *(TODO numbers)* |
| 3:32:30 | [14] | Start with one station | Six steps. "Each one is useful by itself." |
| 3:34 | [15] | Today's results | **Check the Floor before speaking.** |
| **3:35–3:40** | [16] | **LIVE C** · production | Production app → find change → requester tries it on phone → Floor "Shipped today" + clock. |
| 3:40 | [17] | TempoBlueprint | Assessment → setup → training. Read {{CONTACT}}. |
| 3:42 | [18] | Q&A | Seed questions in script. **3:44:30 wrap. 3:45 hard stop.** |

## The three live cut-aways

1. **Factory Floor** (3:16, from [8]): `APP_URL/floor`. Show the crate's station, what the lights mean, the clock, the waiting queue (other audience ideas), empty "Shipped today."
2. **n8n** (3:21, from [10]): n8n canvas (local tunnel). Top-level stations → today's execution → click a finished station to show its input and output → double-click **Builder**: read code → plan → edit → run tests → fix. Point at the Reviewer's send-back path.
3. **Production + Floor** (3:35, from [16]): `APP_URL`. Refresh, find the change, hand it to the requester, then Floor "Shipped today" and the elapsed time.

Plus the **3:02 admission beat** (from [2]): app top-voted list → Gatekeeper decision → Floor shows the crate.

## Fallback triggers

| Beat | Trigger | Do this |
| --- | --- | --- |
| LIVE A | No Gatekeeper decision by **3:04** | "It's taking its time. Keep voting." Move on; re-check before [7]. |
| LIVE A | Nothing eligible | Read the reason. Ask for small, specific requests about this app. Move on. |
| LIVE B | Crate red / stopped | "The line stopped itself. That's the guardrail working." |
| LIVE B | Floor won't load or nothing moving by **3:17** | Play the **PREVIOUS RUN** video. Say "previous run, from rehearsal" out loud. |
| LIVE B2 | Run hasn't reached Builder | Open the Builder sub-workflow definition instead of the execution. |
| LIVE B2 | Tunnel / n8n down for **30 seconds** | Back to [9] diagram, then PREVIOUS RUN n8n clip, labeled. |
| LIVE C | Not shipped at **3:35** | Show where it is. Go to [17] + Q&A. Re-check during Q&A. Return by **3:43**. |
| LIVE C | Rolled back / blocked | "It undid its own change. Production never broke." Then PREVIOUS RUN video, labeled. |
| LIVE C | Still not done at **3:44** | "It'll finish after we leave. The app link will show it." |
| Any | Running long | Trim [5] and the second half of [12]. Never cut LIVE C. |

**Never** present the recording as today's run. **Never** touch the factory by hand during the talk.

## Kill switch & URLs

> **TODO:** filled in by the kill-switch workstream (factory stop control, production URL, Floor URL with `?repo=`, n8n tunnel URL, PREVIOUS RUN video location, operator contact).
