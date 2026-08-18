---
json: {"title":"V2: Projects collection + window","labels":["epic:desktop-apps","priority:v2","type:feature"],"milestone":null}
---

> Solo-admin site (Grace publishes everything). Content first → desktop second → magic third. Ship the simplest version that works.

Live project sites in Payload, listed in the desktop Projects window with stories, favicons, and CMS editing.

## Done when
- [x] Projects collection in Payload (title, URL, summary, story, icon, published)
- [x] Projects window lists published sites with favicons and a story pane

## Current behaviour

The Projects desktop app reads published docs from the `projects` collection. First Payload boot seeds four live sites (Delta Rootz, Refined K-9, Blue Rose, Walkies Quest). Empty published set falls back to `DEFAULT_PROJECTS`. Each row uses that site's favicon (bundled, or a Media upload on the doc). Edit copy and icons in `/admin` → Projects.

Rich-text per-project pages (slugs, SEO) remain later if needed.

## Evidence
- `docs/screenshots/foundation/issue-051-ac1-projects-list.png`
- `docs/screenshots/foundation/issue-051-ac2-project-story.png`
- Capture: `node --import tsx/esm scripts/capture-issue-051-evidence.mjs`
- Verify: `pnpm verify-issue-051`

## Likely files
- `src/collections/Projects.ts`
- `src/lib/projects.ts`
- `src/lib/default-projects.ts`
- `src/components/windows/ProjectsWindow.tsx`
