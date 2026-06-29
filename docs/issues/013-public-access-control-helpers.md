---
json: {"title":"Public access control helpers","labels":["epic:cms","priority:mvp","type:feature"],"milestone":"M2 — CMS Schema"}
---

Shared access helpers ensuring only published, non-deleted content is public.

## Acceptance criteria
- [ ] publishedOnly read access on Articles
- [ ] Drafts never returned in public Local API queries
- [ ] No draft data in frontend static bundles

## Dependencies
- #12

## Key files
- `src/lib/access.ts`
