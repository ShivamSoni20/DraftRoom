# Walkthrough recording plan (about 4 minutes)

Record your own screen and voice using Loom, OBS, or your preferred recorder. Open the deployed app, not only localhost. Use an unlisted/publicly accessible video link and test it in an incognito window.

## 0:00–0:30 — Product and scope

“This is Draftroom, a small shared document workspace. I focused on a complete create, edit, save, import, and share flow. The account switcher is deliberately simulated authentication so you can review the sharing model without signup.”

## 0:30–1:30 — Create and edit

As Alice, create a document. Rename it “Hiring process notes.” Write a heading, paragraph, bold, italic, underline, and a list. Point out saving/saved feedback. Return, reopen, and refresh to demonstrate persistence.

## 1:30–2:10 — Import

Import `samples/team-brief.md`. Explain supported UTF-8 `.txt`/`.md` files and the 100 KB cap. Show imported heading/list formatting. Mention server validation and sanitization.

## 2:10–3:10 — Share

Grant Bob view access. Go back and switch to Bob. Open Shared with me and demonstrate read-only behavior. Switch to Alice, grant edit access, switch to Bob, and make an edit. If time allows, revoke Bob and show access removal.

## 3:10–3:45 — Engineering decisions

“React and Tiptap handle the editor; Express handles the API. SQLite works locally, and the Vercel deployment uses Turso for durable storage. Permissions are checked on the server. Revision checks reject stale writes; this is not realtime co-editing.”

Briefly show passing test output if available. Do not show tokens or environment settings.

## 3:45–4:20 — AI workflow and tradeoffs

Explain how you actually used Codex, the deployment direction you rejected, what you personally reviewed or changed, and the checks you ran. State real auth, realtime collaboration, history, and DOCX were intentionally excluded. Next: real authentication and recovery/history.

Only describe checks you actually performed. Replace `WALKTHROUGH_URL.txt` with the final link, then put it in `SUBMISSION.md` and the assessment's required video field.
