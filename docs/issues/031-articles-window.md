---
json: {"title":"Articles window","labels":["epic:desktop-apps","priority:mvp","type:feature"],"milestone":"M5 — Desktop Apps"}
---

> Solo-admin site (Grace publishes everything). Content first → desktop second → magic third. Ship the simplest version that works.

Desktop app listing published articles with a link to the full page.

## Done when
- [x] Published articles appear in a list
- [x] Click opens `/articles/[slug]` or shows preview

## Evidence
- `docs/screenshots/foundation/issue-031-ac1-articles-list.png`
- `docs/screenshots/foundation/issue-031-ac2-article-link.png`
- Capture: `node --import tsx/esm scripts/capture-issue-031-evidence.mjs`

## Depends on
- #14
- #27

## Likely files
- `src/components/windows/ArticlesWindow.tsx`
