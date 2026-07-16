---
json: {"title":"Window manager + WinWindow","labels":["epic:desktop-ui","priority:mvp","type:feature"],"milestone":"M4 — Desktop Shell"}
---

> Solo-admin site (Grace publishes everything). Content first → desktop second → magic third. Ship the simplest version that works.

Basic draggable windows with title bar. Open, close, minimize. Good enough beats perfect.

## Done when
- [x] Windows open and close
- [x] Active/inactive title bar styles
- [x] Draggable on desktop

## Evidence
- `docs/screenshots/foundation/issue-027-ac1-open-window.png`
- `docs/screenshots/foundation/issue-027-ac2-active-titlebar.png`
- `docs/screenshots/foundation/issue-027-ac3-draggable-window.png`
- Capture: `node --import tsx/esm scripts/capture-issue-026-030-evidence.mjs`

## Likely files
- `src/components/desktop/WindowManager.tsx`
- `src/components/ui95/WinWindow.tsx`
