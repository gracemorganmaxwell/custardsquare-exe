---
json: {"title":"About window","labels":["epic:desktop-apps","priority:mvp","type:feature"],"milestone":"M5 — Desktop Apps"}
---

> Solo-admin site (Grace publishes everything). Content first → desktop second → magic third. Ship the simplest version that works.

About Grace — name, bio, and portrait editable in SiteSettings. LinkedIn from social links.

## Done when
- [x] About text renders in a window
- [x] Links work
- [x] Admin can edit About name, bio, and portrait in SiteSettings

## Evidence
- `docs/screenshots/foundation/issue-032-ac1-about-text.png` — portrait + about copy
- `docs/screenshots/foundation/issue-032-ac2-linkedin-link.png` — LinkedIn button
- CMS: `/admin` → Site Settings → **About window** group (name, bio, portrait)
- Capture: `node --import tsx/esm scripts/capture-issue-032-evidence.mjs`

## Depends on
- #10

## Likely files
- `src/components/windows/AboutWindow.tsx`
- `src/globals/SiteSettings.ts`
- `public/brand/about-portrait.png`
