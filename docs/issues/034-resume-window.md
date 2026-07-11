---
json: {"title":"Resume window","labels":["epic:desktop-apps","priority:mvp","type:feature"],"milestone":"M5 — Desktop Apps"}
---

> Solo-admin site (Grace publishes everything). Content first → desktop second → magic third. Ship the simplest version that works.

Notepad-style resume from SiteSettings (seeded from `gracie-resume-jul26.pdf`). Monospace text + PDF download.

## Done when
- [x] Resume text renders
- [x] Link to download or plain text view
- [x] Admin can edit resume body and optional PDF in SiteSettings

## Evidence
- `docs/screenshots/foundation/issue-034-ac1-resume-text.png`
- `docs/screenshots/foundation/issue-034-ac2-pdf-download.png`
- Source PDF: `public/brand/gracie-resume-jul26.pdf`
- CMS: `/admin` → Site Settings → **Resume window** (body + pdf)
- Capture: `node --import tsx/esm scripts/capture-issue-034-evidence.mjs`

## Depends on
- #10

## Likely files
- `src/components/windows/ResumeWindow.tsx`
- `src/globals/SiteSettings.ts`
- `src/lib/default-resume.ts`
- `public/brand/gracie-resume-jul26.pdf`
