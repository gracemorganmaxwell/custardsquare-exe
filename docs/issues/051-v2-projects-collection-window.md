---
json: {"title":"V2: Projects collection + window","labels":["epic:desktop-apps","priority:v2","type:feature"],"milestone":null}
---

> Solo-admin site (Grace publishes everything). Content first → desktop second → magic third. Ship the simplest version that works.

Project case studies with links. When you have projects worth showcasing.

## Done when
- [ ] Projects in Payload (collection — still V2)
- [x] Projects window lists them (Site Settings array + bundled defaults)

## Current behaviour

The Projects desktop app lists live sites from Site Settings (`projects` array) and shows a story pane for the selected row. Empty CMS data falls back to `DEFAULT_PROJECTS` in `src/lib/default-projects.ts`. A dedicated Payload collection remains V2 for case-study pages (drafts, slugs, SEO).
