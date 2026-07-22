---
json: {"title":"Projects window shortcuts (rain check, Refined K-9, Blue Rose)","labels":["epic:desktop-apps","priority:mvp","type:feature"],"milestone":"M5 — Desktop Apps"}
---

> Solo-admin site (Grace publishes everything). Content first → desktop second → magic third. Ship the simplest version that works.

Replace the Projects coming-soon placeholder with a hardcoded folder of browser shortcuts (external portfolio links + blurbs). Full CMS Projects stays V2 (#051).

## Done when
- [ ] Projects window lists rain check, Refined K-9, and Blue Rose Nails with browser icons
- [ ] Click opens each URL in a new browser tab
- [ ] Selecting an item shows its blurb in the status bar
- [ ] Notes window remains coming soon

## Depends on
- #38

## Likely files
- `src/lib/project-links.ts`
- `src/components/windows/ProjectsWindow.tsx`
- `src/components/desktop/WindowManager.tsx`
- `DECISIONS.md`
