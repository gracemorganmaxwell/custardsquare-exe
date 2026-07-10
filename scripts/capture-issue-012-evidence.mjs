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

const testEmail = 'issue-012-evidence@payloadcms.com'
const testPassword = 'evidence-test-123'

await mkdir(outDir, { recursive: true })

const verificationLog = execSync('pnpm verify-issue-012', { cwd: root, encoding: 'utf8' })

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

const articlesSource = await readFile(path.join(root, 'src/collections/Articles.ts'), 'utf8')
const accessSource = await readFile(path.join(root, 'src/lib/access.ts'), 'utf8')
const issueManifest = await readFile(
  path.join(root, 'docs/issues/012-soft-delete-fields-restore-workflow.md'),
  'utf8',
)

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })

// AC — Cancelled: draft/published instead of soft delete
await page.setContent(`<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><title>Issue #12 — cancelled</title></head>
<body style="margin:0;padding:2rem;font-family:ui-monospace,monospace;background:#0f172a;color:#e2e8f0;">
  <h1 style="font-family:system-ui,sans-serif;color:#fbbf24;">Issue #12 — Soft delete cancelled</h1>
  <p style="font-family:system-ui,sans-serif;">MVP uses <strong>draft/published</strong> (#7) and hard delete. Soft delete + restore deferred to V2.</p>
  <pre style="background:#1e293b;padding:1rem;border-radius:8px;white-space:pre-wrap;">${issueManifest.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
  <pre style="background:#1e293b;padding:1rem;border-radius:8px;margin-top:1rem;white-space:pre-wrap;">${verificationLog.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
</body></html>`)
await page.screenshot({ path: path.join(outDir, 'issue-012-ac1-cancelled-draft-published.png'), fullPage: true })

await page.goto(`${baseUrl}/admin/login`, { waitUntil: 'domcontentloaded', timeout: 15000 })
await page.waitForSelector('#field-email', { timeout: 10000 })
await page.fill('#field-email', testEmail)
await page.fill('#field-password', testPassword)
await page.click('button[type="submit"]')
await page.waitForURL('**/admin', { timeout: 15000 })

// AC — Draft/published in admin
await page.goto(`${baseUrl}/admin/collections/articles`, {
  waitUntil: 'domcontentloaded',
  timeout: 15000,
})
await page.waitForTimeout(800)
await page.screenshot({ path: path.join(outDir, 'issue-012-ac2-articles-draft-status.png'), fullPage: true })

// AC — Public access filters + hard delete
await page.setContent(`<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><title>Issue #12 — public filter</title></head>
<body style="margin:0;padding:2rem;font-family:ui-monospace,monospace;background:#0f172a;color:#e2e8f0;">
  <h1 style="font-family:system-ui,sans-serif;color:#38bdf8;">Draft/published replaces soft delete</h1>
  <p style="font-family:system-ui,sans-serif;"><code>publishedOnly</code> hides drafts from public. Admin sees all. Hard delete — no restore workflow.</p>
  <h2 style="font-family:system-ui,sans-serif;color:#93c5fd;">src/lib/access.ts</h2>
  <pre style="background:#1e293b;padding:1rem;border-radius:8px;">${accessSource.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
  <h2 style="font-family:system-ui,sans-serif;color:#93c5fd;">Articles.ts (excerpt)</h2>
  <pre style="background:#1e293b;padding:1rem;border-radius:8px;">${articlesSource.slice(0, 900).replace(/</g, '&lt;').replace(/>/g, '&gt;')}…</pre>
  <pre style="background:#1e293b;padding:1rem;border-radius:8px;margin-top:1rem;white-space:pre-wrap;">${verificationLog.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
</body></html>`)
await page.screenshot({ path: path.join(outDir, 'issue-012-ac3-public-filter-hard-delete.png'), fullPage: true })

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

console.log(`Saved issue #12 screenshots to ${outDir}`)
