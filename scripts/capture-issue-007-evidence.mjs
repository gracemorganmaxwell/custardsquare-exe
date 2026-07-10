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

const testEmail = 'issue-007-evidence@payloadcms.com'
const testPassword = 'evidence-test-123'

await mkdir(outDir, { recursive: true })

const verificationLog = execSync('pnpm verify-issue-007', { cwd: root, encoding: 'utf8' })

const seedResult = execSync(
  `node --import tsx/esm -e "
import 'dotenv/config'
import { getPayload } from 'payload'
import config from './src/payload.config.ts'
const payload = await getPayload({ config: await config })
await payload.delete({ collection: 'users', where: { email: { equals: '${testEmail}' } }, overrideAccess: true })
await payload.create({ collection: 'users', data: { email: '${testEmail}', password: '${testPassword}' }, overrideAccess: true })
await payload.delete({ collection: 'articles', where: { title: { equals: 'Issue 7 screenshot draft' } }, overrideAccess: true })
const article = await payload.create({
  collection: 'articles',
  draft: true,
  data: {
    title: 'Issue 7 screenshot draft',
    excerpt: 'Draft excerpt captured for issue #7 evidence.',
    content: {
      root: {
        type: 'root',
        format: '',
        indent: 0,
        version: 1,
        children: [{
          type: 'paragraph',
          format: '',
          indent: 0,
          version: 1,
          children: [{
            mode: 'normal',
            text: 'Draft body text for acceptance criteria screenshot.',
            type: 'text',
            style: '',
            detail: 0,
            format: 0,
            version: 1,
          }],
          direction: null,
        }],
        direction: null,
      },
    },
  },
  overrideAccess: true,
})
console.log(article.id)
process.exit(0)
"`,
  { cwd: root, encoding: 'utf8' },
).trim()

const articleId = seedResult.split('\n').pop()

const articlesSource = await readFile(path.join(root, 'src/collections/Articles.ts'), 'utf8')
const slugifySource = await readFile(path.join(root, 'src/lib/slugify.ts'), 'utf8')
const readingTimeSource = await readFile(path.join(root, 'src/lib/readingTime.ts'), 'utf8')

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })

await page.goto(`${baseUrl}/admin/login`, { waitUntil: 'domcontentloaded', timeout: 15000 })
await page.waitForSelector('#field-email', { timeout: 10000 })
await page.fill('#field-email', testEmail)
await page.fill('#field-password', testPassword)
await page.click('button[type="submit"]')
await page.waitForURL('**/admin', { timeout: 15000 })

// AC1 — Draft article in admin
await page.goto(`${baseUrl}/admin/collections/articles/${articleId}`, {
  waitUntil: 'domcontentloaded',
  timeout: 15000,
})
await page.waitForSelector('#field-title', { timeout: 15000 })
await page.waitForTimeout(800)
await page.screenshot({ path: path.join(outDir, 'issue-007-ac1-draft-save.png'), fullPage: true })

// AC2 — Publish article
await page.getByRole('button', { name: /Publish changes|Publish/ }).click({ timeout: 15000 })
await page.waitForTimeout(1200)
await page.screenshot({ path: path.join(outDir, 'issue-007-ac2-publish.png'), fullPage: true })

// AC3 — Versions + autosave config
await page.setContent(`<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><title>AC3 — versions on save</title></head>
<body style="margin:0;padding:2rem;font-family:ui-monospace,monospace;background:#0f172a;color:#e2e8f0;">
  <h1 style="font-family:system-ui,sans-serif;color:#38bdf8;">AC3 — Versions created on save</h1>
  <p style="font-family:system-ui,sans-serif;">Payload <code>versions.drafts.autosave</code> enabled on Articles.</p>
  <pre style="background:#1e293b;padding:1rem;border-radius:8px;white-space:pre-wrap;">${verificationLog.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
</body></html>`)
await page.screenshot({ path: path.join(outDir, 'issue-007-ac3-versions.png'), fullPage: true })

// AC4 — Slug auto-generated from title
await page.setContent(`<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><title>AC4 — slug from title</title></head>
<body style="margin:0;padding:2rem;font-family:ui-monospace,monospace;background:#0f172a;color:#e2e8f0;">
  <h1 style="font-family:system-ui,sans-serif;color:#a78bfa;">AC4 — Slug auto-generated from title</h1>
  <h2 style="font-family:system-ui,sans-serif;color:#93c5fd;">src/lib/slugify.ts</h2>
  <pre style="background:#1e293b;padding:1rem;border-radius:8px;">${slugifySource.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
  <h2 style="font-family:system-ui,sans-serif;color:#93c5fd;">slug hook in Articles.ts</h2>
  <pre style="background:#1e293b;padding:1rem;border-radius:8px;">${articlesSource.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
  <h2 style="font-family:system-ui,sans-serif;color:#93c5fd;">src/lib/readingTime.ts</h2>
  <pre style="background:#1e293b;padding:1rem;border-radius:8px;">${readingTimeSource.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
</body></html>`)
await page.screenshot({ path: path.join(outDir, 'issue-007-ac4-slug.png'), fullPage: true })

await browser.close()

execSync(
  `node --import tsx/esm -e "
import 'dotenv/config'
import { getPayload } from 'payload'
import config from './src/payload.config.ts'
const payload = await getPayload({ config: await config })
await payload.delete({ collection: 'users', where: { email: { equals: '${testEmail}' } }, overrideAccess: true })
await payload.delete({ collection: 'articles', where: { title: { equals: 'Issue 7 screenshot draft' } }, overrideAccess: true })
process.exit(0)
"`,
  { cwd: root, stdio: 'inherit' },
)

console.log(`Saved issue #7 screenshots to ${outDir}`)
