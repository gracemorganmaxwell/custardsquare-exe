---
json: {"title":"Articles collection with versions/drafts/autosave","labels":["epic:cms","priority:mvp","type:feature"],"milestone":"M2 — CMS Schema"}
---

Long-form Articles collection with maturity labels, slug, reading time, and versioning.

## Acceptance criteria
- [ ] Admin can create and save draft article
- [ ] Admin can publish article
- [ ] Versions are created on save
- [ ] Slug auto-generated from title

## Dependencies
- #6

## Key files
- `src/collections/Articles.ts`
- `src/lib/slugify.ts`
- `src/lib/readingTime.ts`
