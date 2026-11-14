# Draftroom — Collaborative Document Workspace

Candidate: Shivam Soni

## Links

- Submission folder: [Google Drive](https://drive.google.com/drive/folders/1L1qHQZASzl91ASMLXNRal1u0ZTGD5E0p?usp=sharing)
- Live application: [Open Draftroom](https://draftroom-neon.vercel.app/)
- Walkthrough: [Watch the 3-minute video](https://youtu.be/oTBim2Cg5ps)
- Source repository: [GitHub](https://github.com/ShivamSoni20/DraftRoom)

## Reviewer access

No password is required. Use the in-app demo account switcher to try Alice Chen, Bob Williams, and Charlie Davis. Authentication is simulated for this assessment.

## Review flow

As Alice, create and format a document, wait for “All changes saved,” refresh, and reopen it. Import a `.txt` or `.md` file up to 100 KB. Share a document with Bob as a viewer, switch to Bob to confirm read-only access, change Bob to editor and save an edit, then revoke access. Documents and sharing data persist in Turso on Vercel.

## Implemented

Document creation, renaming, rich-text editing, autosave, reopening, Markdown and text import, owned/shared document views, owner/editor/viewer permissions, access revocation, HTML export, input validation, and stale-write protection.

## Included in the Drive folder

- Final source ZIP matching this GitHub `main` branch.
- `README.md`, `ARCHITECTURE.md`, and `AI_WORKFLOW.md`.
- `DEPLOYMENT.md` and `VERIFICATION.md`.
- This submission summary and `WALKTHROUGH_URL.txt`.
- Application screenshots.

The source ZIP excludes credentials, `.env` files, local database files, and `node_modules`.

## Deliberate limitations

Authentication is simulated. There is no realtime merging, comments, version history, or DOCX import. Public demo accounts are intended for synthetic review content only.

## What I would build next

With another 2–4 hours, I would prioritize real authentication, browser regression tests, and revision recovery before considering realtime collaboration.
