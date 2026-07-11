---
json: {"title":"Optional boot/click sounds (muted by default)","labels":["epic:desktop-ui","priority:mvp","type:feature"],"milestone":"M4 — Desktop Shell"}
---

> Solo-admin site (Grace publishes everything). Content first → desktop second → magic third. Ship the simplest version that works.

Optional Win9x-flavoured sounds for boot and UI clicks. **Muted by default**; respect `prefers-reduced-motion` / user toggle. Keep files tiny.

## Done when
- [ ] Sounds off by default
- [ ] Toggle (Start menu or Welcome) enables boot + click sounds
- [ ] Reduced-motion / mute preference skips audio

## Depends on
- #22
- #29

## Likely files
- `public/sounds/`
- `src/lib/desktop-audio.ts`
- `src/components/desktop/BootScreen.tsx`
- `src/lib/desktopStore.ts`
