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

const testEmail = 'issue-010-evidence@payloadcms.com'
const testPassword = 'evidence-test-123'

await mkdir(outDir, { recursive: true })

const verificationLog = execSync('pnpm verify-issue-010', { cwd: root, encoding: 'utf8' })

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

const siteSettingsSource = await readFile(path.join(root, 'src/globals/SiteSettings.ts'), 'utf8')
const siteSettingsLibSource = await readFile(path.join(root, 'src/lib/site-settings.ts'), 'utf8')

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })

await page.goto(`${baseUrl}/admin/login`, { waitUntil: 'domcontentloaded', timeout: 15000 })
await page.waitForSelector('#field-email', { timeout: 10000 })
await page.fill('#field-email', testEmail)
await page.fill('#field-password', testPassword)
await page.click('button[type="submit"]')
await page.waitForURL('**/admin', { timeout: 15000 })

// AC1 — Core site fields editable in admin
await page.goto(`${baseUrl}/admin/globals/site-settings`, {
  waitUntil: 'domcontentloaded',
  timeout: 15000,
})
await page.waitForSelector('#field-siteTitle', { timeout: 15000 })
await page.screenshot({ path: path.join(outDir, 'issue-010-ac1-core-fields.png'), fullPage: true })

// AC2 — Social links editable
await page.locator('text=Social Links').scrollIntoViewIfNeeded()
await page.waitForTimeout(400)
await page.screenshot({ path: path.join(outDir, 'issue-010-ac2-social-links.png'), fullPage: true })

// AC3 — Frontend reads settings; admin-only update
await page.setContent(`<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><title>AC3 — frontend read + admin update</title></head>
<body style="margin:0;padding:2rem;font-family:ui-monospace,monospace;background:#0f172a;color:#e2e8f0;">
  <h1 style="font-family:system-ui,sans-serif;color:#38bdf8;">AC3 — Frontend reads settings; admin-only update</h1>
  <p style="font-family:system-ui,sans-serif;"><code>getSiteSettings()</code> in layout, homepage, and articles. Public read; <code>update: isAdmin</code>.</p>
  <h2 style="font-family:system-ui,sans-serif;color:#93c5fd;">src/lib/site-settings.ts</h2>
  <pre style="background:#1e293b;padding:1rem;border-radius:8px;">${siteSettingsLibSource.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
  <pre style="background:#1e293b;padding:1rem;border-radius:8px;margin-top:1rem;white-space:pre-wrap;">${verificationLog.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
</body></html>`)
await page.screenshot({ path: path.join(outDir, 'issue-010-ac3-frontend-access.png'), fullPage: true })

// AC4 — Credits in SiteSettings (no separate collection)
await page.setContent(`<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><title>AC4 — credits in SiteSettings</title></head>
<body style="margin:0;padding:2rem;font-family:ui-monospace,monospace;background:#0f172a;color:#e2e8f0;">
  <h1 style="font-family:system-ui,sans-serif;color:#a78bfa;">AC4 — Credits in SiteSettings</h1>
  <p style="font-family:system-ui,sans-serif;">Simple textarea for icon/asset credits. No separate Credits collection (#11 cancelled).</p>
  <pre style="background:#1e293b;padding:1rem;border-radius:8px;">${siteSettingsSource.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
</body></html>`)
await page.screenshot({ path: path.join(outDir, 'issue-010-ac4-credits.png'), fullPage: true })

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

console.log(`Saved issue #10 screenshots to ${outDir}`)
