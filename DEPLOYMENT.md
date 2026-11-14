# Deploy Draftroom on Vercel

Draftroom is deployed from this repository as a Vite frontend plus a Node/Express API function (not an OpenAI Sites project).

**Live application:** https://draftroom-neon.vercel.app/  
**Repository:** https://github.com/ShivamSoni20/DraftRoom

## Current production setup

- GitHub repository: `ShivamSoni20/DraftRoom`, branch `main`.
- Vercel serves the React/Vite frontend and the `api/index.js` function.
- Persistent documents and sharing data use remote Turso/libSQL, not Vercel's ephemeral filesystem.
- The server reads `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` from Vercel server-side environment variables. Never use `VITE_` prefixes or commit the token.
- The first API request initializes the schema and seeds demo users/documents.
- Vercel API routing is configured in `vercel.json`.

## Recreate the database configuration

In your Turso account, create a database and obtain its URL and an auth token. With the Turso CLI authenticated:

```sh
turso db create draftroom
turso db show draftroom --url
turso db tokens create draftroom
```

Check the account's currently available plan before choosing one. Do not select a paid plan unless you intend to pay for it. Reviewers only need the public app URL and do not need a Turso account.

In Vercel project settings, set these for Production (and Preview if needed):

```text
TURSO_DATABASE_URL=libsql://YOUR-DATABASE.turso.io
TURSO_AUTH_TOKEN=YOUR-TOKEN
```

Keep both values server-side. Never expose them in source code, screenshots, browser variables, or the submission ZIP.

## Vercel project settings

- Framework preset: **Vite**
- Root directory: repository root
- Install command: `npm ci`
- Build command: `npm run build`
- Output directory: `dist`
- Node.js runtime: **22.x**
- Production environment variables: `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`

`api/index.js` is the function entrypoint. `vercel.json` routes `/api/*` to it and other app routes to the SPA.

## Verify after a deployment

1. Open the app in a signed-out/incognito browser and confirm the dashboard loads.
2. Open `/api/users` and confirm the three seeded demo users are returned.
3. Create, format, rename, save, refresh, and reopen a document.
4. Import `samples/team-brief.md`.
5. Share with Bob as viewer and verify editing is blocked.
6. Change Bob to editor and confirm edits save.
7. Revoke access and confirm Bob cannot reopen the document.
8. Open the app in another browser to confirm server-side persistence.
9. Confirm Vercel deployment protection does not require a team login.

## Troubleshooting

- **Database is not configured:** set both Turso variables in Production and redeploy.
- **Database unauthorized:** generate a valid database token and update the Vercel server-side variables.
- **Function invocation error:** inspect the latest Vercel function logs and confirm the deployment uses the committed lockfile.
- **Works locally but not after deploy:** verify Vercel deployed the latest `main` commit and that the variables apply to Production.

Do not claim hosted verification for steps that have not actually been tested.
