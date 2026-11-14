# Your final submission steps

The app is built and locally verified. The final assessment still requires a real deployment, your own video, and a shared Google Drive folder.

1. **Send your friend `source-code.zip`.** Ask them to extract it and follow `DEPLOYMENT.md`. Vercel requires a remote Turso database and the two server environment variables. Do not deploy the unused `D:\game\draftroom` starter; the actual project is `D:\game\draftroom-app`.
2. **Get the public Vercel URL.** Test it in an incognito window using the README flow. Create, format, refresh, import, and switch demo accounts to test sharing. Confirm the app does not require your friend's Vercel login.
3. **Record a 3–5 minute walkthrough in your own voice.** Use `WALKTHROUGH_SCRIPT.md`; show the live app and explain real decisions you understand. Upload to an accessible unlisted/public video service.
4. **Update the links.** Put the video URL in `WALKTHROUGH_URL.txt`; replace the live app, video, and Drive placeholders in `SUBMISSION.md`. Read the AI workflow note and add your own actual review decisions where appropriate.
5. **Upload the submission folder to Google Drive.** Include the source ZIP, README, architecture note, AI workflow note, submission file, deployment/verification notes, walkthrough text file, and screenshots. Use “Anyone with the link — Viewer.” Never upload tokens, `.env`, `node_modules`, or the local database.
6. **Paste the final links in the assessment portal.** Put the video URL in its required video field. In the Markdown submission, include the Drive folder, live app, walkthrough, and demo-user instructions. Use the template below after replacing every placeholder.

## Portal Markdown template

```markdown
# Draftroom — Collaborative Document Workspace

Candidate: Shivam Soni

- Submission folder: [Google Drive](YOUR_DRIVE_FOLDER_URL)
- Live product: [Open Draftroom](YOUR_VERCEL_URL)
- Walkthrough: [Watch demo](YOUR_VIDEO_URL)

## Reviewer access
No password required. Use the labeled demo account switcher for Alice Chen,
Bob Williams, and Charlie Davis. These are simulated users, not real authentication.

## Suggested review
Create and format a document as Alice. Wait for “All changes saved,” refresh,
and reopen. Import a .txt or .md file (100 KB max). Share with Bob as viewer,
switch to Bob, and open Shared with me. Change Bob to editor as Alice and
verify Bob can save changes. Only owners can share, revoke, or delete.

## Included
Source code, reproducible setup, architecture note, AI workflow note,
eight passing API integration tests, verification notes, screenshots,
and walkthrough link.

## Scope
Core creation, rename, rich text, autosave, reopen, import, persistence,
and sharing are implemented. HTML export and stale-write protection are included.
Real authentication, realtime merging, comments, history, and DOCX support
were intentionally omitted. Next: real auth, browser regression tests,
and document revision recovery.
```

Do not claim the hosted checklist is complete until you or your friend actually run it.
