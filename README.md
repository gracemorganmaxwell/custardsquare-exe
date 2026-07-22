# custardsquare.exe

Gracie's public second brain disguised as a dreamy Windows 98 desktop.

Notes, thoughts, bugs, learnings, and little digital crumbs — published through a nostalgic desktop UI, powered by a reliable CMS underneath.

## Stack

- **Framework:** Next.js App Router
- **CMS:** Payload CMS 3
- **Database:** Neon Postgres via `@payloadcms/db-vercel-postgres`
- **Media:** Vercel Blob via `@payloadcms/storage-vercel-blob`
- **Hosting:** Vercel
- **Language:** TypeScript

## Local development

1. Clone the repo and install dependencies:

   ```bash
   pnpm install
   ```

2. Copy environment variables:

   ```bash
   cp .env.example .env
   ```

3. Fill in `.env` with your Neon `DATABASE_URL`, `PAYLOAD_SECRET`, and optional `BLOB_READ_WRITE_TOKEN` (local fallback works without it).

4. Start the dev server:

   ```bash
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) for the public site.
6. Open [http://localhost:3000/admin](http://localhost:3000/admin) to create your first admin user.

## Vercel production — media uploads

**Required for `/admin/collections/media` uploads on custardsq.app.**

Without `BLOB_READ_WRITE_TOKEN`, Vercel cannot store files (the Blob adapter is disabled and serverless has no writable disk), which causes **500 errors** on upload.

1. Open your [Vercel project](https://vercel.com/dashboard) → **Storage** → **Create Database** → **Blob**
2. Name the store (e.g. `custardsquare-media`) and **connect it to this project**
3. Vercel adds `BLOB_READ_WRITE_TOKEN` to Production (and Preview) automatically
4. **Redeploy** (Deployments → … → Redeploy, or push to `main`)

After redeploy, uploads go to `blob.vercel-storage.com` and the admin Media UI should work.

**Verify:** open `https://custardsq.app/api/media-storage-health` — you want `"blobTokenConfigured": true`. If `false`, the token is only in local `.env`, not on Vercel.

## Project philosophy

Build the content system first. Then build the desktop. Then add magic.

The desktop is how people discover the brain. The CMS is how Grace keeps feeding it.

Design choices (stack, CMS schema, shell vs content, and so on) are recorded in [`DECISIONS.md`](DECISIONS.md).

## Credits

Icons used throughout custardsquare.exe are from the Windows 95 Plus-inspired icon packs by [aconfuseddragon](https://aconfuseddragon.itch.io/) on itch.io. Thank you to aconfuseddragon for creating and sharing such beautiful nostalgic pixel icon work.

This site is a personal nostalgic web project and is **not affiliated with Microsoft**.

Place downloaded icons in [`public/icons/`](public/icons/). See [`public/icons/README.md`](public/icons/README.md) for setup notes.

## Roadmap

Track work in [GitHub Issues](https://github.com/gracemorganmaxwell/custardsquare-exe/issues) and milestones M0–M8.

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start Next.js dev server |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm test` | Run Vitest + Playwright |

## License

MIT
