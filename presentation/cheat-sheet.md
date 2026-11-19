# Cheat sheet · Your Ideas, Built Live · Thu 2026-11-19, 3:00–3:45pm ET

Deck keys: **→ / Space / PageDown** next · **← / PageUp** back · **N** notes · **F** fullscreen · **B** black screen. The counter (bottom right) is shown in [brackets] below.

**The one idea:** a process = **workers** (one job each) + **contracts** (what goes in, what comes out) + **routing** (who gets it next). Any factory can be a worker inside a bigger factory. Software is the live example, not the point.

## Timeline

| Clock | Counter | What | Key line |
| --- | --- | --- | --- |
| 2:45 | [0] | Walk-in QR | "Scan it, play, suggest, upvote." |
| **3:00** | [1] | Title + promise | "Something you asked for goes live before we finish. This isn't really a talk about software." |
| 3:01 | [2] | Your job today | "Scan, play, suggest, upvote. At 3:05 the factory takes the top one." |
| **3:02–3:06** | [2] | **LIVE A** · admission | Read the top 3 aloud. "Voting closes at 3:05." At 3:05 read the Gatekeeper's decision and reason. Quick flip to the Floor. |
| 3:06 | [3] | Every process is a factory | Workers · contracts · routing. Hiring is a factory, and one worker in the CEO's factory. |
| 3:09 | [4] | You already run a few of these | Lead · support ("Still stuck? Goes to you") · family trip. "Keep one process of your own in mind." |
| 3:10:30 | [5] | The founder's road | Lovable/v0/Replit → off the rails → Claude Code/Codex → your own factory. **Kyndly line (spoken only):** "one or two people shipping at the pace that used to take a team of twenty", framed as my own experience. |
| 3:13:30 | [6] | Today's factory (diagram) | Read each yellow contract. Point at "round 2." No time promise: "easy ones went live in minutes in rehearsal; tricky ones take rounds." |
| **3:16–3:19** | [7] | **LIVE B** · Factory Floor | Crate, lights (blue/green/red), clock, queue, "Shipped today." May already be shipped: save the reveal for 3:35. |
| 3:19 | [8] | Not a conveyor belt | Route · skip · side by side · loop back · to a person. "The demo line is simplified for 45 minutes." |
| **3:21–3:25** | [9] | **LIVE B2** · n8n | Top level → today's run → one station's in/out → open **Builder** → mini factory. |
| 3:25 | [10] | Second AI reviews | "Don't let the student grade their own exam." |
| 3:26:30 | [11] | Agent in chat (Hermes) | Anyone can ask · connected to our tools · follows our process · scheduled standup updates · team of one plus agents. *(Optional TODO example.)* |
| 3:30 | [12] | What humans own | Choose what matters · define done · design factory & guardrails · own outcomes. "Your first hires should build the line, not stand on it." |
| 3:31:30 | [13] | Cost | Setup weeks (the real cost) · $5/month server or a laptop (offline when asleep) · Claude + ChatGPT subscriptions · no per-request $. |
| 3:32:30 | [14] | Your turn | 20-second pause. Workers → contracts → routing → hand one job to AI. |
| 3:34 | [15] | Today's results | **Check the Floor before speaking.** |
| **3:35–3:40** | [16] | **LIVE C** · production | Production app → find change → requester tries it on phone → Floor "Shipped today" + clock. |
| 3:40 | [17] | Q&A | Seed questions in script. **3:44:30 wrap. 3:45 hard stop.** |

## The three live cut-aways

1. **Factory Floor** (3:16, from [7]): `APP_URL/floor`. Show the crate's station, what the lights mean, the clock, the waiting queue (other audience ideas), "Shipped today." If request one already shipped, say so and save the phone reveal for 3:35.
2. **n8n** (3:21, from [9]): n8n canvas (local tunnel). Top-level stations → today's execution → click a finished station to show its input and output → double-click **Builder**: read code → plan → edit → run tests → fix. Point at the Reviewer's send-back path.
3. **Production + Floor** (3:35, from [16]): `APP_URL`. Refresh, find the change, hand it to the requester, then Floor "Shipped today" and the elapsed time.

Plus the **3:05 admission beat** (from [2]): app top-voted list → Gatekeeper decision → Floor shows the crate.

## Fallback triggers

| Beat | Trigger | Do this |
| --- | --- | --- |
| LIVE A | No Gatekeeper decision by **3:07** | "It's taking its time. Keep voting." Move on; re-check before [6]. |
| LIVE A | Nothing eligible | Read the reason. Ask for small, specific requests about this app. Move on. |
| LIVE B | Already in "Shipped today" | Read the clock. "We'll try it on your phones at 3:35." Follow the next crate if there is one. |
| LIVE B | Crate red / stopped | "The line stopped itself. That's the guardrail working." |
| LIVE B | Floor won't load or nothing moving by **3:17** | Play the **PREVIOUS RUN** video. Say "previous run, from rehearsal" out loud. |
| LIVE B2 | Run hasn't reached Builder | Open the Builder sub-workflow definition instead of the execution. |
| LIVE B2 | Tunnel / n8n down for **30 seconds** | Back to [6] diagram, then PREVIOUS RUN n8n clip, labeled. |
| LIVE C | Not shipped at **3:35** | Show where it is. Go to [17] Q&A. Re-check during Q&A. Return by **3:43**. |
| LIVE C | Rolled back / blocked | "It undid its own change. Production never broke." Then PREVIOUS RUN video, labeled. |
| LIVE C | Still not done at **3:44** | "It'll finish after we leave. The app link will show it." |
| Any | Running long | Trim the middle of [5] and the commentary on [12]. Never cut LIVE C. |

**Never** present the recording as today's run. **Never** touch the factory by hand during the talk. Rehearsal numbers are always "in rehearsal."

## Kill switch & URLs

| What | Where |
| --- | --- |
| App (QR target) | https://ideas-built-live.vercel.app |
| Factory Floor | https://ideas-built-live.vercel.app/floor |
| Floor rehearsal mode (fake data, badged) | https://ideas-built-live.vercel.app/floor?sim=1 |
| n8n canvas | In a terminal: `~/projects/feedback-inbox/infra/ff.sh n8n`, then http://localhost:5678. Login in `~/.config/feedback-factory/n8n.env` |
| Status in a terminal | `~/projects/feedback-inbox/infra/ff.sh status` |
| **KILL SWITCH** | `~/projects/feedback-inbox/infra/ff.sh kill` (stops new builds now; running builds stopped and parked within a minute). Undo: `ff.sh resume` |
| PREVIOUS RUN video | `~/projects/feedback-inbox/presentation/previous-run.mp4` |
| Auto-admission | Arms itself at **3:05pm**, top-voted eligible request, up to **5** builds, one at a time, reviewed by Codex |
| AWS teardown | Automatic at **4:45pm** (nothing to do). Receipt: `~/projects/feedback-inbox/TEARDOWN-RECEIPT.md` after 5pm |
