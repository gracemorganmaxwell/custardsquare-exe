---
json: {"title":"Article detail page","labels":["epic:public-content","priority:mvp","type:feature"],"milestone":"M3 — Public Content"}
---

> Solo-admin site (Grace publishes everything). Content first → desktop second → magic third. Ship the simplest version that works.

Build /articles/[slug] with full article body and metadata.

## Done when
- [x] Article body renders from Lexical rich text
- [x] Drafts return 404
- [x] Soft-deleted content returns 404

## Depends on
- #14

## Likely files
- `src/app/(public)/articles/[slug]/page.tsx`
