# Your Ideas, Built Live: Inside an AI Software Factory

**Speaker script.** Louisville Startup Week, Thursday 2026-11-19, 3:00–3:45pm ET. Jonathan Vanderford.

45 minutes total. The deck is `deck.html`; slide numbers below match the counter in its bottom-right corner (press `N` for notes). "LIVE" beats are where you leave the deck and show a real screen.

Format notes:
- **Plain text is what you say.** *[Bracketed italics are stage directions.]*
- **IF SLOW / BLOCKED / FAILED** blocks are what you say if the live run isn't cooperating. Pick the one that matches what's on screen.
- The recorded fallback video is always introduced as **"a previous run"**. Never present it as today's run.
- Pace: about 140 words a minute. Word counts are already trimmed so live beats have room for pauses.

| Clock | Talk time | Slide / beat | Minutes |
| --- | --- | --- | --- |
| before 3:00 | — | 0 · Walk-in (QR) | — |
| 3:00 | 0:00–1:00 | 1 · Title + the promise | 1 |
| 3:01 | 1:00–2:00 | 2 · Your job today | 1 |
| **3:02** | **2:00–5:00** | **LIVE A · admission and Gatekeeper** (from slide 2) | 3 |
| 3:05 | 5:00–7:00 | 3 · Where founders start | 2 |
| 3:07 | 7:00–9:00 | 4 · Where it goes off the rails | 2 |
| 3:09 | 9:00–11:00 | 5 · Graduating to Claude Code and Codex | 2 |
| 3:11 | 11:00–14:00 | 6 · Your own AI-DLC | 3 |
| 3:14 | 14:00–16:00 | 7 · The software factory (diagram) | 2 |
| **3:16** | **16:00–19:00** | **LIVE B · Factory Floor** (slide 7 → 8) | 3 |
| 3:19 | 19:00–21:00 | 8 · Factories all the way down (diagram; counter shows 9) | 2 |
| **3:21** | **21:00–26:00** | **LIVE B2 · n8n, drill into Builder** (counter 10) | 5 |
| 3:26 | 26:00–28:30 | 9 · Why a second AI reviews the first | 2.5 |
| 3:28:30 | 28:30–31:00 | 10 · What humans still own | 2.5 |
| 3:31 | 31:00–32:30 | 11 · What it costs | 1.5 |
| 3:32:30 | 32:30–34:00 | 12 · Start with one station | 1.5 |
| 3:34 | 34:00–35:00 | 13 · Today's results | 1 |
| **3:35** | **35:00–40:00** | **LIVE C · production + "Shipped today"** | 5 |
| 3:40 | 40:00–42:00 | 14 · TempoBlueprint | 2 |
| 3:42 | 42:00–45:00 | 15 · Q&A | 3 |
| **3:45** | **45:00** | **Hard stop** | **45 total** |

Counter mapping (deck position → section): 0 walk-in · 1 title · 2 your job · 3 start · 4 off the rails · 5 Claude Code/Codex · 6 AI-DLC · 7 factory diagram · 8 LIVE Floor card · 9 nested diagram · 10 LIVE n8n card · 11 second AI · 12 humans own · 13 cost · 14 one station · 15 today's results · 16 LIVE production card · 17 TempoBlueprint · 18 Q&A.

---

## Before 3:00 · Slide 0 · Walk-in

*[Deck open on slide 0 from about 2:45pm. Factory Floor open in a second window. App top-voted list open in a third. As people sit down, say this to small groups, not the room.]*

Grab your phone and scan that code. It's a little app called Feedback Inbox. Play with it, then tap "Suggest a change" and tell us what you'd fix or add. And upvote the ones you like. The top one gets built during this session.

---

## 0:00–1:00 · 3:00pm · Slide 1 · Title + the promise

*[Press Right at 3:00 sharp.]*

Good afternoon. I'm Jonathan Vanderford, and this session is called "Your Ideas, Built Live."

I want to start with a promise, and it's on the screen. Something you asked for is going to go live, in a real app, in production, before we finish today.

"Production" just means the real version that real people use. Not a demo copy.

And here's the part that makes me a little nervous: I'm not going to build it. Nobody in this room is going to touch the code. Not me, not anyone. A software factory made out of AI agents is going to do the whole thing, start to finish, while I talk.

So if it works, you'll see it. And if it breaks, you'll see that too. Either way, you'll see what's real.

*[~140 words]*

---

## 1:00–2:00 · 3:01pm · Slide 2 · Your job today

Here's your job for the next 45 minutes. Thirty seconds of instructions.

One: scan the code. Two: play with the app. It's a feedback inbox. Ironically, it collects feature requests. Three: suggest a fix or a feature for that same app. Something small and specific works best. "Add a dark mode" is good. "Make it like Salesforce" is not going to make it today.

Four: upvote. You can vote on other people's ideas, and that's what decides the winner.

At 3:02, which is right about now, the factory automatically takes the top-voted request off the board and starts building it. No one presses a button. Let's go look.

*[~130 words. Glance at the clock. Switch to the app's top-voted list on the big screen.]*

---

## 2:00–5:00 · 3:02pm · LIVE A · Admission and the Gatekeeper

*[Big screen: the Feedback Inbox top-voted list (APP_URL). Read the top three requests aloud, with their vote counts.]*

Okay, here's what you're asking for. Number one, with [N] votes: "[read title]." Number two: "[read title]." And number three: "[read title]."

*[Pause. Let the room react.]*

Right now the first station in the factory is looking at number one. We call it the Gatekeeper. It's an AI with one job: decide whether a request is something the factory should take on right now.

It asks a few plain questions. Is this about this app? Is it clear enough to build? Is it small enough to finish today? And is it safe? Meaning it doesn't touch things like logins or deleting other people's data, and it isn't a joke request designed to break things.

If the top request doesn't pass, the Gatekeeper doesn't argue with you. It skips to the next eligible one, and it writes down why. That's the important bit: every decision leaves a note.

*[When the decision appears, read it.]*

And here's the decision. It picked "[admitted title]." The reason it gave was: "[read the Gatekeeper's one-line reason]."

*[If it skipped the #1 request:]* So it passed on "[skipped title]," because "[reason]." That's not a bad idea. It just isn't a today idea. It stays on the board.

*[Quick flip to the Factory Floor so they see the crate appear, then back to the deck.]*

That box on the conveyor belt is your request. It's going to ride that belt for the next half hour or so. We'll check on it. Meanwhile, let me tell you how we got here.

*[~330 words plus reading and pauses. Return to the deck and press Right to slide 3.]*

**IF SLOW** (no decision by about 3:04):
The Gatekeeper is still thinking. It's taking its time, which honestly I'd rather it did. We'll come back to it in about ten minutes. Keep voting, it's not too late to change the order.
*[Move on to slide 3. Check the Floor before slide 7.]*

**IF BLOCKED** (nothing on the board is eligible):
So the Gatekeeper said no to all of the top ones. Here's why: "[reason]." That's the factory protecting itself. If you want to see something built today, suggest something small and specific about this app, like a button, a label, or a filter, and upvote it. It checks again on its own.
*[Move on. Re-check at slide 7.]*

**IF FAILED** (app or factory down):
Well, I promised you'd see what's real. The app isn't responding right now. Keep that code handy. I'm going to keep going, and later I'll show you a recording of a previous run of this exact factory, labeled as exactly that, a previous run.

---

## 5:00–7:00 · 3:05pm · Slide 3 · Where founders start

Let me rewind. If you're a founder in this room, there's a good chance your product started with one of these: Lovable, v0, or Replit.

Quick show of hands. Who has built something with one of these tools?

*[Pause for hands.]*

That's great. These tools are genuinely amazing. You describe what you want in plain English, and you get a working prototype. A prototype being a first version that works well enough to show people and learn from.

A lot of you used that to get your first customers. That's not a toy. That's how you found out people want what you're making. Some of you have early product-market fit because of a weekend with one of these tools.

So I want to be clear: this isn't a talk about how those tools are bad. They're step one. The question this talk is about is, what's step two? What happens when the thing you built starts working, people are using it, and now you need to keep improving it?

*[~200 words]*

---

## 7:00–9:00 · 3:07pm · Slide 4 · Where it goes off the rails

Here's what usually happens next. See if any of this sounds familiar.

You ask the AI to fix one bug, and two new ones show up somewhere else.

Nobody, including the AI, really knows how the whole thing works anymore. It's grown one prompt at a time.

There are no tests. A "test" is a small program that checks your app still does what it's supposed to do, automatically, every time you change something. There's no review, meaning no second set of eyes. And there's no easy undo.

And eventually you get scared to touch it. You stop making changes because every change feels like a gamble.

*[Pause.]* Who's felt that?

*[Let a few hands go up.]*

So the goal isn't just "more code faster." The goal is software that's scalable and maintainable. Software you can keep improving and fixing bugs in, month after month, without it going off the rails.

*[~180 words]*

---

## 9:00–11:00 · 3:09pm · Slide 5 · Graduating to Claude Code and Codex

So the next step a lot of people take is graduating to tools like Claude Code, from Anthropic, and Codex, from OpenAI.

These are AI coding agents. "Agent" just means an AI that doesn't only answer questions; it takes actions. These ones work inside a real codebase, which is all the files that make up your app.

They read your existing code before they change it. They run your tests to check they didn't break anything. And they follow your rules. You can write down how your team does things, and they'll stick to it.

That's a big jump in quality. You're now building software a real engineer would recognize.

But notice what's still true. There's one person at the keyboard. That person decides what to work on, writes the instructions, waits, reads the result, decides if it's good, runs the next step, and pushes it live. Every handoff goes through a human.

That human becomes the bottleneck. And usually that human is you, at eleven at night.

*[~190 words]*

---

## 11:00–14:00 · 3:11pm · Slide 6 · Your own AI-DLC

So here's step four, and it's where this talk lives.

Software teams have a name for the whole process of building software: the SDLC, the software development lifecycle. Figure out what to build, write it down, build it, test it, review it, ship it.

The idea is to build your own AI-DLC: an AI development lifecycle.

It works like this. First, you take the discrete capabilities, the separate jobs. Writing a spec. Writing code. Testing. Reviewing. Shipping.

Second, you turn each of those into an agent or a skill. A skill is just a packaged set of instructions an AI follows for one specific job, the same way every time.

Third, you chain them together with triggers and logic. A trigger is "when this happens, start that." Logic is "if the tests fail, go back; if they pass, go forward."

And what you get at the end is a software factory.

You pass in a bug report or a feature request. What comes out the other end is working code that's been fully tested, adversarially reviewed by a second AI, security checked, and deployed to production. Without a human lifting a finger.

That's the dream scenario. And I'll tell you why I believe in it.

In my day job I run the software factory at Kyndly. And in my own experience there, it means one or two people shipping at the pace that used to take a team of twenty. That's my experience, at my company, with our kind of work. Your mileage will vary. But it's why I'm standing here.

And it's why the request you voted for is on a conveyor belt right now instead of in my to-do list.

*[~290 words. Spoken only: the Kyndly line never goes on a slide.]*

---

## 14:00–16:00 · 3:14pm · Slide 7 · The software factory

Here's the factory that's running right now. Left to right.

The **Gatekeeper** screens the request. You saw that already.

**Spec** writes down exactly what "done" means. A spec, short for specification, is the written definition of what we're building and how we'll know it works.

**Build** is where Claude Code writes the actual code.

**Test** runs automated checks to prove it works.

Then two things happen at the same time. **Review**, where a different AI, Gemini from Google, tries to find problems with the work. And **Security**, which scans for security holes.

See that dashed yellow arrow? If the reviewer doesn't like what it sees, it sends the work back to Build for a round two. The builder fixes it, and it goes through test and review again.

Then **Preview**, a private trial copy of the app with the change in it, so the factory can check it before it touches the real thing.

And finally **Release**. It puts the change into production, runs a quick smoke test (a fast "is the app still alive?" check), and if anything's wrong, it automatically rolls back to the previous version.

No human touches any of it. Let's go see where your request is.

*[~220 words. Press Right to the LIVE card, then switch windows.]*

---

## 16:00–19:00 · 3:16pm · LIVE B · Factory Floor

*[Switch to the Factory Floor (FLOOR_URL). Point at things as you name them.]*

This is the Factory Floor. Same stations, same order, just animated.

That crate is your request: "[read the title]." It's sitting at [station] right now.

The little lights tell you what's happening. Blue and blinking means that station is working. Green means done. Red means the line stopped itself. I'll come back to red.

Up top, that clock is how long it's been since the request went in. The panel on the left is everything waiting in line behind it. That's your other ideas. The panel on the right says "Shipped today." It's empty. That's the one we're trying to fill.

*[Narrate whichever station is active:]*
- *Spec:* Right now it's writing down what "done" means for your request. Things like: "when I tap this, I should see that." That becomes the checklist everything else is measured against.
- *Build:* Right now Claude Code is reading the app's code and making the change. We'll look inside this station in a minute.
- *Test:* Right now it's running the app's automated tests, the old ones and the new ones it just wrote.
- *Review / Security:* Right now a second AI is trying to find something wrong with the work, and a scanner is looking for security problems. Both at once.
- *Round two (crate bounced back):* There it is. The crate just went backward. The reviewer found something and sent it back for repairs. That's not a failure. That's the system doing its job.

Here's the thing I want you to notice. I'm not doing anything. I'm narrating. There's no one backstage typing.

*[~290 words plus pointing. Return to the deck, press Right to slide 8 (counter 9).]*

**IF SLOW** (crate still at Gatekeeper or Spec):
It's taking a bit longer to get started than in rehearsal. That's normal. These are real AI calls over conference Wi-Fi. Let me show you what's inside the factory while it works, and we'll come back.

**IF BLOCKED** (red station):
See that red light? The line stopped itself. Something didn't pass, and instead of guessing, the factory stopped and flagged it. That's the guardrail working. A factory that never stops is one you shouldn't trust. If it doesn't clear itself, I'll show you a previous run later so you can see the whole trip.

**IF FAILED** (Floor won't load / nothing moving at all):
The screen isn't cooperating. So instead, here's a recording. I want to be really clear: this is a **previous run** of this same factory, recorded during rehearsal. It's not today's request.
*[Play the PREVIOUS RUN video, about 60 seconds of it, narrating stations with the lines above.]*

---

## 19:00–21:00 · 3:19pm · Slide 8 · Factories all the way down (counter 9)

Now, here's the idea that I think matters most, and it's the one I'd want you to steal.

Factories all the way down.

Look at the top row. Every station has a contract, written right on the box. A contract is a promise about what goes in and what comes out. The Gatekeeper takes in an idea and puts out a ticket. Spec takes a ticket and puts out a spec. Builder takes a spec and puts out code. And so on.

Now look at the Builder, the one highlighted in yellow, and follow it down. When you open it up, it's not one magic step. It's its own smaller factory. Read the code. Make a plan. Edit the files. Run the tests. Fix what failed, and repeat until the tests pass.

And each of those boxes has its own contract too. In, out.

Why does this matter to you? Because it means you can improve one box without breaking the others. Better reviewer? Swap it in. As long as it keeps the same contract, the rest of the line doesn't care. And when something goes wrong, you know exactly which box to look at.

Same shape at every level. Input, work, output.

*[~220 words. Press Right to the LIVE card.]*

---

## 21:00–26:00 · 3:21pm · LIVE B2 · n8n, drill into Builder (counter 10)

*[Switch to the n8n canvas (N8N_NOTE). Start at the top-level workflow.]*

This is the real wiring. It's a tool called n8n. It's a visual automation tool. Think boxes and arrows, where each box does one job and the arrows decide what happens next.

This is the top-level factory. You can see the same stations: Gatekeeper, Spec, Builder, Tester, Reviewer and Security side by side, Preview, Releaser.

Each one of these boxes is its own sub-workflow. That's n8n's word for a workflow inside a workflow: a smaller factory.

*[Open the current execution, the run in progress for today's request.]*

This is today's run. Your request. You can see which boxes have finished. They're marked as done. And the one that's running now.

*[Click a finished station, e.g. Gatekeeper or Spec, and show its input and output.]*

Here's the contract in real life. This is exactly what went into the Spec station: your request, as written. And this is what came out: the spec, with the checklist for "done." Plain text. You could read it.

*[Double-click into Builder.]*

Now watch. I'm going to open the Builder.

*[Pause while it opens.]*

And there it is. A smaller factory inside. Read the code. Plan. Edit. Run tests. Fix. Exactly the diagram from a minute ago, except this one is real and it's running on your request.

*[If a test/fix loop is visible:]* See this loop? The tests failed, it went to Fix, and it ran the tests again. That happened without anyone asking it to.

*[Point at Reviewer:]* And when the Builder finishes, it hands its output to the Reviewer, a different AI, judging the work fresh, like a real code review. If it says no, this arrow right here sends it back for round two.

*[Back out to the top level.]*

So that's the whole thing. A factory of factories. Every box has one job and a contract. And the arrows are the logic: what happens if it passes, what happens if it doesn't.

Let's let it keep working.

*[~380 words plus clicking and pauses. Return to the deck, press Right to slide 9 (counter 11).]*

**IF SLOW** (today's run hasn't reached Builder yet):
Our run hasn't reached the Builder yet, so let me open the Builder on its own, so you can see what's inside, and we'll catch up with your request on the Floor.
*[Open the Builder sub-workflow definition, not the execution, and walk read → plan → edit → test → fix.]*

**IF BLOCKED** (execution shows an error):
You can see right here where it stopped, and the error it hit. This is the nice thing about every box having a contract: I don't have to search. It's this box, and here's what came in. Let's see whether it recovers on its own; if it doesn't, it'll show up red on the Floor, and that's the factory telling a human to look.

**IF FAILED** (tunnel down, n8n won't load):
The connection to the factory's control panel is down. It runs on a machine that I reach through a tunnel, and the tunnel's not happy. The factory itself may still be running fine. Let me go back to the diagram and walk you through it, and then I'll show you a short clip from a **previous run**, clearly labeled, so you can see the real screens.
*[Back to slide 8 (counter 9) for 1 minute, then the PREVIOUS RUN video segment for n8n.]*

---

## 26:00–28:30 · 3:26pm · Slide 9 · Why a second AI reviews the first (counter 11)

Let me zoom in on one decision in that factory, because people always ask about it. Why have a second AI review the first one?

Simple. You don't let the student grade their own exam.

If the same AI that wrote the code also reviews it, it tends to agree with itself. It has the same blind spots. It made the choice, so the choice looks reasonable to it.

So we use a different model. Claude Code builds. Gemini, from a different company, trained differently, reviews. Different model, different blind spots.

And its job is specifically to find problems. Not to say "looks good." It's adversarial on purpose. Adversarial just means it's set up to push back.

And it has real power: it can say no. When it does, the work goes back for a round two, with the reviewer's notes attached. That's the dashed arrow you saw.

The reason this matters for you as a founder: this is the thing that was missing when your prototype went off the rails. Nobody was checking. Now something is, every single time, and it never gets tired.

*[If today's run had a round two:]* And you saw it happen today. Your request got sent back once. That's this, working.

*[~220 words. If you can, glance at the Floor on your laptop before pressing Right.]*

---

## 28:30–31:00 · 3:28pm · Slide 10 · What humans still own (counter 12)

Now, if a factory can do all of that, what's left for people? A lot, actually. Four things.

**Choosing what matters.** The factory can build anything you feed it. It can't tell you what's worth building. Today, you did that, by voting. That's the most valuable job in the room.

**Defining "done."** What does good look like? What must never break? The spec station drafts it, but the standards it writes against come from you.

**Designing the factory and its guardrails.** Which stations exist. What the Gatekeeper is allowed to accept. What happens when a test fails. When to stop the line. Somebody designed every one of those rules. Today, that was me.

**And owning the outcome.** If this change breaks production for your customers, "the AI did it" is not an answer your customers will accept. You own it. That's why the guardrails exist: the automatic rollback, the security scan, the second reviewer.

So the job changes. You stop being the person who writes or chases every change, and you become the person who designs the system that makes the changes.

*[~200 words]*

---

## 31:00–32:30 · 3:31pm · Slide 11 · What it costs (counter 13)

Everybody wants to know what it costs. Let me be honest about it.

Setup is weeks, not an afternoon. Anyone who tells you that you can stand up a trustworthy factory in an afternoon is selling something. You have to write the spec templates, the tests, the guardrails, and then run a lot of practice requests through it before you trust it.

Running it is a different story. It's a subscription-level monthly bill: AI tools and hosting. Compare that to salaries, and it's a very different line on your budget.

*[TODO before the talk: replace this paragraph with the measured rehearsal numbers, or cut it.]*
From our rehearsals of this exact factory: a request like today's took about [TODO: build minutes] minutes, end to end, and cost about [TODO: cost per request] in AI usage.

*[~140 words]*

---

## 32:30–34:00 · 3:32pm · Slide 12 · Start with one station (counter 14)

So what do you actually do on Monday? Don't build the whole factory. Start with one station.

One: write down what "done" means for your next change. Just that. It'll make every tool you already use better.

Two: give one AI builder one small bug. Claude Code or Codex. Something boring.

Three: add automatic tests, so you find out when something breaks before your customers do.

Four: add a second AI as a reviewer. A different model.

Five: wire up the handoffs, so one step starts the next without you.

Six, and only once you trust the rest: let it deploy on its own, with automatic rollback.

Every one of those steps is useful by itself. You'll get value from step one this week.

Okay. Enough talking. Let's go see what you built.

*[~150 words]*

---

## 34:00–35:00 · 3:34pm · Slide 13 · Today's results (counter 15)

*[Before speaking, check the Floor on your laptop. Know the state before you say a word.]*

This is the moment of truth. About half an hour ago, you asked for something. A factory picked it up, wrote the spec, built it, tested it, had it reviewed by a second AI, scanned it for security problems, tried it on a preview, and, if everything went right, pushed it live.

Nobody touched it. Let's find out if it shipped.

*[~70 words. Press Right to the LIVE card. Choose the branch below that matches the Floor.]*

---

## 35:00–40:00 · 3:35pm · LIVE C · Production + "Shipped today" (counter 16)

### If it shipped

*[Big screen: open APP_URL, the production app. Refresh.]*

This is the real app. Production. The same link you've had on your phone all session.

*[Find the change. Show it.]*

And there it is. "[admitted title]." That wasn't here when you walked in.

Whose idea was this? *[Find the person.]* Would you open the app on your phone, refresh it, and try it? Tell everyone: does it do what you asked?

*[Let them answer. React honestly to whatever they say.]*

Everyone else, refresh your phone too. You're all looking at the live version.

*[Switch to the Factory Floor. Point at "Shipped today."]*

And here's the Floor. Your request is in "Shipped today," and that clock is the total time from request to production: [read time]. Every station, the review, the security scan, the deploy, the smoke test. Zero humans.

*[If there was a round two:]* And remember, it went back for repairs once along the way. It still made it.

*[If the requester says it isn't quite right:]* That's great feedback, and that is exactly the human job. Go submit that as the next request. Seriously. That's how this works: you judge, the factory builds.

*[If a second request also shipped, show it the same way.]*

So: you had an idea at 3:00. It's live at [time]. That's the whole talk, really.

*[~260 words plus interaction. Press Right to slide 14 (counter 17).]*

### IF SLOW (not shipped yet, still moving)

It's not there yet. Here's where it is. *[Floor: point at the station.]* It's at [station]. Everything before this has passed. This is the honest version of software: sometimes the review takes another lap.

Here's what we'll do. I'll tell you about how to get one of these for yourself, take some questions, and I'll come back to this screen before 3:45. Keep the app open on your phone.
*[Go to slide 14 and Q&A. Check the Floor during questions. Come back by 3:43 at the latest and use "If it shipped," or the 3:44 line below.]*

At 3:44, if it's still not done: It's at [station], and it's going to finish after we leave. The app link on your phone will show it when it does. I'll post the result where [TODO: wherever Jonathan will post the follow-up].

### IF BLOCKED or ROLLED BACK

*[Floor shows red, or the Releaser rolled back.]*

So here's what happened. *[Point.]* It got to [station], and [it failed the check / the smoke test failed after deploy]. And look what the factory did. *[If rolled back:]* It pulled its own change back out. Production went right back to how it was. Your app never broke for anyone.

That's not the demo failing. That's the most important feature of the whole factory. A factory that can deploy without a human has to be able to undo without a human.

I promised you'd see what's real. This is real. Now, so you can see what the end of the line looks like when it goes through, here's a recording. This is a **previous run** of this same factory, from rehearsal, not today's request.
*[Play the PREVIOUS RUN video: production change + "Shipped today." Narrate it.]*

### IF FAILED (factory or app down)

The live system isn't responding, so I can't show you today's result. I'm not going to pretend otherwise. Here's a recording of a **previous run** of this exact factory, labeled as exactly that, so you can see the end of the line.
*[Play the PREVIOUS RUN video.]*
And your request is still on the board. When the factory's back up, it'll pick it up.

---

## 40:00–42:00 · 3:40pm · Slide 14 · TempoBlueprint (counter 17)

One quick thing and then your questions.

Everything you saw today is something you can have for your own product. Some of you will build it yourselves, and I hope this gave you the map.

If you'd rather have help, that's what I'm starting with TempoBlueprint. We help companies stand up their own software factory. Three steps. An assessment: where you are, and which station to start with. Setup: building the factory around your product, with your guardrails. And training: so your team can run it, improve it, and trust it, without us.

If that's interesting, here's how to reach me: [TODO: read {{CONTACT}} once it's filled in]. Or just come find me after.

*[~130 words]*

---

## 42:00–45:00 · 3:42pm · Slide 15 · Q&A (counter 18)

That's what I've got. What questions do you have?

*[If the ship moment is still pending, say:]* And I'm keeping one eye on the factory. If it ships while we're talking, I'll stop and show you.

*[If the room is quiet, seed one of these:]*
- "A question I always get is: what happens when the AI writes something that's wrong but passes all the tests? That's exactly why the second reviewer exists, and why you own 'done.'"
- "People also ask: do I need to be technical to run this? You need someone technical to help design the factory. After that, the daily job is choosing what matters and judging the result, which you just did."
- "Another one: what can't it do? Big, vague, or risky changes. That's what the Gatekeeper is for. You saw it say no."

*[3:44:30]* We're at time. Thank you all for building something with me today. The app's still on your phone. Keep suggesting things.

*[Hard stop at 3:45.]*

---

## Script length check

| Segment | Scripted words (approx.) | Minutes allotted |
| --- | --- | --- |
| Slides 1–2 | 270 | 2 |
| LIVE A | 330 + reading/pauses | 3 |
| Slides 3–7 | 1,080 | 11 |
| LIVE B | 290 + pointing | 3 |
| Slide 8 | 220 | 2 |
| LIVE B2 | 380 + clicking | 5 |
| Slides 9–13 | 780 | 9 |
| LIVE C | 260 + interaction | 5 |
| Slides 14–15 | 130 + questions | 5 |
| **Total** | **~3,700 spoken + live time** | **45** |

At about 140 words a minute the spoken words take about 26–27 minutes. The other 18 minutes go to live screens, audience reading, hands, and questions. Rehearse with a clock. If you're running long, the cheapest trims are slide 5 (Claude Code and Codex) and the second half of slide 10.
