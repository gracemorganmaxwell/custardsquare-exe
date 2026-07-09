---
json: {"title":"Boot screen + reduced motion","labels":["epic:desktop-ui","priority:mvp","type:feature"],"milestone":"M4 — Desktop Shell"}
---

> Solo-admin site (Grace publishes everything). Content first → desktop second → magic third. Ship the simplest version that works.

Short boot when entering the site. Skip animation if prefers-reduced-motion.

## Done when
- [ ] Shows custardsquare.exe startup lines
- [ ] Continues to desktop/login
- [ ] Reduced motion skips typing animation

## Likely files
- `src/components/desktop/BootScreen.tsx`
