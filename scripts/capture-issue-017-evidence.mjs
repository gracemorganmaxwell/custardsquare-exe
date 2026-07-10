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
const articleSlug = process.env.ARTICLE_SLUG ?? 'why-i-built-custardsquareexe'

await mkdir(outDir, { recursive: true })

const verificationLog = execSync('pnpm verify-issue-017', { cwd: root, encoding: 'utf8' })
const seoSource = await readFile(path.join(root, 'src/lib/seo.ts'), 'utf8')

const browser = await chromium.launch()
const desktop = await browser.newPage({ viewport: { width: 1280, height: 800 } })

await desktop.goto(`${baseUrl}/articles/${articleSlug}`, {
  waitUntil: 'domcontentloaded',
  timeout: 15000,
})
await desktop.waitForTimeout(500)

const title = await desktop.title()
const canonical = await desktop.locator('link[rel="canonical"]').getAttribute('href')
const description = await desktop.locator('meta[name="description"]').getAttribute('content')

await desktop.setContent(`<!DOCTYPE html>
<html lang="en"><body style="margin:0;padding:2rem;font-family:ui-monospace,monospace;background:#0f172a;color:#e2e8f0;">
<h1 style="font-family:system-ui,sans-serif;color:#86efac;">AC1 — title + description</h1>
<p style="font-family:system-ui,sans-serif;">document.title: <strong>${title?.replace(/</g, '&lt;') ?? ''}</strong></p>
<p style="font-family:system-ui,sans-serif;">meta description: <strong>${description?.replace(/</g, '&lt;') ?? ''}</strong></p>
<h1 style="font-family:system-ui,sans-serif;color:#a78bfa;margin-top:2rem;">AC3 — canonical URL</h1>
<p style="font-family:system-ui,sans-serif;">link[rel=canonical]: <strong>${canonical?.replace(/</g, '&lt;') ?? ''}</strong></p>
<pre style="background:#1e293b;padding:1rem;border-radius:8px;white-space:pre-wrap;margin-top:1rem;">${verificationLog.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
</body></html>`)
await desktop.screenshot({ path: path.join(outDir, 'issue-017-ac1-metadata.png'), fullPage: true })

await desktop.setContent(`<!DOCTYPE html>
<html lang="en"><body style="margin:0;padding:2rem;font-family:ui-monospace,monospace;background:#0f172a;color:#e2e8f0;">
<h1 style="font-family:system-ui,sans-serif;color:#f472b6;">AC2 — Open Graph + Twitter helpers</h1>
<pre style="background:#1e293b;padding:1rem;border-radius:8px;">${seoSource.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
</body></html>`)
await desktop.screenshot({ path: path.join(outDir, 'issue-017-ac2-og-twitter.png'), fullPage: true })

await desktop.goto(`${baseUrl}/articles/${articleSlug}`, {
  waitUntil: 'domcontentloaded',
  timeout: 15000,
})
await desktop.screenshot({ path: path.join(outDir, 'issue-017-ac3-article-page.png'), fullPage: false })

await browser.close()
console.log(`Saved issue #17 screenshots to ${outDir}`)
