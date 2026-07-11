---
json: {"title":"Double-click desktop icons (classic Win9x)","labels":["epic:desktop-ui","priority:mvp","type:feature"],"milestone":"M4 — Desktop Shell"}
---

> Solo-admin site (Grace publishes everything). Content first → desktop second → magic third. Ship the simplest version that works.

Classic desktop behaviour: single-click selects, double-click opens. Keyboard Enter/Space still activates.

## Done when
- [x] Single click selects an icon without opening
- [x] Double click opens the app/window
- [x] Enter / Space still opens the selected icon

## Evidence
- `docs/screenshots/foundation/issue-063-ac1-single-click-select.png`
- `docs/screenshots/foundation/issue-063-ac2-double-click-open.png`
- Capture: `node --import tsx/esm scripts/capture-issue-033-059-evidence.mjs`

## Depends on
- #25

## Likely files
- `src/components/desktop/DesktopIcon.tsx`
- `src/components/desktop/DesktopIconGrid.tsx`
