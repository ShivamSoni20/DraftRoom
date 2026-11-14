# Verification record

Updated 14 November 2026. This record distinguishes the earlier local automated run from the latest hosted checks.

## Automated checks

The earlier local verification on Node.js 22.22.0 recorded:

- `npm test`: 8 tests passed, 0 failed, covering API access rules, viewer/editor permissions, revocation, stale-write protection, validation, import sanitization, and database persistence.
- `npm run build`: production frontend build passed, with a Vite bundle-size advisory.

After Vercel reported a CommonJS/ESM startup error involving `sanitize-html` and `htmlparser2`, `sanitize-html` was pinned to `2.17.4` in commit `6a8df31`. The latest hosted API is responding successfully. The automated test and build commands have not been independently rerun after that dependency pin in this verification session.

## Hosted checks

Independently checked on the public production deployment:

- The app opens without a Vercel team login.
- `/api/users` returns the Alice, Bob, and Charlie demo accounts as JSON.
- The dashboard loads and displays the two seeded demo documents.
- The YouTube walkthrough opens while signed out and is approximately 3 minutes long.

The candidate reports testing the full live workflow: create and rename a document; apply formatting; save, refresh, and reopen; import a sample file; share as viewer; change to editor and save; revoke access; and confirm persistence in another browser.

## Product boundaries

Demo identity is simulated. The public app is for synthetic review content only. There is no real authentication, realtime merging, comments, version history, or DOCX import.

## Submission links

- Live app: https://draftroom-neon.vercel.app/
- Walkthrough: https://youtu.be/oTBim2Cg5ps
- GitHub source: https://github.com/ShivamSoni20/DraftRoom
- Google Drive folder: https://drive.google.com/drive/folders/1L1qHQZASzl91ASMLXNRal1u0ZTGD5E0p?usp=sharing
