---
json: {"title":"Seed About/Resume defaults in Site Settings admin","labels":["epic:cms","priority:mvp","type:chore"],"milestone":"M5 — Desktop Apps"}
---

> Solo-admin site (Grace publishes everything). Content first → desktop second → magic third. Ship the simplest version that works.

Make first-time admin editing clearer: ensure Site Settings shows sensible About/Resume defaults in the admin UI (not only frontend fallbacks), so Grace can tweak without guessing empty fields.

## Done when
- [ ] About name/bio defaults appear when editing Site Settings
- [ ] Resume rich-text field is prefilled or clearly documents the bundled fallback
- [ ] No blank surprise on first CMS open for those groups

## Depends on
- #32
- #60

## Likely files
- `src/globals/SiteSettings.ts`
- `src/lib/default-resume-lexical.ts`
