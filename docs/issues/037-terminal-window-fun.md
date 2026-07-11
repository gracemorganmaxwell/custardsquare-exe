---
json: {"title":"Terminal window (fun)","labels":["epic:desktop-apps","priority:mvp","type:feature"],"milestone":"M5 — Desktop Apps"}
---

> Solo-admin site (Grace publishes everything). Content first → desktop second → magic third. Ship the simplest version that works.

Cosmetic terminal with a handful of commands (`help`, `open`, `articles`). Flavour, not a real shell.

## Done when
- [x] `help` lists commands
- [x] `open articles` opens Articles window

## Evidence
- `docs/screenshots/foundation/issue-037-ac1-terminal-help.png`
- `docs/screenshots/foundation/issue-037-ac2-open-articles.png`
- Capture: `node --import tsx/esm scripts/capture-issue-033-059-evidence.mjs`

## Likely files
- `src/components/windows/TerminalWindow.tsx`
