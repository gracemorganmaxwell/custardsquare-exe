---
json: {"title":"Boot screen + reduced motion","labels":["epic:desktop-ui","priority:mvp","type:feature"],"milestone":"M4 — Desktop Shell"}
---

> Solo-admin site (Grace publishes everything). Content first → desktop second → magic third. Ship the simplest version that works.

Short boot when entering the site. Skip animation if prefers-reduced-motion.

## Done when
- [x] Shows custardsquare.exe startup lines
- [x] Continues to desktop/login
- [x] Reduced motion skips typing animation

## Likely files
- `src/components/desktop/BootScreen.tsx`
