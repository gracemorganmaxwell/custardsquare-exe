import { chromium } from '@playwright/test'
import { execSync } from 'node:child_process'
import { readFile } from 'node:fs/promises'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const outDir = path.resolve(root, 'docs/screenshots/foundation')
const baseUrl = process.env.BASE_URL ?? 'http://localhost:3000'

await mkdir(outDir, { recursive: true })

const verificationLog = execSync('pnpm verify-issue-013', { cwd: root, encoding: 'utf8' })

const accessSource = await readFile(path.join(root, 'src/lib/access.ts'), 'utf8')
const articlesSource = await readFile(path.join(root, 'src/collections/Articles.ts'), 'utf8')
const articlesLibSource = await readFile(path.join(root, 'src/lib/articles.ts'), 'utf8')
const articlesPageSource = await readFile(
  path.join(root, 'src/app/(frontend)/articles/page.tsx'),
  'utf8',
)

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })

// AC1 — publishedOnly on Articles
await page.setContent(`<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><title>AC1 — publishedOnly</title></head>
<body style="margin:0;padding:2rem;font-family:ui-monospace,monospace;background:#0f172a;color:#e2e8f0;">
  <h1 style="font-family:system-ui,sans-serif;color:#38bdf8;">AC1 — publishedOnly read access on Articles</h1>
  <h2 style="font-family:system-ui,sans-serif;color:#93c5fd;">src/lib/access.ts</h2>
  <pre style="background:#1e293b;padding:1rem;border-radius:8px;">${accessSource.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
  <h2 style="font-family:system-ui,sans-serif;color:#93c5fd;">Articles.ts access block</h2>
  <pre style="background:#1e293b;padding:1rem;border-radius:8px;">${articlesSource.slice(0, 280).replace(/</g, '&lt;').replace(/>/g, '&gt;')}…</pre>
</body></html>`)
await page.screenshot({ path: path.join(outDir, 'issue-013-ac1-published-only.png'), fullPage: true })

// AC2 — Drafts excluded from public API
await page.setContent(`<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><title>AC2 — no drafts in public API</title></head>
<body style="margin:0;padding:2rem;font-family:ui-monospace,monospace;background:#0f172a;color:#e2e8f0;">
  <h1 style="font-family:system-ui,sans-serif;color:#86efac;">AC2 — Drafts never returned in public queries</h1>
  <p style="font-family:system-ui,sans-serif;">Local API + REST + <code>getPublished*</code> helpers all exclude drafts.</p>
  <pre style="background:#1e293b;padding:1rem;border-radius:8px;white-space:pre-wrap;">${verificationLog.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
</body></html>`)
await page.screenshot({ path: path.join(outDir, 'issue-013-ac2-no-drafts-public.png'), fullPage: true })

// AC3 — No draft data in static bundles
await page.setContent(`<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><title>AC3 — dynamic frontend</title></head>
<body style="margin:0;padding:2rem;font-family:ui-monospace,monospace;background:#0f172a;color:#e2e8f0;">
  <h1 style="font-family:system-ui,sans-serif;color:#a78bfa;">AC3 — No draft data in frontend static bundles</h1>
  <p style="font-family:system-ui,sans-serif;"><code>force-dynamic</code> routes fetch published articles at request time.</p>
  <h2 style="font-family:system-ui,sans-serif;color:#93c5fd;">src/lib/articles.ts</h2>
  <pre style="background:#1e293b;padding:1rem;border-radius:8px;">${articlesLibSource.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
  <h2 style="font-family:system-ui,sans-serif;color:#93c5fd;">articles/page.tsx (excerpt)</h2>
  <pre style="background:#1e293b;padding:1rem;border-radius:8px;">${articlesPageSource.slice(0, 400).replace(/</g, '&lt;').replace(/>/g, '&gt;')}…</pre>
</body></html>`)
await page.screenshot({ path: path.join(outDir, 'issue-013-ac3-dynamic-frontend.png'), fullPage: true })

// Live check — public articles index shows only published
await page.goto(`${baseUrl}/articles`, { waitUntil: 'domcontentloaded', timeout: 15000 })
await page.waitForTimeout(600)
await page.screenshot({ path: path.join(outDir, 'issue-013-ac3-articles-index.png'), fullPage: true })

await browser.close()

console.log(`Saved issue #13 screenshots to ${outDir}`)
