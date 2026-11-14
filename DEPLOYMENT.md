# Deploy Draftroom on Vercel

This is a standard Vite frontend plus a Node/Express API function, not a Sites project. Deploy the contents of **draftroom-app** as the repository root.

## 1. Create a persistent database

Create a Turso database in your own account, choose an available free plan, and obtain its URL and auth token. Check the provider's current plan availability before proceeding; reviewers only need the app URL and never need a paid account.

With the Turso CLI already authenticated:

```sh
turso db create draftroom
turso db show draftroom --url
turso db tokens create draftroom
```

Do not put the token in source code, screenshots, the submission ZIP, or the README.

## 2. Import the repository in Vercel

- Framework preset: **Vite**
- Root directory: repository root (or `draftroom-app` if committing the parent directory)
- Install command: `npm ci`
- Build command: `npm run build`
- Output directory: `dist`
- Node version: **22.x**
- Add these server environment variables to Production (and Preview if needed):

```text
TURSO_DATABASE_URL=libsql://YOUR-DATABASE.turso.io
TURSO_AUTH_TOKEN=YOUR-TOKEN
```

Never prefix these variables with `VITE_`; the browser must not receive them. `api/index.js` is the Vercel function entrypoint. `vercel.json` routes `/api/*` to it and other app routes to the SPA. The first API request creates the schema and seeds demo records once. Updating the deployment does not reseed deleted documents.

## 3. Deploy and verify

Deploy from Vercel's Git import or from an authenticated Vercel CLI using `vercel --prod`. No deployment credentials are included in this package.

Check the deployed app in an incognito window:

1. Dashboard loads seeded users and documents.
2. Create, format, rename, save, refresh and reopen.
3. Import the sample Markdown file.
4. Share with Bob as viewer; verify view-only behavior.
5. Change Bob to editor; verify editing persists.
6. Revoke access; verify Bob cannot reopen.
7. Open from a different browser to confirm server persistence.

Disable Vercel deployment protection for the reviewer-facing demo if it requires your team login. Check your account settings and plan before changing access. Copy the final public URL into `SUBMISSION.md` and the assessment portal.

## Troubleshooting

- **Database is not configured:** set both Turso variables and redeploy. There is intentionally no ephemeral Vercel SQLite fallback.
- **Database unauthorized:** generate a valid database token and update Vercel server environment variables.
- **Blank dashboard or API error:** inspect the function logs and `/api/users`. Confirm this package, not its parent or the unused starter folder, is the project root.
- **Works locally but not after deploy:** ensure Vercel deployed the latest source and both env variables apply to the environment you opened.

Deployment is performed by the candidate's friend. No live URL or hosted verification is claimed until that deployment succeeds.
