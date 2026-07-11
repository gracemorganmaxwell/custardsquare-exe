---
json: {"title":"SiteSettings global","labels":["epic:cms","priority:mvp","type:feature"],"milestone":"M2 — CMS Schema"}
---

> Solo-admin site (Grace publishes everything). Content first → desktop second → magic third. Ship the simplest version that works.

One Payload global for site-wide values. Start small now; add about/skills/resume fields when those windows are built.

## Done when
- [x] Admin can edit site title, description, default OG image, and favicon
- [x] Social links (label + URL) are editable
- [x] Frontend reads settings; only logged-in admin can update
- [x] Credits for icons/assets live here as simple text or a short list — no separate Credits collection
- [x] About window fields (name, bio, portrait) live here — see #32
- [x] Resume window fields (body, pdf) live here — see #34

## Likely files
- `src/globals/SiteSettings.ts`
