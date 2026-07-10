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

const verificationLog = execSync('pnpm verify-issue-002', {
  cwd: root,
  encoding: 'utf8',
})

const envExample = await readFile(path.join(root, '.env.example'), 'utf8')

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })

// AC1 — DATABASE_URL works locally (verification log)
await page.setContent(`<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><title>AC1 — DATABASE_URL</title></head>
<body style="margin:0;padding:2rem;font-family:ui-monospace,monospace;background:#0f172a;color:#e2e8f0;">
  <h1 style="font-family:system-ui,sans-serif;color:#38bdf8;">AC1 — DATABASE_URL works locally</h1>
  <p style="font-family:system-ui,sans-serif;color:#86efac;">Ran <code>pnpm verify-issue-002</code> against Neon via <code>@payloadcms/db-vercel-postgres</code></p>
  <pre style="background:#1e293b;padding:1rem;border-radius:8px;line-height:1.5;white-space:pre-wrap;">${verificationLog.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
</body></html>`)
await page.screenshot({ path: path.join(outDir, 'issue-002-ac1-database-url.png'), fullPage: true })

// AC2 — Payload create and read (articles page served from Postgres)
await page.goto(`${baseUrl}/articles`, { waitUntil: 'networkidle' })
await page.locator('.article-list-header').waitFor({ timeout: 10000 })
await page.screenshot({ path: path.join(outDir, 'issue-002-ac2-create-read.png'), fullPage: true })

// AC3 — Production env vars in .env.example
await page.setContent(`<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><title>AC3 — .env.example</title></head>
<body style="margin:0;padding:2rem;font-family:ui-monospace,monospace;background:#1e1e1e;color:#d4d4d4;">
  <h1 style="font-family:system-ui,sans-serif;color:#4ec9b0;">AC3 — Production env vars documented in .env.example</h1>
  <p style="font-family:system-ui,sans-serif;">DATABASE_URL, PAYLOAD_SECRET, NEXT_PUBLIC_SITE_URL, BLOB_READ_WRITE_TOKEN</p>
  <pre style="background:#252526;padding:1rem;border-radius:8px;line-height:1.45;white-space:pre-wrap;">${envExample.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
</body></html>`)
await page.screenshot({ path: path.join(outDir, 'issue-002-ac3-env-example.png'), fullPage: true })

await browser.close()
console.log(`Saved issue #2 screenshots to ${outDir}`)
