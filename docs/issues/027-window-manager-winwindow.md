---
json: {"title":"Window manager + WinWindow","labels":["epic:desktop-ui","priority:mvp","type:feature"],"milestone":"M4 — Desktop Shell"}
---

> Solo-admin site (Grace publishes everything). Content first → desktop second → magic third. Ship the simplest version that works.

Basic draggable windows with title bar. Open, close, minimize. Good enough beats perfect.

## Done when
- [ ] Windows open and close
- [x] Active/inactive title bar styles
- [x] Draggable on desktop

## Progress
`WinWindow` + `WelcomeWindow` ship title-bar drag and active/inactive chrome. Open/close/minimize still pending (`WindowManager`).

## Likely files
- `src/components/desktop/WindowManager.tsx`
- `src/components/ui95/WinWindow.tsx`
