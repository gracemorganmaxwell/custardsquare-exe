---
json: {"title":"Desktop UI state (Zustand)","labels":["epic:desktop-ui","priority:mvp","type:feature"],"milestone":"M4 — Desktop Shell"}
---

> Solo-admin site (Grace publishes everything). Content first → desktop second → magic third. Ship the simplest version that works.

In-memory state for open windows and focus. Saving layout to localStorage is V2 (#55).

## Done when
- [x] Track which windows are open
- [x] Active window focus works

## Evidence
- `docs/screenshots/foundation/issue-026-ac1-ac2-open-focus.png` — welcome window open + taskbar focus chrome
- Capture: `node --import tsx/esm scripts/capture-issue-026-030-evidence.mjs`

## Likely files
- `src/lib/desktopStore.ts`
