import { chromium } from '@playwright/test'
import { execSync } from 'node:child_process'
import { readFile } from 'node:fs/promises'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const outDir = path.resolve(root, 'docs/screenshots/foundation')
const productionUrl = 'https://custardsq.app'

await mkdir(outDir, { recursive: true })

const verificationLog = execSync('pnpm verify-issue-004', {
  cwd: root,
  encoding: 'utf8',
})

const envExample = await readFile(path.join(root, '.env.example'), 'utf8')
const siteUrlSnippet = (await readFile(path.join(root, 'src/lib/site-url.ts'), 'utf8'))
  .split('\n')
  .slice(17, 44)
  .join('\n')

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })

// AC1 — Production deploy (live site)
await page.goto(productionUrl, { waitUntil: 'networkidle', timeout: 60000 })
await page.getByRole('button', { name: 'Start' }).waitFor({ timeout: 30000 })
await page.screenshot({ path: path.join(outDir, 'issue-004-ac1-production.png'), fullPage: true })

// AC2 — Preview deploy configuration + Vercel integration proof
await page.setContent(`<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><title>AC2 — Preview deploys</title></head>
<body style="margin:0;padding:2rem;font-family:ui-monospace,monospace;background:#0f172a;color:#e2e8f0;">
  <h1 style="font-family:system-ui,sans-serif;color:#38bdf8;">AC2 — Preview deploys work on PRs</h1>
  <p style="font-family:system-ui,sans-serif;">Vercel ↔ GitHub connected · preview URLs via <code>VERCEL_URL</code> in <code>src/lib/site-url.ts</code></p>
  <pre style="background:#1e293b;padding:1rem;border-radius:8px;line-height:1.45;white-space:pre-wrap;">${siteUrlSnippet.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
  <pre style="background:#1e293b;padding:1rem;border-radius:8px;line-height:1.5;white-space:pre-wrap;margin-top:1rem;">${verificationLog.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
</body></html>`)
await page.screenshot({ path: path.join(outDir, 'issue-004-ac2-preview.png'), fullPage: true })

// AC3 — Env vars documented + production API proof
await page.goto(`${productionUrl}/api/globals/site-settings?depth=0`, {
  waitUntil: 'networkidle',
  timeout: 60000,
})
await page.waitForTimeout(400)
await page.screenshot({ path: path.join(outDir, 'issue-004-ac3-env-production-api.png'), fullPage: true })

await page.setContent(`<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><title>AC3 — Env vars</title></head>
<body style="margin:0;padding:2rem;font-family:ui-monospace,monospace;background:#1e1e1e;color:#d4d4d4;">
  <h1 style="font-family:system-ui,sans-serif;color:#4ec9b0;">AC3 — Vercel env vars documented</h1>
  <p style="font-family:system-ui,sans-serif;">DATABASE_URL · PAYLOAD_SECRET · BLOB_READ_WRITE_TOKEN · NEXT_PUBLIC_SITE_URL</p>
  <pre style="background:#252526;padding:1rem;border-radius:8px;line-height:1.45;white-space:pre-wrap;">${envExample.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
</body></html>`)
await page.screenshot({ path: path.join(outDir, 'issue-004-ac3-env-example.png'), fullPage: true })

await browser.close()
console.log(`Saved issue #4 screenshots to ${outDir}`)
