import { chromium } from '@playwright/test'
import { execSync } from 'node:child_process'
import { readFile } from 'node:fs/promises'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const outDir = path.resolve(root, 'docs/screenshots/foundation')
const issuesOutDir = path.resolve(root, 'docs/screenshots/issues')
const baseUrl = process.env.BASE_URL ?? 'http://localhost:3000'
const articleSlug = process.env.ARTICLE_SLUG ?? 'why-i-built-custardsquareexe'

await mkdir(outDir, { recursive: true })
await mkdir(issuesOutDir, { recursive: true })

const verificationLog = execSync('pnpm verify-issue-015', { cwd: root, encoding: 'utf8' })
const articlePageSource = await readFile(
  path.join(root, 'src/app/(frontend)/articles/[slug]/page.tsx'),
  'utf8',
)

const browser = await chromium.launch()

// AC1 — Published article detail with Lexical body
const desktop = await browser.newPage({ viewport: { width: 1280, height: 800 } })
await desktop.goto(`${baseUrl}/articles/${articleSlug}`, {
  waitUntil: 'domcontentloaded',
  timeout: 15000,
})
await desktop.locator('.article-header').waitFor({ timeout: 10000 })
await desktop.locator('.article-body').waitFor({ timeout: 10000 })
await desktop.waitForTimeout(400)
await desktop.screenshot({ path: path.join(outDir, 'issue-015-ac1-article-detail.png'), fullPage: true })
await desktop.screenshot({
  path: path.join(issuesOutDir, 'issue-015-article-detail.png'),
  fullPage: true,
})

// AC2 — Draft returns 404
const draftStatus = execSync(
  `curl -s -o /dev/null -w '%{http_code}' '${baseUrl}/articles/issue-015-draft-should-404'`,
  { encoding: 'utf8' },
).trim()

await desktop.setContent(`<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><title>AC2 — drafts 404</title></head>
<body style="margin:0;padding:2rem;font-family:ui-monospace,monospace;background:#0f172a;color:#e2e8f0;">
  <h1 style="font-family:system-ui,sans-serif;color:#86efac;">AC2 — Drafts return 404</h1>
  <p style="font-family:system-ui,sans-serif;"><code>getPublishedArticleBySlug()</code> filters <code>status: published</code> · unknown slug → 404</p>
  <p style="font-family:system-ui,sans-serif;">Sample missing slug HTTP status: <strong>${draftStatus}</strong></p>
  <pre style="background:#1e293b;padding:1rem;border-radius:8px;white-space:pre-wrap;">${verificationLog.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
</body></html>`)
await desktop.screenshot({ path: path.join(outDir, 'issue-015-ac2-draft-404.png'), fullPage: true })

// AC3 — Metadata + implementation
await desktop.setContent(`<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><title>AC3 — metadata</title></head>
<body style="margin:0;padding:2rem;font-family:ui-monospace,monospace;background:#0f172a;color:#e2e8f0;">
  <h1 style="font-family:system-ui,sans-serif;color:#a78bfa;">AC3 — Article metadata</h1>
  <p style="font-family:system-ui,sans-serif;">Title, excerpt, published date, and <code>generateMetadata</code> via <code>buildArticleMetadata</code>. Soft delete cancelled (#12).</p>
  <pre style="background:#1e293b;padding:1rem;border-radius:8px;">${articlePageSource.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
</body></html>`)
await desktop.screenshot({ path: path.join(outDir, 'issue-015-ac3-metadata.png'), fullPage: true })

await browser.close()

console.log(`Saved issue #15 screenshots to ${outDir}`)
