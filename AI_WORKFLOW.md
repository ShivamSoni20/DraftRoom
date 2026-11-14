# AI workflow note

Draftroom was developed with OpenAI Codex in the desktop app. Codex generated implementation code, an initial architecture, API integration tests, UI styling, and handoff documentation, and executed local validation commands. The candidate should review this note and add their own decisions before submitting; this file does not claim manual review that has not happened.

AI materially accelerated translating the brief into a small data model, implementing repetitive API and toolbar wiring, producing a first-pass responsive UI, and creating permission/conflict test scenarios.

The initial deployment direction used the Sites integration. The candidate explicitly rejected that approach and requested a standalone application that a friend could deploy on Vercel. The implementation moved to a separate standalone React/Express package, with local SQLite and a remote libSQL/Turso option for durable serverless hosting. The unused Sites registration was not published. The final app has no Sites runtime dependency.

Engineering decisions encoded in the implementation include server-side authorization rather than relying on hidden frontend controls, safe HTML allowlists for imported content, and revision conflicts rather than last-write-wins overwrites. These choices should be assessed against the code and tests, not accepted solely because AI described them.

Verification uses the real API with SQLite integration tests, a production frontend build, and browser checks where recorded in `VERIFICATION.md`. Deployment and the candidate's spoken walkthrough remain separate human handoff steps. No AI-generated claim of a live URL, recorded video, or Google Drive upload is substituted for those deliverables.

Before submission, the candidate should run the documented review flow themselves and add one concrete example of output they personally changed, rejected, or investigated. The deployment-platform rejection above is already a documented candidate decision; do not invent additional examples.
