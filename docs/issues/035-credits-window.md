---
json: {"title":"Credits window","labels":["epic:desktop-apps","priority:mvp","type:feature"],"milestone":"M5 — Desktop Apps"}
---

> Solo-admin site (Grace publishes everything). Content first → desktop second → magic third. Ship the simplest version that works.

Show credits from SiteSettings (aconfuseddragon icons + Microsoft disclaimer).

## Done when
- [x] Credits display in a window
- [x] Optional plain `/credits` page for mobile

## Evidence
- `docs/screenshots/foundation/issue-035-ac1-credits-window.png`
- `docs/screenshots/foundation/issue-035-ac2-credits-page.png`
- Capture: `node --import tsx/esm scripts/capture-issue-033-059-evidence.mjs`

## Depends on
- #10

## Likely files
- `src/components/windows/CreditsWindow.tsx`
- `src/app/(frontend)/credits/page.tsx`
