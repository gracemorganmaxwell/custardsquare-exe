---
json: {"title":"Configure Vercel Blob media storage","labels":["epic:foundation","priority:mvp","type:chore"],"milestone":"M1 — Foundation"}
---

Enable Vercel Blob for Media uploads with clientUploads for Vercel 4.5MB limit.

## Acceptance criteria
- [ ] Media collection uses Blob adapter
- [ ] BLOB_READ_WRITE_TOKEN documented
- [ ] Admin can upload image in dev when token is set

## Dependencies
- #2

## Key files
- `src/payload.config.ts`
- `src/collections/Media.ts`
