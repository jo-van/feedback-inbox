# Feedback Inbox

A tiny public app that an AI software factory improves live. Built for "Your Ideas, Built Live: Inside an AI Software Factory" (Louisville Startup Week, 2026-11-19).

- `app/`, `components/`, `lib/`: the Next.js app (deployed on Vercel).
- `factory/`: the station service, sandbox and n8n workflows that build requests automatically.
- `infra/`: AWS stack plus automatic teardown.
- `presentation/`: deck, script and cheat sheet.

Requests submitted in the app are screened by an AI Gatekeeper, specified, built by Claude Code, tested against a preview deployment, reviewed adversarially by Gemini, security scanned, then shipped to production with no human in the loop.
