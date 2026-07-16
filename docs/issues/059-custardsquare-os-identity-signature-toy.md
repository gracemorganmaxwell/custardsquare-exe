---
json: {"title":"custardsquare OS identity + one signature toy","labels":["epic:desktop-ui","priority:mvp","type:feature"],"milestone":"M4 — Desktop Shell"}
---

> Solo-admin site (Grace publishes everything). Content first → desktop second → magic third. Ship the simplest version that works.

Lean into the named OS brand (wallpaper caption already says **custardsquare OS**) and pick **one** signature toy that peers use on Win9x portfolios — without turning the site into a full OS sim.

## Done when
- [x] OS identity shows in at least two chrome surfaces (e.g. wallpaper caption + About/shutdown/boot copy)
- [x] One signature toy ships (prefer Terminal `#37` or a tiny sticky-notes flavour — not Minesweeper/Clippy unless you want that)
- [x] Toy is discoverable from Start menu or desktop icon

## Evidence
- `docs/screenshots/foundation/issue-059-ac1-shutdown-os-identity.png`
- `docs/screenshots/foundation/issue-037-ac1-terminal-help.png`
- Capture: `node --import tsx/esm scripts/capture-issue-033-059-evidence.mjs`

## Note
Peers worth glancing at: andresmit.co.za (Clippy/BSOD), 98-portfolio (folder apps), willos-98 (serious content in Win98 shell), 98.js.org (full sim — **do not** copy scope). Soft frame + sharp controls stays the brand; dreaminess lives in wallpaper/title gradient, not every corner.

## Depends on
- #27
- #29
- #30

## Likely files
- `src/components/desktop/DesktopShell.tsx`
- `src/components/desktop/ShutdownDialog.tsx`
- `src/components/desktop/DesktopExperience.tsx`
- `src/components/windows/TerminalWindow.tsx`
