---
json: {"title":"Zustand desktop store + persistence","labels":["epic:desktop-ui","priority:mvp","type:feature"],"milestone":"M4 — Desktop Shell"}
---

Window state store with localStorage for safe UI prefs only.

## Acceptance criteria
- [ ] openWindows, activeWindowId, minimized/maximized tracked
- [ ] theme, soundEnabled, windowPositions persist
- [ ] No CMS/session data in localStorage

## Key files
- `src/lib/desktopStore.ts`
