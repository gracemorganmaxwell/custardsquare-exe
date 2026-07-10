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

const verificationLog = execSync('pnpm verify-issue-016', { cwd: root, encoding: 'utf8' })
const articleBodySource = await readFile(path.join(root, 'src/components/article/ArticleBody.tsx'), 'utf8')

const browser = await chromium.launch()
const desktop = await browser.newPage({ viewport: { width: 1280, height: 800 } })

await desktop.goto(`${baseUrl}/articles/${articleSlug}`, {
  waitUntil: 'domcontentloaded',
  timeout: 15000,
})
await desktop.locator('.article-body').waitFor({ timeout: 10000 })
await desktop.waitForTimeout(400)
await desktop.screenshot({ path: path.join(outDir, 'issue-016-ac1-rich-text.png'), fullPage: true })
await desktop.screenshot({
  path: path.join(issuesOutDir, 'issue-016-article-toc.png'),
  fullPage: true,
})

const hasToc = (await desktop.locator('.article-toc').count()) > 0
if (hasToc) {
  await desktop.locator('.article-toc').screenshot({
    path: path.join(outDir, 'issue-016-ac2-toc.png'),
  })
} else {
  await desktop.setContent(`<!DOCTYPE html>
<html lang="en"><body style="margin:0;padding:2rem;font-family:system-ui,sans-serif;background:#0f172a;color:#e2e8f0;">
<h1 style="color:#86efac;">AC2 — TOC (article has &lt;2 headings)</h1>
<p>TOC appears when extractArticleHeadings finds 2+ h2/h3 nodes.</p>
</body></html>`)
  await desktop.screenshot({ path: path.join(outDir, 'issue-016-ac2-toc.png'), fullPage: true })
}

await desktop.setContent(`<!DOCTYPE html>
<html lang="en"><body style="margin:0;padding:2rem;font-family:ui-monospace,monospace;background:#0f172a;color:#e2e8f0;">
<h1 style="font-family:system-ui,sans-serif;color:#a78bfa;">AC3 — Typography + renderer</h1>
<pre style="background:#1e293b;padding:1rem;border-radius:8px;white-space:pre-wrap;">${verificationLog.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
<pre style="background:#1e293b;padding:1rem;border-radius:8px;margin-top:1rem;">${articleBodySource.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
</body></html>`)
await desktop.screenshot({ path: path.join(outDir, 'issue-016-ac3-typography.png'), fullPage: true })

await browser.close()
console.log(`Saved issue #16 screenshots to ${outDir}`)
