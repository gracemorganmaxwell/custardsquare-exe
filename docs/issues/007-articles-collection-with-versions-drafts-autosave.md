---
json: {"title":"Articles collection with versions/drafts/autosave","labels":["epic:cms","priority:mvp","type:feature"],"milestone":"M2 — CMS Schema"}
---

> Solo-admin site (Grace publishes everything). Content first → desktop second → magic third. Ship the simplest version that works.

Long-form Articles collection with maturity labels, slug, reading time, and versioning.

## Done when
- [ ] Admin can create and save draft article
- [ ] Admin can publish article
- [ ] Versions are created on save
- [ ] Slug auto-generated from title

## Depends on
- #6

## Likely files
- `src/collections/Articles.ts`
- `src/lib/slugify.ts`
- `src/lib/readingTime.ts`
