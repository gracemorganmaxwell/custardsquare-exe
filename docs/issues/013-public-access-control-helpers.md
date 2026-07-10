---
json: {"title":"Public access control helpers","labels":["epic:cms","priority:mvp","type:feature"],"milestone":"M2 — CMS Schema"}
---

> Solo-admin site (Grace publishes everything). Content first → desktop second → magic third. Ship the simplest version that works.

Shared access helpers ensuring only published, non-deleted content is public.

## Done when
- [x] publishedOnly read access on Articles
- [x] Drafts never returned in public Local API queries
- [x] No draft data in frontend static bundles

## Depends on
- #12

## Likely files
- `src/lib/access.ts`
