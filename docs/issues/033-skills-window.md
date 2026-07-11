---
json: {"title":"Skills window","labels":["epic:desktop-apps","priority:mvp","type:feature"],"milestone":"M5 — Desktop Apps"}
---

> Solo-admin site (Grace publishes everything). Content first → desktop second → magic third. Ship the simplest version that works.

Skills as a simple System Properties-style panel. Plain grouped text is fine.

## Done when
- [x] Skills content from SiteSettings renders
- [x] Readable on desktop and mobile

## Evidence
- `docs/screenshots/foundation/issue-033-ac1-skills-window.png`
- Capture: `node --import tsx/esm scripts/capture-issue-033-059-evidence.mjs`

## Depends on
- #10

## Likely files
- `src/components/windows/SkillsWindow.tsx`
- `src/components/ui95/Win95ScrollArea.tsx`
- `src/lib/default-skills.ts`
- `src/globals/SiteSettings.ts`
