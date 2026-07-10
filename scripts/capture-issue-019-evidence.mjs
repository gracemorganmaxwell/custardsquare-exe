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

await mkdir(outDir, { recursive: true })

const verificationLog = execSync('pnpm verify-issue-019', { cwd: root, encoding: 'utf8' })
const sitemapXml = execSync(`curl -s '${baseUrl}/sitemap.xml'`, { encoding: 'utf8' })
const robotsTxt = execSync(`curl -s '${baseUrl}/robots.txt'`, { encoding: 'utf8' })
const sitemapSource = await readFile(path.join(root, 'src/app/(frontend)/sitemap.ts'), 'utf8')
const robotsSource = await readFile(path.join(root, 'src/app/robots.ts'), 'utf8')

const browser = await chromium.launch()
const desktop = await browser.newPage({ viewport: { width: 1280, height: 800 } })

await desktop.setContent(`<!DOCTYPE html>
<html lang="en"><body style="margin:0;padding:2rem;font-family:ui-monospace,monospace;background:#0f172a;color:#e2e8f0;">
<h1 style="font-family:system-ui,sans-serif;color:#86efac;">AC1 — sitemap.xml</h1>
<pre style="background:#1e293b;padding:1rem;border-radius:8px;white-space:pre-wrap;max-height:320px;overflow:auto;">${sitemapXml.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
<pre style="background:#1e293b;padding:1rem;border-radius:8px;margin-top:1rem;">${sitemapSource.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
</body></html>`)
await desktop.screenshot({ path: path.join(outDir, 'issue-019-ac1-sitemap.png'), fullPage: true })

await desktop.setContent(`<!DOCTYPE html>
<html lang="en"><body style="margin:0;padding:2rem;font-family:ui-monospace,monospace;background:#0f172a;color:#e2e8f0;">
<h1 style="font-family:system-ui,sans-serif;color:#a78bfa;">AC2 — drafts excluded</h1>
<pre style="background:#1e293b;padding:1rem;border-radius:8px;white-space:pre-wrap;">${verificationLog.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
</body></html>`)
await desktop.screenshot({ path: path.join(outDir, 'issue-019-ac2-drafts-excluded.png'), fullPage: true })

await desktop.setContent(`<!DOCTYPE html>
<html lang="en"><body style="margin:0;padding:2rem;font-family:ui-monospace,monospace;background:#0f172a;color:#e2e8f0;">
<h1 style="font-family:system-ui,sans-serif;color:#f472b6;">AC3 — robots.txt</h1>
<pre style="background:#1e293b;padding:1rem;border-radius:8px;white-space:pre-wrap;">${robotsTxt.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
<pre style="background:#1e293b;padding:1rem;border-radius:8px;margin-top:1rem;">${robotsSource.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
</body></html>`)
await desktop.screenshot({ path: path.join(outDir, 'issue-019-ac3-robots.png'), fullPage: true })

await browser.close()
console.log(`Saved issue #19 screenshots to ${outDir}`)
