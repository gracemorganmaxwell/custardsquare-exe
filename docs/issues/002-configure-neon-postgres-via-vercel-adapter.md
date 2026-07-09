---
json: {"title":"Configure Neon Postgres via Vercel adapter","labels":["epic:foundation","priority:mvp","type:chore"],"milestone":"M1 — Foundation"}
---

> Solo-admin site (Grace publishes everything). Content first → desktop second → magic third. Ship the simplest version that works.

Connect Payload to Neon Postgres using @payloadcms/db-vercel-postgres.

## Done when
- [ ] DATABASE_URL works locally
- [ ] Payload can create and read content
- [ ] Production env vars documented in .env.example

## Depends on
- #1

## Likely files
- `src/payload.config.ts`
- `.env.example`
