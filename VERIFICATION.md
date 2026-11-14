# Verification record

Local verification performed on 14 November 2026 using Node.js 22.22.0.

## Automated

- `npm install`: completed; npm reported zero known vulnerabilities at installation time.
- `npm test`: **8 tests passed, 0 failed** against actual Express routes and libSQL/SQLite. Coverage includes missing identity, unshared access, viewer restrictions, editor saves, owner-only access changes, revocation, stale revision rejection, title/role validation, text and Markdown import, script/attribute stripping, application reinitialization, and database-file reopen persistence.
- `npm run build`: production frontend build passes. Vite reports a bundle-size advisory for the editor dependency; this is a performance improvement opportunity, not a build failure.

The sandbox initially blocked local socket connections; the tests were rerun with local networking allowed. That environmental failure was not recorded as a passing test.

## Browser verification actually performed

- Loaded seeded dashboard and account switcher.
- Created and renamed a document.
- Typed content, applied a heading, and observed saved status.
- Granted Bob viewer access, switched to Bob, opened the shared document, and checked disabled formatting/title editing.
- Refreshed and reopened the saved shared content.
- Imported `samples/team-brief.md` through the native file chooser; headings, bullets, numbered lists, and quote appeared in the editor.
- Applied bold, italic, and underline and confirmed active states; navigated back after save.
- Inspected desktop and 375 px mobile workspace/editor layouts.
- Saved workspace, editor, and mobile screenshots in `screenshots/`.

Browser verification caught an initialization problem: Tiptap `setEditable` emits an update by default, marking opened documents dirty. The initialization now suppresses that event; a viewer document was reopened to confirm correct saved status.

## Remaining checks after deployment

No Vercel deployment was performed at the candidate's request. The candidate's friend must supply the remote Turso database, configure Vercel, and run the checklist in `DEPLOYMENT.md`. Public URL accessibility, remote database permissions, Vercel cold-start behavior, and cross-browser hosted persistence are not yet verified. The video and Google Drive upload must also be completed by the candidate.
