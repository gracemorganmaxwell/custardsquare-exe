---
json: {"title":"V2: Preview drafts in browser","labels":["epic:public-content","priority:v2","type:feature"],"milestone":null}
---

> Solo-admin site (Grace publishes everything). Content first → desktop second → magic third. Ship the simplest version that works.

Only if previewing outside `/admin` matters. For solo publishing, the admin editor is enough.

## Done when
- [ ] Logged-in admin can view a draft at a preview URL
- [ ] Preview is noindex
- [ ] Visitors cannot see drafts

## Depends on
- #15

## Likely files
- `src/app/(frontend)/preview/[slug]/page.tsx`
