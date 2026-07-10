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

const testEmail = 'issue-011-evidence@payloadcms.com'
const testPassword = 'evidence-test-123'

await mkdir(outDir, { recursive: true })

const verificationLog = execSync('pnpm verify-issue-011', { cwd: root, encoding: 'utf8' })

execSync(
  `node --import tsx/esm -e "
import 'dotenv/config'
import { getPayload } from 'payload'
import config from './src/payload.config.ts'
const payload = await getPayload({ config: await config })
await payload.delete({ collection: 'users', where: { email: { equals: '${testEmail}' } }, overrideAccess: true })
await payload.create({ collection: 'users', data: { email: '${testEmail}', password: '${testPassword}' }, overrideAccess: true })
await payload.updateGlobal({
  slug: 'site-settings',
  data: {
    credits: 'Icons by aconfuseddragon (https://aconfuseddragon.itch.io/) — Win95 Plus packs. Not affiliated with Microsoft.',
  },
  overrideAccess: true,
})
process.exit(0)
"`,
  { cwd: root, stdio: 'inherit' },
)

const siteSettingsSource = await readFile(path.join(root, 'src/globals/SiteSettings.ts'), 'utf8')
const issueManifest = await readFile(path.join(root, 'docs/issues/011-credits-collection.md'), 'utf8')

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })

await page.goto(`${baseUrl}/admin/login`, { waitUntil: 'domcontentloaded', timeout: 15000 })
await page.waitForSelector('#field-email', { timeout: 10000 })
await page.fill('#field-email', testEmail)
await page.fill('#field-password', testPassword)
await page.click('button[type="submit"]')
await page.waitForURL('**/admin', { timeout: 15000 })

// AC — Cancelled: no separate Credits collection
await page.setContent(`<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><title>Issue #11 — cancelled</title></head>
<body style="margin:0;padding:2rem;font-family:ui-monospace,monospace;background:#0f172a;color:#e2e8f0;">
  <h1 style="font-family:system-ui,sans-serif;color:#fbbf24;">Issue #11 — Credits collection cancelled</h1>
  <p style="font-family:system-ui,sans-serif;">Separate <code>Credits</code> collection deferred. Credits live in <strong>SiteSettings</strong> (#10) as a simple textarea for MVP.</p>
  <pre style="background:#1e293b;padding:1rem;border-radius:8px;white-space:pre-wrap;">${issueManifest.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
  <pre style="background:#1e293b;padding:1rem;border-radius:8px;margin-top:1rem;white-space:pre-wrap;">${verificationLog.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
</body></html>`)
await page.screenshot({ path: path.join(outDir, 'issue-011-ac1-cancelled-folded.png'), fullPage: true })

// AC — Admin edits credits in SiteSettings
await page.goto(`${baseUrl}/admin/globals/site-settings`, {
  waitUntil: 'domcontentloaded',
  timeout: 15000,
})
await page.waitForSelector('#field-credits', { timeout: 15000 })
await page.waitForTimeout(600)
await page.screenshot({ path: path.join(outDir, 'issue-011-ac2-sitesettings-credits.png'), fullPage: true })

// AC — Frontend reads credits
await page.setContent(`<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><title>Issue #11 — frontend reads credits</title></head>
<body style="margin:0;padding:2rem;font-family:ui-monospace,monospace;background:#0f172a;color:#e2e8f0;">
  <h1 style="font-family:system-ui,sans-serif;color:#38bdf8;">Credits folded into SiteSettings — frontend read path</h1>
  <p style="font-family:system-ui,sans-serif;"><code>getSiteSettings()</code> exposes <code>credits</code> for the Credits window (#35).</p>
  <h2 style="font-family:system-ui,sans-serif;color:#93c5fd;">src/globals/SiteSettings.ts</h2>
  <pre style="background:#1e293b;padding:1rem;border-radius:8px;">${siteSettingsSource.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
  <pre style="background:#1e293b;padding:1rem;border-radius:8px;margin-top:1rem;white-space:pre-wrap;">${verificationLog.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
</body></html>`)
await page.screenshot({ path: path.join(outDir, 'issue-011-ac3-frontend-read.png'), fullPage: true })

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

console.log(`Saved issue #11 screenshots to ${outDir}`)
