---
json: {"title":"Soft delete fields + restore workflow","labels":["epic:cms","priority:mvp","type:feature"],"milestone":"M2 — CMS Schema"}
---

Add softDeletedAt, deletedReason, restoredAt to Articles and filter publicly.

## Acceptance criteria
- [ ] Soft-deleted articles hidden from public queries
- [ ] Admin can view soft-deleted articles
- [ ] Admin can restore article to draft

## Dependencies
- #7

## Key files
- `src/collections/Articles.ts`
- `src/lib/access.ts`
