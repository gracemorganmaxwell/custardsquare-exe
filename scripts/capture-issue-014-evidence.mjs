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

await mkdir(outDir, { recursive: true })
await mkdir(issuesOutDir, { recursive: true })

const verificationLog = execSync('pnpm verify-issue-014', { cwd: root, encoding: 'utf8' })
const articlesPageSource = await readFile(
  path.join(root, 'src/app/(frontend)/articles/page.tsx'),
  'utf8',
)

const browser = await chromium.launch()

// AC1 — Desktop articles index
const desktop = await browser.newPage({ viewport: { width: 1280, height: 800 } })
await desktop.goto(`${baseUrl}/articles`, { waitUntil: 'domcontentloaded', timeout: 15000 })
await desktop.locator('.article-list-header').waitFor({ timeout: 10000 })
await desktop.waitForTimeout(400)
await desktop.screenshot({ path: path.join(outDir, 'issue-014-ac1-articles-index.png'), fullPage: true })
await desktop.screenshot({
  path: path.join(issuesOutDir, 'issue-014-articles-index.png'),
  fullPage: true,
})

// AC2 — Draft exclusion evidence
await desktop.setContent(`<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><title>AC2 — drafts excluded</title></head>
<body style="margin:0;padding:2rem;font-family:ui-monospace,monospace;background:#0f172a;color:#e2e8f0;">
  <h1 style="font-family:system-ui,sans-serif;color:#86efac;">AC2 — Draft and soft-deleted excluded</h1>
  <p style="font-family:system-ui,sans-serif;"><code>getPublishedArticles()</code> filters <code>status: published</code>. Soft delete cancelled (#12).</p>
  <pre style="background:#1e293b;padding:1rem;border-radius:8px;white-space:pre-wrap;">${verificationLog.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
</body></html>`)
await desktop.screenshot({ path: path.join(outDir, 'issue-014-ac2-drafts-excluded.png'), fullPage: true })

// AC3 — Mobile viewport
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } })
await mobile.goto(`${baseUrl}/articles`, { waitUntil: 'domcontentloaded', timeout: 15000 })
await mobile.locator('.article-list-header').waitFor({ timeout: 10000 })
await mobile.waitForTimeout(400)

const scrollWidth = await mobile.evaluate(() => document.documentElement.scrollWidth)
const clientWidth = await mobile.evaluate(() => document.documentElement.clientWidth)
const noHorizontalOverflow = scrollWidth <= clientWidth + 1

await mobile.screenshot({ path: path.join(outDir, 'issue-014-ac3-mobile.png'), fullPage: true })

await mobile.setContent(`<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><title>AC3 — mobile layout</title></head>
<body style="margin:0;padding:2rem;font-family:ui-monospace,monospace;background:#0f172a;color:#e2e8f0;">
  <h1 style="font-family:system-ui,sans-serif;color:#a78bfa;">AC3 — Page works on mobile</h1>
  <p style="font-family:system-ui,sans-serif;">Viewport 390×844 · horizontal overflow: ${noHorizontalOverflow ? 'none' : 'detected'}</p>
  <pre style="background:#1e293b;padding:1rem;border-radius:8px;">${articlesPageSource.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
</body></html>`)
await mobile.screenshot({ path: path.join(outDir, 'issue-014-ac3-mobile-check.png'), fullPage: true })

await browser.close()

if (!noHorizontalOverflow) {
  console.error('WARN: horizontal overflow detected on mobile viewport')
}

console.log(`Saved issue #14 screenshots to ${outDir}`)
