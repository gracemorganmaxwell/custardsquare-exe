---
json: {"title":"Decorative login screen","labels":["epic:desktop-ui","priority:mvp","type:feature"],"milestone":"M4 — Desktop Shell"}
---

> Solo-admin site (Grace publishes everything). Content first → desktop second → magic third. Ship the simplest version that works.

Fake visitor login — cosmetic only. Click through to the desktop. Not real auth.

## Done when
- [x] Submitting the form enters the desktop
- [x] Separate from `/admin` Payload login

## Evidence
- `docs/screenshots/foundation/issue-030-ac1-log-off-login.png` — decorative Start login (also #30 log-off return)
- `docs/screenshots/issues/issue-023-start-screen.png` (if present from earlier capture)

## Likely files
- `src/components/desktop/DesktopExperience.tsx`
