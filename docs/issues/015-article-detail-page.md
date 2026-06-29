---
json: {"title":"Article detail page","labels":["epic:public-content","priority:mvp","type:feature"],"milestone":"M3 — Public Content"}
---

Build /articles/[slug] with full article body and metadata.

## Acceptance criteria
- [ ] Article body renders from Lexical rich text
- [ ] Drafts return 404
- [ ] Soft-deleted content returns 404

## Dependencies
- #14

## Key files
- `src/app/(public)/articles/[slug]/page.tsx`
