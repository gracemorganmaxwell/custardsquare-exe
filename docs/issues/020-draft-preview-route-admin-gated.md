---
json: {"title":"Draft preview route (admin-gated)","labels":["epic:public-content","priority:mvp","type:feature"],"milestone":"M3 — Public Content"}
---

Protected /preview/[slug] route for admin draft preview.

## Acceptance criteria
- [ ] Unauthenticated visitors cannot view drafts
- [ ] Admin can preview draft article
- [ ] Preview not indexed (noindex)

## Dependencies
- #15

## Key files
- `src/app/preview/[slug]/page.tsx`
