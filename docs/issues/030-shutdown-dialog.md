---
json: {"title":"Shutdown dialog","labels":["epic:desktop-ui","priority:mvp","type:feature"],"milestone":"M4 — Desktop Shell"}
---

> Solo-admin site (Grace publishes everything). Content first → desktop second → magic third. Ship the simplest version that works.

Fun Shut Down dialog — log off, restart, go outside, cancel.

## Done when
- [x] Log off returns to login/boot
- [x] Cancel closes dialog

## Evidence
- `docs/screenshots/foundation/issue-030-ac2-shutdown-dialog.png`
- `docs/screenshots/foundation/issue-030-ac1-log-off-login.png`
- Capture: `node --import tsx/esm scripts/capture-issue-026-030-evidence.mjs`

## Likely files
- `src/components/desktop/ShutdownDialog.tsx`
