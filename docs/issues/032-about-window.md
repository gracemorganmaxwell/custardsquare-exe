---
json: {"title":"About window","labels":["epic:desktop-apps","priority:mvp","type:feature"],"milestone":"M5 — Desktop Apps"}
---

> Solo-admin site (Grace publishes everything). Content first → desktop second → magic third. Ship the simplest version that works.

About Grace — content from SiteSettings. Add the field to SiteSettings when you build this.

## Done when
- [x] About text renders in a window
- [x] Links work

## Evidence
- `docs/screenshots/foundation/issue-032-ac1-about-text.png` — portrait + about copy
- `docs/screenshots/foundation/issue-032-ac2-linkedin-link.png` — LinkedIn button
- Capture: `node --import tsx/esm scripts/capture-issue-032-evidence.mjs`

## Depends on
- #10

## Likely files
- `src/components/windows/AboutWindow.tsx`
- `public/brand/about-portrait.png`
