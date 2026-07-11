---
json: {"title":"Mobile full-screen panels","labels":["epic:a11y-responsive","priority:mvp","type:feature"],"milestone":"M6 — Responsive & A11y"}
---

> Solo-admin site (Grace publishes everything). Content first → desktop second → magic third. Ship the simplest version that works.

Windows become full-screen panels on mobile. No dragging.

## Done when
- [x] Close button always visible
- [x] Drag disabled on small screens

## Evidence
- `docs/screenshots/foundation/issue-040-ac1-fullscreen-panel-close.png`
- `docs/screenshots/foundation/issue-040-ac2-close-returns-to-grid.png`
- Capture: `node --import tsx/esm scripts/capture-issue-039-040-evidence.mjs`

## Depends on
- #39

## Likely files
- `src/components/ui95/WinWindow.tsx`
- `src/styles/desktop.css`
