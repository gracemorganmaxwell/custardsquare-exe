---
json: {"title":"Boot screen + reduced motion","labels":["epic:desktop-ui","priority:mvp","type:feature"],"milestone":"M4 — Desktop Shell"}
---

Boot sequence with typing animation; skip when prefers-reduced-motion.

## Acceptance criteria
- [ ] Displays Starting custardsquare.exe... lines
- [ ] Transitions to desktop/login
- [ ] Reduced motion skips animation

## Key files
- `src/components/desktop/BootScreen.tsx`
