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

const verificationLog = execSync('pnpm verify-issue-003', {
  cwd: root,
  encoding: 'utf8',
})

const payloadConfig = await readFile(path.join(root, 'src/payload.config.ts'), 'utf8')
const envExample = await readFile(path.join(root, '.env.example'), 'utf8')

const blobSnippet = payloadConfig
  .split('\n')
  .slice(54, 66)
  .join('\n')

const envBlobLines = envExample
  .split('\n')
  .filter((line) => line.includes('BLOB') || (line.startsWith('#') && envExample.includes('Blob')))
  .slice(-3)
  .join('\n')

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })

// AC1 — Blob adapter in payload.config + Media collection
await page.setContent(`<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><title>AC1 — Blob adapter</title></head>
<body style="margin:0;padding:2rem;font-family:ui-monospace,monospace;background:#0f172a;color:#e2e8f0;">
  <h1 style="font-family:system-ui,sans-serif;color:#38bdf8;">AC1 — Media collection uses Blob adapter</h1>
  <p style="font-family:system-ui,sans-serif;">@payloadcms/storage-vercel-blob in <code>src/payload.config.ts</code> · <code>Media</code> has <code>upload: true</code></p>
  <pre style="background:#1e293b;padding:1rem;border-radius:8px;line-height:1.45;">${blobSnippet.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
</body></html>`)
await page.screenshot({ path: path.join(outDir, 'issue-003-ac1-blob-adapter.png'), fullPage: true })

// AC2 — BLOB_READ_WRITE_TOKEN in .env.example
await page.setContent(`<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><title>AC2 — BLOB token docs</title></head>
<body style="margin:0;padding:2rem;font-family:ui-monospace,monospace;background:#1e1e1e;color:#d4d4d4;">
  <h1 style="font-family:system-ui,sans-serif;color:#4ec9b0;">AC2 — BLOB_READ_WRITE_TOKEN documented</h1>
  <p style="font-family:system-ui,sans-serif;">From <code>.env.example</code></p>
  <pre style="background:#252526;padding:1rem;border-radius:8px;line-height:1.45;white-space:pre-wrap;">${envExample.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
</body></html>`)
await page.screenshot({ path: path.join(outDir, 'issue-003-ac2-env-example.png'), fullPage: true })

// AC3 — Upload works in dev (verification log + admin Media collection)
await page.setContent(`<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><title>AC3 — Media upload</title></head>
<body style="margin:0;padding:2rem;font-family:ui-monospace,monospace;background:#0f172a;color:#e2e8f0;">
  <h1 style="font-family:system-ui,sans-serif;color:#86efac;">AC3 — Admin can upload image in dev when token is set</h1>
  <p style="font-family:system-ui,sans-serif;">Payload create → read → delete on <code>media</code> collection</p>
  <pre style="background:#1e293b;padding:1rem;border-radius:8px;line-height:1.5;white-space:pre-wrap;">${verificationLog.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
</body></html>`)
await page.screenshot({ path: path.join(outDir, 'issue-003-ac3-media-upload.png'), fullPage: true })

// Try admin Media UI screenshot if test user exists
try {
  await page.goto(`${baseUrl}/admin/login`, { waitUntil: 'networkidle' })
  await page.fill('#field-email', 'dev@payloadcms.com')
  await page.fill('#field-password', 'test')
  await page.click('button[type="submit"]')
  await page.waitForURL(`${baseUrl}/admin`, { timeout: 10000 })
  await page.goto(`${baseUrl}/admin/collections/media`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(600)
  await page.screenshot({
    path: path.join(outDir, 'issue-003-ac3-admin-media-ui.png'),
    fullPage: true,
  })
} catch {
  console.log('Skipped admin Media UI screenshot (login unavailable)')
}

await browser.close()
console.log(`Saved issue #3 screenshots to ${outDir}`)
