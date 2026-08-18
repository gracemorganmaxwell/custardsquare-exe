---
json: {"title":"V2: Projects collection + window","labels":["epic:desktop-apps","priority:v2","type:feature"],"milestone":null}
---

> Solo-admin site (Grace publishes everything). Content first → desktop second → magic third. Ship the simplest version that works.

Project case studies with links. When you have projects worth showcasing.

## Done when
- [x] Projects in Payload (collection — title, URL, summary, story, icon, published)
- [x] Projects window lists them

## Current behaviour

The Projects desktop app reads published docs from the `projects` collection. First Payload boot seeds the four live sites. Empty published set falls back to `DEFAULT_PROJECTS`. Each row uses that site's favicon (bundled, or a Media upload on the doc). Edit copy and icons in `/admin` → Projects.

Rich-text per-project pages (slugs, SEO) remain later if needed.
