---
json: {"title":"Sitemap + robots.txt","labels":["epic:public-content","priority:mvp","type:feature"],"milestone":"M3 — Public Content"}
---

Dynamic sitemap and robots.txt for public routes.

## Acceptance criteria
- [ ] Sitemap includes articles and static public routes
- [ ] Drafts excluded
- [ ] robots.txt allows indexing of public content

## Dependencies
- #14

## Key files
- `src/app/(public)/sitemap.ts`
- `src/app/(public)/robots.ts`
