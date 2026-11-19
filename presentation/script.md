# Your Ideas, Built Live: Inside an AI Software Factory

**Speaker script.** Louisville Startup Week, Thursday 2026-11-19, 3:00–3:45pm ET. Jonathan Vanderford.

45 minutes total. The deck is `deck.html`; slide numbers below match the counter in its bottom-right corner (press `N` for notes). "LIVE" beats are where you leave the deck and show a real screen.

**The spine of the talk:** a process is workers with one job each, plus contracts (what goes in, what comes out), plus routing (who gets the work next). Any factory can be a worker inside a bigger factory. Software is the live example, not the point.

Format notes:
- **Plain text is what you say.** *[Bracketed italics are stage directions.]*
- **IF SLOW / BLOCKED / FAILED** blocks are what you say if the live run isn't cooperating. Pick the one that matches what's on screen.
- The recorded fallback video is always introduced as **"a previous run"**. Never present it as today's run.
- Numbers from rehearsal are always said as **"in rehearsal"**. Never claim them for today's run.
- Pace: about 140 words a minute. Word counts are already trimmed so live beats have room for pauses.

| Clock | Talk time | Slide / beat | Minutes |
| --- | --- | --- | --- |
| before 3:00 | — | 0 · Walk-in (QR) | — |
| 3:00 | 0:00–1:00 | 1 · Title + the promise | 1 |
| 3:01 | 1:00–2:00 | 2 · Your job today | 1 |
| **3:02** | **2:00–6:00** | **LIVE A · last votes, 3:05 pick, Gatekeeper** (from slide 2) | 4 |
| 3:06 | 6:00–9:00 | 3 · Every process is a factory | 3 |
| 3:09 | 9:00–10:30 | 4 · You already run a few of these (1.5 min) | 1.5 |
| 3:10:30 | 10:30–13:30 | 5 · The founder's road | 3 |
| 3:13:30 | 13:30–16:00 | 6 · Today's factory (linear diagram) | 2.5 |
| **3:16** | **16:00–19:00** | **LIVE B · Factory Floor** (counter 7) | 3 |
| 3:19 | 19:00–21:00 | 8 · Real factories aren't a conveyor belt | 2 |
| **3:21** | **21:00–25:00** | **LIVE B2 · the wiring (n8n), open Builder** (counter 9) | 4 |
| 3:25 | 25:00–26:30 | 10 · Why a second AI reviews the first | 1.5 |
| 3:26:30 | 26:30–30:00 | 11 · Your team's agent lives in chat (Hermes) | 3.5 |
| 3:30 | 30:00–31:30 | 12 · What humans still own | 1.5 |
| 3:31:30 | 31:30–32:30 | 13 · What it costs | 1 |
| 3:32:30 | 32:30–34:00 | 14 · Your turn: map one process | 1.5 |
| 3:34 | 34:00–35:00 | 15 · Today's results | 1 |
| **3:35** | **35:00–40:00** | **LIVE C · production + "Shipped today"** (counter 16) | 5 |
| 3:40 | 40:00–42:00 | 17 · TempoBlueprint | 2 |
| 3:42 | 42:00–45:00 | 18 · Q&A | 3 |
| **3:45** | **45:00** | **Hard stop** | **45 total** |

Counter mapping (deck position → section): 0 walk-in · 1 title · 2 your job · 3 every process is a factory · 4 you already run a few of these · 5 founder's road · 6 today's factory diagram · 7 LIVE Floor card · 8 not a conveyor belt · 9 LIVE n8n card · 10 second AI · 11 agent in chat (Hermes) · 12 humans own · 13 cost · 14 your turn · 15 today's results · 16 LIVE production card · 17 TempoBlueprint · 18 Q&A.

**Heads-up on timing:** in rehearsal, a request went from picked up to live in about 5–13 minutes. If the 3:05 pick-up goes that smoothly, request one may already be live by the 3:16 Floor beat. That's fine: the Floor beat has an "already shipped" branch, and the 3:35 beat is where the requester tries it on their phone (plus any later request that's still moving).

---

## Before 3:00 · Slide 0 · Walk-in

*[Deck open on slide 0 from about 2:45pm. Factory Floor open in a second window. App top-voted list open in a third. As people sit down, say this to small groups, not the room.]*

Grab your phone and scan that code. It's a little app called Feedback Inbox. Play with it, then tap "Suggest a change" and tell us what you'd fix or add. And upvote the ones you like. The top one gets built during this session.

---

## 0:00–1:00 · 3:00pm · Slide 1 · Title + the promise

*[Press Right at 3:00 sharp.]*

Good afternoon. I'm Jonathan Vanderford, and this session is called "Your Ideas, Built Live."

I want to start with a promise, and it's on the screen. Something you asked for is going to go live, in a real app, in production, before we finish today. "Production" just means the real version that real people use.

And I'm not going to build it. Nobody in this room is going to touch it. A factory made out of AI agents is going to do the whole thing while I talk.

But here's the secret: this isn't really a talk about software. Software is just the example I can show you live. The real subject is a way of looking at any process in your business, or your life, as a factory.

*[~130 words]*

---

## 1:00–2:00 · 3:01pm · Slide 2 · Your job today

Here's your job for the next 45 minutes. Thirty seconds of instructions.

One: scan the code. Two: play with the app. It's a feedback inbox. Ironically, it collects feature requests. Three: suggest a fix or a feature for that same app. Something small and specific works best. "Add a dark mode" is good. "Make it like Salesforce" is not going to make it today.

Four: upvote. You can vote on other people's ideas, and that's what decides the winner.

At 3:05, three minutes from now, the factory automatically takes the top-voted request off the board and starts building it. No one presses a button. Let's look at what's winning.

*[~130 words. Glance at the clock. Switch to the app's top-voted list on the big screen.]*

---

## 2:00–6:00 · 3:02pm · LIVE A · Last votes, the 3:05 pick, and the Gatekeeper

*[Big screen: the Feedback Inbox top-voted list (APP_URL). Read the top three requests aloud, with their vote counts.]*

Okay, here's what you're asking for. Number one, with [N] votes: "[read title]." Number two: "[read title]." And number three: "[read title]."

*[Pause. Let the room react.]*

Voting closes at 3:05. If you want to change the order, now's your moment. *[Refresh the list once or twice as votes come in.]*

*[At 3:05:]* Time. Right now the first worker in the factory is looking at number one. We call it the Gatekeeper. It's an AI with one job: decide whether a request is something the factory should take on right now.

It asks a few plain questions. Is this about this app? Is it clear enough to build? Is it small enough to finish today? And is it safe? Meaning it doesn't touch things like logins or deleting other people's data, and it isn't a joke request designed to break things.

If the top request doesn't pass, the Gatekeeper doesn't argue with you. It skips to the next eligible one, and it writes down why. That's the important bit: every decision leaves a note.

*[When the decision appears, read it.]*

And here's the decision. It picked "[admitted title]." The reason it gave was: "[read the Gatekeeper's one-line reason]."

*[If it skipped the #1 request:]* So it passed on "[skipped title]," because "[reason]." That's not a bad idea. It just isn't a today idea. It stays on the board.

*[Quick flip to the Factory Floor so they see the crate appear, then back to the deck.]*

That box is your request. We'll check on it. Meanwhile, let me give you the one idea behind all of this.

*[~310 words plus reading and pauses. Return to the deck and press Right to slide 3.]*

**IF SLOW** (no decision by about 3:07):
The Gatekeeper is still thinking. It's taking its time, which honestly I'd rather it did. We'll come back to it in about ten minutes. Keep voting, it's not too late to change the order.
*[Move on to slide 3. Check the Floor before slide 6.]*

**IF BLOCKED** (nothing on the board is eligible):
So the Gatekeeper said no to all of the top ones. Here's why: "[reason]." That's the factory protecting itself. If you want to see something built today, suggest something small and specific about this app, like a button, a label, or a filter, and upvote it. It checks again on its own.
*[Move on. Re-check before slide 6.]*

**IF FAILED** (app or factory down):
Well, I promised you'd see what's real. The app isn't responding right now. Keep that code handy. I'm going to keep going, and later I'll show you a recording of a previous run of this exact factory, labeled as exactly that, a previous run.

---

## 6:00–9:00 · 3:06pm · Slide 3 · Every process is a factory

Here's the one idea I want you to walk out with.

Every single process can be viewed as a factory. And every factory is made of three things.

**Workers.** Each worker has one job. Not "handle sales." One job: "decide if this lead is a good fit." A worker can be a person, a piece of software, or an AI agent. An AI agent is just a worker that happens to be software.

**Contracts.** For every worker, write down what goes in and what comes out. "In: a filled-out contact form. Out: fit, or not a fit, with one sentence why." That's it. That's a contract. It's the most underrated tool in business.

**Routing.** Who gets the work next? And what happens when it's not the normal case? If it's a fit, book a call. If it's not, send a polite no. If nobody can tell, hand it to a person.

And here's the part that makes it powerful. Any factory can be a worker inside a bigger factory.

Take hiring. Inside, it's a factory: write the job post, screen résumés, interview, make an offer. But from the CEO's chair, the whole hiring process is one worker. In goes "we need a salesperson." Out comes "a salesperson who starts Monday." The CEO doesn't need to see inside, as long as the contract holds.

Why does this matter? Because once you see your work this way, you can swap a worker without breaking the line. A person today, an AI tomorrow, as long as it keeps the same contract. And when something goes wrong, you know exactly which box to look at.

*[~290 words]*

---

## 9:00–10:30 · 3:09pm · Slide 4 · You already run a few of these

You already run factories. You just don't call them that.

A new lead comes in. Someone reads the form and decides it's worth a call. Someone books it: Tuesday at 2. Someone follows up: proposal sent.

Support. Someone reads the email: it's billing. Someone drafts the reply. And if it's still stuck, it goes to you. That red box isn't the plan failing. Sending it to a person is part of the plan.

And a family trip. Pick the dates, book it, pack. If you've ever planned one, you know which of those always falls apart.

Hiring, closing the books, the Monday update. Same idea.

So while I talk, keep one process of your own in mind. Something you do every week. We'll come back to it near the end.

*[~120 words. Press Right.]*

---

## 10:30–13:30 · 3:10pm · Slide 5 · The founder's road

So how did I end up building one of these for software? The same way a lot of you might.

Quick show of hands: who has built something with Lovable, v0, or Replit? Tools where you describe an app in plain English and get a working prototype?

*[Pause for hands.]*

That's great. Those tools are genuinely amazing, and a lot of you found your first customers that way. That's step one.

Then comes step two, and you know it if you've lived it. Fix one bug, two new ones appear. Nobody really knows how the thing works anymore. And eventually you get scared to touch it.

Step three is graduating to tools like Claude Code or Codex. AI that works inside a real codebase: it reads your code, runs your checks, follows your rules. Big jump in quality. But there's still one person doing every handoff. Usually you, at eleven at night.

Step four is the one this talk is about. You stop thinking "which AI tool?" and start thinking "what's my process?" Name the workers. Write the contracts. Set the routing. Now you have a factory.

And here's why I believe in it. In my day job I run the software factory at Kyndly. And in my own experience there, it means one or two people shipping at the pace that used to take a team of twenty. That's my experience, at my company, with our kind of work. Your mileage will vary. But it's why I'm standing here.

The goal isn't more code faster. It's software you can keep improving without fear.

*[~280 words. Spoken only: the Kyndly line never goes on a slide or in the deck notes.]*

---

## 13:30–16:00 · 3:13pm · Slide 6 · Today's factory

Here's the factory that's working on your request, drawn simply. Read the yellow text under each box: that's the contract.

The **Gatekeeper**: idea in, ticket out. You saw it decide.

**Spec**: ticket in, a written definition of "done" out. Things like "when I tap this, I should see that."

**Build**: spec in, code out. That's an AI coding agent.

**Test**: code in, results out. Does it actually work?

Then two workers at the same time. **Review**, a different AI whose job is to find problems. And **Security**, a scan for anything unsafe.

See the dashed arrow? If the reviewer doesn't like it, the work goes back to Build for round two.

Then **Preview**, a private trial copy. And **Release**: it goes live, gets a quick "is the app still alive?" check, and if anything's wrong, it undoes itself.

One more thing. In rehearsal, a request went from picked up to live in about five to thirteen minutes, with no human doing anything. So it's possible your request is already further along than you'd think. Let's go see.

*[~220 words. Press Right to the LIVE card, then switch windows.]*

---

## 16:00–19:00 · 3:16pm · LIVE B · Factory Floor (counter 7)

*[Switch to the Factory Floor (FLOOR_URL). Point at things as you name them.]*

This is the Factory Floor. Same workers, just animated.

That crate is your request: "[read the title]." It's sitting at [station] right now.

The lights tell you what's happening. Blue and blinking means that worker is busy. Green means done. Red means the line stopped itself. I'll come back to red.

Up top, that clock is how long it's been since the request went in. The panel on the left is everything waiting in line: your other ideas. The panel on the right says "Shipped today." That's the one we're trying to fill.

*[Narrate whichever station is active:]*
- *Spec:* It's writing down what "done" means. That becomes the checklist everything else is measured against.
- *Build:* An AI is reading the app and making the change. We'll look inside this worker in a few minutes.
- *Test:* It's running the app's automatic checks, the old ones and any new ones it just wrote.
- *Review / Security:* A second AI is trying to find something wrong, and a scanner is looking for security problems. Both at once.
- *Round two (crate bounced back):* There it is. The crate just went backward. The reviewer found something and sent it back. That's not a failure. That's the system doing its job.

Here's what I want you to notice. I'm not doing anything. I'm narrating. There's no one backstage typing.

*[~250 words plus pointing. Return to the deck, press Right to slide 8.]*

**IF ALREADY SHIPPED** (crate is in "Shipped today"):
Well, look at that. It's already in "Shipped today," and the clock says [read time]. It didn't wait for me to finish talking. I'm going to save the big reveal: at 3:35 we'll open the real app together and the person who asked for it can try it on their phone. *[If another crate is moving:]* Meanwhile, that's the next idea on the line. Same trip, different request.

**IF SLOW** (crate still at Gatekeeper or Spec):
It's taking a bit longer to get started than in rehearsal. That's normal. These are real AI calls over conference Wi-Fi. Let me show you what's really going on inside, and we'll come back.

**IF BLOCKED** (red station):
See that red light? The line stopped itself. Something didn't pass, and instead of guessing, the factory stopped and flagged it for a human. That's the guardrail working. A factory that never stops is one you shouldn't trust. If it doesn't clear itself, I'll show you a previous run later so you can see the whole trip.

**IF FAILED** (Floor won't load / nothing moving at all):
The screen isn't cooperating. So instead, here's a recording. I want to be really clear: this is a **previous run** of this same factory, recorded during rehearsal. It's not today's request.
*[Play the PREVIOUS RUN video, about 60 seconds of it, narrating stations with the lines above.]*

---

## 19:00–21:00 · 3:19pm · Slide 8 · Real factories aren't a conveyor belt

Now I have to come clean about something. That straight line I showed you is simplified for a 45-minute talk.

Real factories aren't a conveyor belt. Work doesn't march through every station in order.

Look at this one. The first worker can **route** work away: "not today," and it stays on the board. It can **skip a station**: a tiny change doesn't need a big plan. Two workers can run **side by side**. A reviewer can **loop work back** for repair. And when something can't be fixed, it goes to **a person** instead of shipping.

Different requests take different paths. Some skip stations. Some hit things in a different order. Some get worked on by different parts of the factory at the same time.

And today's demo already does some of this. Review and security run side by side. Failed work loops back to the builder: in rehearsal, one request failed its tests on the first try, and the builder fixed it on round two, with nobody stepping in. And work that can't be fixed stops and goes to a human. That's the red light.

Same thing in your business. Your support process isn't a straight line either. Draw the loops. That's where the real work hides.

*[~220 words. Press Right to the LIVE card.]*

---

## 21:00–25:00 · 3:21pm · LIVE B2 · The wiring, open Builder (counter 9)

*[Switch to the n8n canvas (N8N_NOTE). Start at the top-level workflow.]*

This is the real wiring. It's a tool called n8n, and you don't need to remember the name. It's boxes and arrows. Each box is a worker. The arrows are the routing: what happens if it passes, what happens if it doesn't.

*[Open the current execution, the run in progress for today's request.]*

This is today's run. Your request. You can see which workers have finished and which one is working now.

*[Click a finished station, e.g. Gatekeeper or Spec, and show its input and output.]*

Here's a contract in real life. This is exactly what went into the Spec worker: your request, as written. And this is what came out: the definition of "done." Plain text. You could read it.

*[Double-click into Builder.]*

Now remember: any factory can be a worker inside a bigger factory. Let me open the Builder.

*[Pause while it opens.]*

And there it is. A smaller factory inside. Read the code. Plan. Make the changes. Run the checks. Fix what failed. Same shape: workers, contracts, routing.

*[If a test/fix loop is visible:]* See this loop? The checks failed, it went to Fix, and it ran them again. Nobody asked it to.

*[Point at the arrow from Reviewer back to Builder.]* And this arrow is the round two you saw on the diagram.

So that's the whole thing. A factory of factories. Let's let it keep working.

*[~270 words plus clicking. Return to the deck, press Right to slide 10.]*

**IF SLOW** (today's run hasn't reached Builder yet):
Our run hasn't reached the Builder yet, so let me open the Builder on its own, so you can see what's inside, and we'll catch up with your request on the Floor.
*[Open the Builder sub-workflow definition, not the execution, and walk read → plan → edit → test → fix.]*

**IF BLOCKED** (execution shows an error):
You can see right here where it stopped, and the error it hit. This is the nice thing about every box having a contract: I don't have to search. It's this box, and here's what came in. If it doesn't recover on its own, it'll show up red on the Floor, and that's the factory telling a human to look.

**IF FAILED** (tunnel down, n8n won't load):
The connection to the factory's control panel is down. The factory itself may still be running fine. Let me go back to the diagram and walk you through it, and then I'll show you a short clip from a **previous run**, clearly labeled, so you can see the real screens.
*[Back to slide 6 for 1 minute, then the PREVIOUS RUN video segment for n8n.]*

---

## 25:00–26:30 · 3:25pm · Slide 10 · Why a second AI reviews the first

One design choice people always ask about: why have a second AI review the first?

Simple. You don't let the student grade their own exam.

If the same AI that did the work also reviews it, it tends to agree with itself. Same blind spots. So we use a different model, from a different company: Claude builds, Gemini reviews. Its job is specifically to find problems, not to say "looks good." And it can say no. That sends the work back for round two.

This works for people too. The person who wrote the proposal shouldn't be the only one approving it. When you design any factory, put a worker whose only job is to check another worker.

*[~120 words. Glance at the Floor if you can.]*

---

## 26:30–30:00 · 3:26pm · Slide 11 · Your team's agent lives in chat

Now I want to step off the factory floor for a few minutes, because this next part is something I'd tell any small team to try.

On our team, we have an AI agent called Hermes, and it lives in our Discord. Discord is just our team's chat app, the same place we talk to each other all day.

Quick show of hands: who works on a small team where not everyone is technical?

*[Pause for hands.]*

Here's why that matters. Not everyone on my team is technical. And for a small team, that's normal. So the question was: how do I give my coworkers something more capable than a regular ChatGPT or Claude app, while keeping it as simple as sending a message?

The answer was to put the agent where they already are. **Anyone can ask.** Technical or not, you just send it a message.

But it's **more than a chat app.** It's connected to our tools. And it **follows our process.** We customized it to work the way our team builds things, not a generic way. In factory terms, it's a worker whose input is a message from anyone on the team.

And then there's the part the team likes most. **It runs on a schedule.** Remember routing? A trigger doesn't have to be a person. It can be a clock. We use it for our async standup updates, and the team finds them incredibly useful.

*[TODO (Jonathan): optional, add one concrete example of your own here, 2–3 sentences. For example, a real request a non-technical coworker sent it, or what a standup update looks like for your team. Only use something that actually happened. If you don't add one, skip straight to the next paragraph.]*

And if you're a solo founder thinking "I don't have a team": this works for you too. It's a team of one, plus agents. You can set up the same things a team would have, a standup, a process, a teammate to ask, while you're working on your own.

Think about the process you picked a few minutes ago. If one worker in it lived in your team chat, who on your team would use it first?

So here's the takeaway: put your agent where your team already talks.

*[~330 words plus hands and room for the optional example. Phrase everything as your own experience. Don't add features, numbers or integrations beyond what's here.]*

---

## 30:00–31:30 · 3:30pm · Slide 12 · What humans still own

So if a factory can do all of that, what's left for people? Four things.

**Choosing what matters.** The factory can build anything you feed it. It can't tell you what's worth building. Today, you did that, by voting.

**Defining "done."** What does good look like? What must never break? That's your standard, not the AI's.

**Designing the factory and its guardrails.** Which workers exist, what the Gatekeeper accepts, when to stop the line. Today, that was me.

**And owning the outcome.** If it breaks for your customers, "the AI did it" is not an answer they'll accept.

The job changes. You stop being the person who does every step, and you become the person who designs the factory.

*[Point at the banner.]* And the same goes for your first hires. As a founder, every hire is expensive. If you hire someone, employee or contractor, to answer every support email, you've bought one worker. If you hire them to set up how support emails get answered, and to keep making it better, you've bought a factory. Only one of those scales. Hire people to build the line, not stand on it.

*[~130 words]*

---

## 31:30–32:30 · 3:31pm · Slide 13 · What it costs

Everybody wants to know what it costs. Honest numbers.

Setup is weeks, not an afternoon. You have to build the guardrails and run a lot of practice requests before you trust it.

Running it: the server the factory runs on costs about seventeen cents an hour. That's the AWS on-demand price for its size. The AI work runs on a Claude subscription we already had, plus a Gemini API key. I didn't measure a dollar cost per request, so I'm not going to make one up.

And speed. In rehearsal, a request went from picked up to live in about five to thirteen minutes, with no human action. That includes one run where the reviewer was slow, and one where the first attempt failed its tests and the builder fixed it on round two.

*[~130 words]*

---

## 32:30–34:00 · 3:32pm · Slide 14 · Your turn: map one process

Okay, your turn. Remember that process I asked you to keep in mind? Pick one you repeat every week.

*[Pause about 20 seconds. Let them actually think.]*

Got one? Here's Monday morning.

One: name the workers. One job each.

Two: write each contract. What does each worker take in, and what does it hand out?

Three: draw the routing. Where does it skip, where does it loop back, and who gets the stuck work?

Four: hand one job to AI first. Just one. Keep everything else the way it is.

Don't build the whole factory on day one. Every one of those steps is useful by itself, and the first two cost nothing but a piece of paper.

Okay. Enough talking. Let's go see what you built.

*[~140 words plus the pause]*

---

## 34:00–35:00 · 3:34pm · Slide 15 · Today's results

*[Before speaking, check the Floor on your laptop. Know the state before you say a word.]*

This is the moment of truth. About half an hour ago, you asked for something. A factory picked it up, wrote down what "done" meant, built it, tested it, had a second AI try to find problems with it, scanned it for security, tried it on a preview, and, if everything went right, pushed it live.

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

And here's the Floor. Your request is in "Shipped today," and that clock is the total time from request to production: [read time]. Every worker, the review, the security scan, the release, the "still alive?" check. Zero humans.

*[If there was a round two:]* And remember, it went back for repairs once along the way. It still made it.

*[If the requester says it isn't quite right:]* That's great feedback, and that is exactly the human job. Go submit that as the next request. Seriously. That's how this works: you judge, the factory builds.

*[If a second request also shipped, show it the same way.]*

So: you had an idea at 3:00. It's live at [time]. That's the whole talk, really.

*[~260 words plus interaction. Press Right to slide 17.]*

### IF SLOW (not shipped yet, still moving)

It's not there yet. Here's where it is. *[Floor: point at the station.]* It's at [station]. Everything before this has passed. This is the honest version: sometimes the review takes another lap.

Here's what we'll do. I'll tell you about how to get one of these for yourself, take some questions, and I'll come back to this screen before 3:45. Keep the app open on your phone.
*[Go to slide 17 and Q&A. Check the Floor during questions. Come back by 3:43 at the latest and use "If it shipped," or the 3:44 line below.]*

At 3:44, if it's still not done: It's at [station], and it's going to finish after we leave. The app link on your phone will show it when it does. I'll post the result where [TODO: wherever Jonathan will post the follow-up].

### IF BLOCKED or ROLLED BACK

*[Floor shows red, or the Releaser rolled back.]*

So here's what happened. *[Point.]* It got to [station], and [it failed the check / the "still alive?" check failed after release]. And look what the factory did. *[If rolled back:]* It pulled its own change back out. Production went right back to how it was. Your app never broke for anyone.

That's not the demo failing. That's the most important feature of the whole factory. A factory that can ship without a human has to be able to undo without a human.

I promised you'd see what's real. This is real. Now, so you can see what the end of the line looks like when it goes through, here's a recording. This is a **previous run** of this same factory, from rehearsal, not today's request.
*[Play the PREVIOUS RUN video: production change + "Shipped today." Narrate it.]*

### IF FAILED (factory or app down)

The live system isn't responding, so I can't show you today's result. I'm not going to pretend otherwise. Here's a recording of a **previous run** of this exact factory, labeled as exactly that, so you can see the end of the line.
*[Play the PREVIOUS RUN video.]*
And your request is still on the board. When the factory's back up, it'll pick it up.

---

## 40:00–42:00 · 3:40pm · Slide 17 · TempoBlueprint

One quick thing and then your questions.

Everything you saw today, the way of thinking and the factory itself, is something you can have for your own business. Some of you will build it yourselves, and I hope this gave you the map.

If you'd rather have help, that's what I'm starting with TempoBlueprint. We help companies map their processes and stand up their own factory. Three steps. An assessment: where you are, and which worker to start with. Setup: building the factory around your business, with your guardrails. And training: so your team can run it, improve it, and trust it, without us.

If that's interesting, here's how to reach me: [TODO: read {{CONTACT}} once it's filled in]. Or just come find me after.

*[~130 words]*

---

## 42:00–45:00 · 3:42pm · Slide 18 · Q&A

That's what I've got. What questions do you have?

*[If the ship moment is still pending, say:]* And I'm keeping one eye on the factory. If it ships while we're talking, I'll stop and show you.

*[If the room is quiet, seed one of these:]*
- "A question I always get is: does this only work for software? No. Software is just the part I can show you live. Leads, support, hiring, month-end books: same shape. Workers, contracts, routing."
- "People also ask: do I need to be technical? You need someone technical to help build a software factory. But mapping the process, choosing what matters and judging the result, which you just did, that's not technical. And putting an agent in your team chat is how non-technical teammates get to use it."
- "Another one: what happens when the AI does something wrong but it passes every check? That's exactly why the second reviewer exists, and why you own 'done.'"

*[3:44:30]* We're at time. Thank you all for building something with me today. The app's still on your phone. Keep suggesting things.

*[Hard stop at 3:45.]*

---

## Script length check

| Segment | Scripted words (approx.) | Minutes allotted |
| --- | --- | --- |
| Slides 1–2 | 240 | 2 |
| LIVE A | 210 + reading the requests and the decision | 3 |
| Slides 3–6 (big idea, not just code, founder's road, today's factory) | 900 + hands | 11 |
| LIVE B (Floor) | 110 + station narration + pointing | 3 |
| Slide 8 (not a conveyor belt) | 210 | 2 |
| LIVE B2 (wiring) | 185 + clicking | 4 |
| Slides 10–15 (second AI, Hermes, humans, cost, your turn, results) | 880 + hands + 20-second pause | 9 |
| LIVE C | 170 + interaction | 5 |
| Slides 17–18 | 290 incl. seed questions | 5 |
| **Total** | **~3,200 spoken (main branch, stage directions excluded) + live time** | **45** |

At about 140 words a minute the main-branch spoken words take about 23 minutes. The other 22 minutes go to live screens, reading requests aloud, hands, the exercise pause, interaction and questions. Rehearse with a clock. If you're running long, the cheapest trims are the middle of slide 5 (founder's road: say steps two and three in one breath) and slide 12 (read the four cards, skip the commentary). Never cut LIVE C. If Jonathan adds the Hermes example, take the time back from slide 5.
