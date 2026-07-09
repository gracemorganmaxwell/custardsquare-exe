---
json: {"title":"Configure Vercel Blob media storage","labels":["epic:foundation","priority:mvp","type:chore"],"milestone":"M1 — Foundation"}
---

> Solo-admin site (Grace publishes everything). Content first → desktop second → magic third. Ship the simplest version that works.

Enable Vercel Blob for Media uploads with clientUploads for Vercel 4.5MB limit.

## Done when
- [ ] Media collection uses Blob adapter
- [ ] BLOB_READ_WRITE_TOKEN documented
- [ ] Admin can upload image in dev when token is set

## Depends on
- #2

## Likely files
- `src/payload.config.ts`
- `src/collections/Media.ts`
