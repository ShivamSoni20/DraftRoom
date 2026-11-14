# Architecture and product judgment

## Product slice

Draftroom focuses on the lifecycle of one shared document: create → write → save → share → reopen under another identity. Two screens keep the app small: a dashboard for ownership and discovery, and an editor with a focused toolbar and sharing dialog. File import creates a new document to avoid accidentally overwriting an existing draft.

## Components

- React/Vite renders the browser application. Tiptap/ProseMirror provides structured rich-text editing and undo/redo rather than hand-rolled contenteditable commands.
- Express implements one API used unchanged by a local Node server and a Vercel Node function.
- libSQL uses a local SQLite file during development and remote Turso in Vercel. Records never depend on browser localStorage; localStorage remembers only the selected demo identity.
- The server stores sanitized HTML. This intentionally small allowlist preserves the required formatting while rejecting scripts, event handlers, and unsupported embeds. The same format supports reopen, import, and HTML export.

## Data model

`documents(id, owner_id, title, content, revision, created_at, updated_at)` stores content and monotonically increasing revision. `shares(document_id, user_id, role)` has a composite primary key and viewer/editor role constraint. Seed users are fixed server data. `metadata` ensures demo content is seeded once. Initialization and seeding use transactions and idempotent SQL; no schema-changing migrations are needed for this initial version. Future schema revisions should use explicit versioned migrations.

## Access model

A clearly labeled demo account switcher sends `x-demo-user`. This is simulated authentication permitted by the brief, not identity verification. Every document endpoint resolves ownership or a share on the server. Unshared access returns 404. Viewers read; editors read and write; owners additionally grant/revoke access and delete. Knowing an ID is insufficient to bypass the permission lookup. Share removal affects subsequent requests, including save attempts in an already-open editor.

## Save reliability

The editor debounces writes by 700 ms and serializes in-flight requests. A save snapshots a local change sequence; a response only clears the dirty flag if no newer edit exists. Atomic SQL updates require the last fetched revision. A stale save returns 409 rather than overwriting someone else's work. The user can export their local text and reload. This is optimistic concurrency, not realtime merging. Returning to the dashboard requires a successful save; browser navigation warns when dirty. No automatic retry loop conceals failures.

## Validation and operational choices

Titles are trimmed and limited to 120 characters. Documents are limited to 500 KB and imports to 100 KB. Import parsing and sanitization happen server-side. Parameterized queries prevent SQL interpolation. Errors return concise messages; production credentials stay server-side. Database setup is idempotent across cold starts. Vercel explicitly requires the remote database and refuses to fall back to ephemeral storage.

## Deliberate cuts

No realtime protocol, CRDT, comments, revision history, password system, invites, or DOCX parsing. These require considerably more conflict, security, and compatibility work. Viewer/editor roles and conflict detection were more valuable than a superficial realtime indicator. Public demo accounts make reviewer access easy but also mean any visitor can modify demo content; use synthetic data only.

## Verification

API integration tests exercise actual HTTP routes and SQLite queries: unauthenticated and unshared access, viewer restrictions, editor saves, revocation, stale-write protection, input validation, import sanitization, and persistence through separate application instances. See `VERIFICATION.md` for the checks actually run. Hosted behavior must be verified after the friend deploys.
