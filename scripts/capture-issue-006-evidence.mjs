import { chromium } from '@playwright/test'
import { execFileSync, execSync } from 'node:child_process'
import { readFile } from 'node:fs/promises'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const outDir = path.resolve(root, 'docs/screenshots/foundation')
const baseUrl = process.env.BASE_URL ?? 'http://localhost:3000'

const testEmail = 'issue-006-evidence@payloadcms.com'
const testPassword = 'evidence-test-123'

await mkdir(outDir, { recursive: true })

const verificationLog = execSync('pnpm verify-issue-006', { cwd: root, encoding: 'utf8' })

// Seed temp user for admin UI screenshots (verify script creates then deletes)
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

const usersSource = await readFile(path.join(root, 'src/collections/Users.ts'), 'utf8')
const accessSource = await readFile(path.join(root, 'src/lib/access.ts'), 'utf8')

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })

// AC1 — Admin login at /admin
await page.goto(`${baseUrl}/admin/login`, { waitUntil: 'domcontentloaded', timeout: 15000 })
await page.waitForSelector('#field-email', { timeout: 10000 })
await page.fill('#field-email', testEmail)
await page.fill('#field-password', testPassword)
await page.click('button[type="submit"]')
await page.waitForURL('**/admin', { timeout: 15000 })
await page.waitForTimeout(800)
await page.screenshot({ path: path.join(outDir, 'issue-006-ac1-admin-dashboard.png'), fullPage: true })

// AC2 — Public registration disabled
const publicCreateBody = execFileSync(
  'curl',
  [
    '-s',
    '-X',
    'POST',
    `${baseUrl}/api/users`,
    '-H',
    'Content-Type: application/json',
    '-d',
    JSON.stringify({ email: 'blocked@test.com', password: 'blocked-123' }),
  ],
  { encoding: 'utf8' },
)
await page.setContent(`<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><title>AC2 — no public registration</title></head>
<body style="margin:0;padding:2rem;font-family:ui-monospace,monospace;background:#0f172a;color:#e2e8f0;">
  <h1 style="font-family:system-ui,sans-serif;color:#f87171;">AC2 — Public registration disabled</h1>
  <p style="font-family:system-ui,sans-serif;">POST /api/users without auth → HTTP 403</p>
  <pre style="background:#1e293b;padding:1rem;border-radius:8px;white-space:pre-wrap;">${publicCreateBody.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
</body></html>`)
await page.screenshot({ path: path.join(outDir, 'issue-006-ac2-no-public-register.png'), fullPage: true })

// AC3 — Solo-admin access model
await page.setContent(`<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><title>AC3 — admin access</title></head>
<body style="margin:0;padding:2rem;font-family:ui-monospace,monospace;background:#0f172a;color:#e2e8f0;">
  <h1 style="font-family:system-ui,sans-serif;color:#38bdf8;">AC3 — Admin access (solo-admin MVP)</h1>
  <p style="font-family:system-ui,sans-serif;">Authenticated user = admin. Articles/Media use <code>isAdmin</code>.</p>
  <h2 style="font-family:system-ui,sans-serif;color:#93c5fd;">src/collections/Users.ts</h2>
  <pre style="background:#1e293b;padding:1rem;border-radius:8px;">${usersSource.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
  <h2 style="font-family:system-ui,sans-serif;color:#93c5fd;">src/lib/access.ts</h2>
  <pre style="background:#1e293b;padding:1rem;border-radius:8px;">${accessSource.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
  <pre style="background:#1e293b;padding:1rem;border-radius:8px;margin-top:1rem;white-space:pre-wrap;">${verificationLog.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
</body></html>`)
await page.screenshot({ path: path.join(outDir, 'issue-006-ac3-admin-access.png'), fullPage: true })

await browser.close()

// Cleanup temp user
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

console.log(`Saved issue #6 screenshots to ${outDir}`)
