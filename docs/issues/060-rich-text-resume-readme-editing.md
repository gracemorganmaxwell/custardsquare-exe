---
json: {"title":"Rich-text Resume (README-style editing)","labels":["epic:desktop-apps","priority:mvp","type:feature"],"milestone":"M5 — Desktop Apps"}
---

> Solo-admin site (Grace publishes everything). Content first → desktop second → magic third. Ship the simplest version that works.

Upgrade the Resume window from plain text to Lexical rich text (same editor as Articles) so the CMS and desktop UI support README-like formatting: headings, bold/italic, links, lists, code, and more.

## Done when
- [x] SiteSettings Resume uses Lexical rich text (headings, bold, links, lists, code)
- [x] Resume window renders that rich content (not a plain `<pre>`)
- [x] PDF download still works
- [x] Seeded default resume keeps structure (headings + sections) from the Jul 2026 PDF

## Evidence
- `docs/screenshots/foundation/issue-060-ac1-cms-richtext-field.png`
- `docs/screenshots/foundation/issue-060-ac2-rich-resume-ui.png`
- `docs/screenshots/foundation/issue-060-ac3-pdf-download.png`
- CMS: `/admin` → Site Settings → **Resume window** → rich text `content`
- Capture: `node --import tsx/esm scripts/capture-issue-060-evidence.mjs`

## Depends on
- #34
- #7

## Likely files
- `src/globals/SiteSettings.ts`
- `src/components/windows/ResumeWindow.tsx`
- `src/components/richtext/RichTextDocument.tsx`
- `src/lib/default-resume-lexical.ts`
- `src/lib/site-settings.ts`
