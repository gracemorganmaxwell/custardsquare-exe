---
json: {"title":"Taskbar + clock","labels":["epic:desktop-ui","priority:mvp","type:feature"],"milestone":"M4 — Desktop Shell"}
---

> Solo-admin site (Grace publishes everything). Content first → desktop second → magic third. Ship the simplest version that works.

Win95 taskbar with open-window buttons and a clock.

## Done when
- [x] Clock shows local time
- [x] Open windows appear in the taskbar
- [x] Clicking taskbar button focuses/restores window

## Evidence
- `docs/screenshots/foundation/issue-028-ac1-ac2-taskbar-clock.png`
- `docs/screenshots/foundation/issue-028-ac3-taskbar-restore.png`
- Capture: `node --import tsx/esm scripts/capture-issue-026-030-evidence.mjs`

## Likely files
- `src/components/desktop/Taskbar.tsx`
