# Draftroom

A small collaborative document workspace built for the Ajaia AI-Native Full Stack Developer assignment.

**Live application:** https://draftroom-neon.vercel.app/  
**Source repository:** https://github.com/ShivamSoni20/DraftRoom

## Run locally

Requirements: Node.js 22+, npm, internet access for the first dependency install.

```sh
npm ci
npm run dev
```

Open http://localhost:5173. The API runs on port 3001. No database account, environment file, or login is needed locally. SQLite is created automatically at `data/draftroom.db`. Do not delete this folder if you want to retain local documents. The `.env.example` is documentation; local development deliberately works without environment variables.

Production locally:

```sh
npm run build
npm start
```

Open http://localhost:3001. Run automated checks with `npm test`.

## Review the product

The top-right account switcher provides these **simulated identities** (no passwords):

| Account | Email | Initial state |
|---|---|---|
| Alice Chen | alice@draftroom.demo | Owns the welcome document; can edit Bob's project brief |
| Bob Williams | bob@draftroom.demo | Owns the project brief |
| Charlie Davis | charlie@draftroom.demo | Empty workspace until someone shares with Charlie |

1. As Alice, create a blank document. Rename it and try bold, italic, underline, headings, and lists.
2. Wait for **All changes saved**, return to the workspace, reopen, and refresh.
3. Import `samples/team-brief.md` or a `.txt` file.
4. Open Share, select Bob, grant **Can view**. Return to the workspace and switch to Bob. Find the document in **Shared with me**; editing is disabled.
5. Switch back to Alice, change Bob's access to **Can edit**, then reopen as Bob and edit.
6. As Alice, remove Bob's access. Bob can no longer fetch or save the document.
7. To inspect overwrite protection, open the same document in two tabs; save in one, then try saving an older revision in the other. The app rejects the stale save and offers export/reload.

## Supported file handling

- UTF-8 `.txt` and `.md` imports, maximum **100 KB**; each creates a new editable document owned by the importing user.
- Plain text remains literal; Markdown becomes sanitized rich text.
- Empty files, binary null bytes, unsupported extensions, and oversized imports are rejected on the server as well as in the UI.
- Supported rich text is preserved. Images, links, embedded HTML attributes, tables, and attachments are intentionally excluded.
- Export downloads an HTML document that preserves basic formatting. It is not PDF or Markdown export.

## Vercel deployment

See [DEPLOYMENT.md](DEPLOYMENT.md). **Local SQLite must not be used for Vercel persistence.** The same database client connects to a remote Turso database when environment variables are set. There is no browser-storage fallback for documents.

## Scope and limitations

Working scope: creation, rename, rich-text editing, debounced autosave, reopen, durable document/share storage, import, owned/shared views, view/edit roles, revoke, owner-only deletion, HTML export, server-side permissions, and conflict detection.

Demo authentication is intentionally not secure authentication: anyone who can reach the app may impersonate any seeded account through the switcher or request header. Do not store confidential data in the public demo. Permission checks demonstrate access logic within that model. There is no realtime co-editing, presence, comments, history, DOCX import, email invitations, or password login. An open viewer does not automatically refresh when another user edits; reopen to fetch the latest content. Removed access is enforced on subsequent server requests.

Autosave starts 700 ms after the last change, and writes are serialized. Navigation back waits for a successful save. Failed saves remain visibly failed, browser navigation warns about unsaved work, and export lets users recover their local text. Abrupt process termination before a save completes can still lose unsaved edits.

Fonts are an optional Google Fonts enhancement; system fonts are the fallback. App operation does not depend on the fonts loading.

With another 2–4 hours: add real session authentication, browser end-to-end regression tests, document revision history and a stronger conflict-resolution UI, then consider realtime collaboration.

See also [ARCHITECTURE.md](ARCHITECTURE.md), [AI_WORKFLOW.md](AI_WORKFLOW.md), [SUBMISSION.md](SUBMISSION.md), and [VERIFICATION.md](VERIFICATION.md).
