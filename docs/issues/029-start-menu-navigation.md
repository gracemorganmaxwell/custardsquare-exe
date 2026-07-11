---
json: {"title":"Start menu navigation","labels":["epic:desktop-ui","priority:mvp","type:feature"],"milestone":"M4 — Desktop Shell"}
---

> Solo-admin site (Grace publishes everything). Content first → desktop second → magic third. Ship the simplest version that works.

Start button opens a menu of apps and links.

## Done when
- [x] Start button toggles menu
- [x] Menu items open windows or routes

## Evidence
- `docs/screenshots/foundation/issue-029-ac1-ac2-start-menu.png`
- Capture: `node --import tsx/esm scripts/capture-issue-026-030-evidence.mjs`

## Likely files
- `src/components/desktop/StartMenu.tsx`
