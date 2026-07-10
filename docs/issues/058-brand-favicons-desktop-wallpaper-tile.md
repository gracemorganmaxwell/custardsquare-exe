---
json: {"title":"Brand favicons + desktop wallpaper tile","labels":["epic:desktop-ui","priority:mvp","type:feature"],"milestone":"M4 — Desktop Shell"}
---

> Solo-admin site (Grace publishes everything). Content first → desktop second → magic third. Ship the simplest version that works.

Wire brand assets: frontend favicon, Payload admin favicon, and a pixel Windows-flag tile over the existing vaporwave desktop wallpaper.

## Done when
- [x] Frontend uses `custardsq-favicon` (SiteSettings favicon still overrides when set)
- [x] Desktop wallpaper keeps the hazy vaporwave gradient with the flag layered on top (single 100×100 / smaller on mobile — not tiled)
- [x] Payload admin uses `cms-favicon`

## Likely files
- `public/brand/custardsq-favicon.png`
- `public/brand/cms-favicon.png`
- `public/brand/desktop-background.png`
- `src/lib/seo.ts`
- `src/styles/desktop.css`
- `src/payload.config.ts`
