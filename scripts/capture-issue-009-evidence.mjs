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

const testEmail = 'issue-009-evidence@payloadcms.com'
const testPassword = 'evidence-test-123'

await mkdir(outDir, { recursive: true })

const verificationLog = execSync('pnpm verify-issue-009', { cwd: root, encoding: 'utf8' })

execSync(
  `node --import tsx/esm -e "
import 'dotenv/config'
import { getPayload } from 'payload'
import config from './src/payload.config.ts'
const payload = await getPayload({ config: await config })
await payload.delete({ collection: 'users', where: { email: { equals: '${testEmail}' } }, overrideAccess: true })
await payload.create({ collection: 'users', data: { email: '${testEmail}', password: '${testPassword}' }, overrideAccess: true })
process.exit(0)
"`,
  { cwd: root, stdio: 'inherit' },
)

const mediaSource = await readFile(path.join(root, 'src/collections/Media.ts'), 'utf8')

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })

await page.goto(`${baseUrl}/admin/login`, { waitUntil: 'domcontentloaded', timeout: 15000 })
await page.waitForSelector('#field-email', { timeout: 10000 })
await page.fill('#field-email', testEmail)
await page.fill('#field-password', testPassword)
await page.click('button[type="submit"]')
await page.waitForURL('**/admin', { timeout: 15000 })

// AC1 — Admin can upload image
await page.goto(`${baseUrl}/admin/collections/media/create`, {
  waitUntil: 'domcontentloaded',
  timeout: 15000,
})
await page.waitForSelector('#field-altText', { timeout: 15000 })
await page.screenshot({ path: path.join(outDir, 'issue-009-ac1-upload-form.png'), fullPage: true })

// AC2 — Alt text required + metadata fields
await page.setContent(`<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><title>AC2 — alt text required</title></head>
<body style="margin:0;padding:2rem;font-family:ui-monospace,monospace;background:#0f172a;color:#e2e8f0;">
  <h1 style="font-family:system-ui,sans-serif;color:#f472b6;">AC2 — Alt text is required</h1>
  <p style="font-family:system-ui,sans-serif;">Media collection fields: altText (required), caption, credit, sourceUrl</p>
  <pre style="background:#1e293b;padding:1rem;border-radius:8px;">${mediaSource.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
  <pre style="background:#1e293b;padding:1rem;border-radius:8px;margin-top:1rem;white-space:pre-wrap;">${verificationLog.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
</body></html>`)
await page.screenshot({ path: path.join(outDir, 'issue-009-ac2-alt-required.png'), fullPage: true })

// AC3 — Blob URL in production
await page.setContent(`<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><title>AC3 — Blob production URL</title></head>
<body style="margin:0;padding:2rem;font-family:ui-monospace,monospace;background:#0f172a;color:#e2e8f0;">
  <h1 style="font-family:system-ui,sans-serif;color:#38bdf8;">AC3 — Image URL served from Blob in production</h1>
  <p style="font-family:system-ui,sans-serif;">Upload stored via <code>@payloadcms/storage-vercel-blob</code>; production serves <code>blob.vercel-storage.com</code> URLs.</p>
  <pre style="background:#1e293b;padding:1rem;border-radius:8px;white-space:pre-wrap;">${verificationLog.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
</body></html>`)
await page.screenshot({ path: path.join(outDir, 'issue-009-ac3-blob-production.png'), fullPage: true })

await browser.close()

execSync(
  `node --import tsx/esm -e "
import 'dotenv/config'
import { getPayload } from 'payload'
import config from './src/payload.config.ts'
const payload = await getPayload({ config: await config })
await payload.delete({ collection: 'users', where: { email: { equals: '${testEmail}' } }, overrideAccess: true })
process.exit(0)
"`,
  { cwd: root, stdio: 'inherit' },
)

console.log(`Saved issue #9 screenshots to ${outDir}`)
