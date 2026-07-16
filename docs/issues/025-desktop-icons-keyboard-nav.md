---
json: {"title":"Desktop icons + keyboard nav","labels":["epic:desktop-ui","priority:mvp","type:feature"],"milestone":"M4 — Desktop Shell"}
---

> Solo-admin site (Grace publishes everything). Content first → desktop second → magic third. Ship the simplest version that works.

Desktop icons that open apps. Click and Enter both work.

## Done when
- [x] Icons use assets from `public/icons/`
- [x] Click or Enter opens the app window

## Evidence
- Implemented in `DesktopIconGrid` + `desktop-icons.ts` (opens windows / explorer folders)
- Visual: `docs/screenshots/foundation/issue-026-ac1-ac2-open-focus.png` (icons visible on desktop)

## Likely files
- `src/components/desktop/DesktopIcon.tsx`
- `src/components/desktop/DesktopIconGrid.tsx`
- `src/lib/desktop-icons.ts`
