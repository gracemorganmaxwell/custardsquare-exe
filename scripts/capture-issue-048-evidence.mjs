import { chromium } from '@playwright/test'
import { execSync } from 'node:child_process'
import { readFile } from 'node:fs/promises'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const outDir = path.resolve(root, 'docs/screenshots/foundation')
const productionUrl = 'https://custardsq.app'

await mkdir(outDir, { recursive: true })

const verificationLog = execSync('pnpm verify-issue-048', { cwd: root, encoding: 'utf8' })
const envExample = await readFile(path.join(root, '.env.example'), 'utf8')
const siteUrlSource = await readFile(path.join(root, 'src/lib/site-url.ts'), 'utf8')

const browser = await chromium.launch()
const desktop = await browser.newPage({ viewport: { width: 1280, height: 800 } })

await desktop.goto(productionUrl, { waitUntil: 'domcontentloaded', timeout: 20000 })
await desktop.locator('.boot-screen, .login-screen__window').first().waitFor({ timeout: 20000 })
await desktop.waitForTimeout(800)
await desktop.screenshot({ path: path.join(outDir, 'issue-048-ac1-domain-homepage.png'), fullPage: true })

const tlsInfo = execSync(`curl -sI '${productionUrl}/' | head -8`, { encoding: 'utf8' })

await desktop.setContent(`<!DOCTYPE html>
<html lang="en"><body style="margin:0;padding:2rem;font-family:ui-monospace,monospace;background:#0f172a;color:#e2e8f0;">
<h1 style="font-family:system-ui,sans-serif;color:#86efac;">AC2 — HTTPS headers</h1>
<pre style="background:#1e293b;padding:1rem;border-radius:8px;white-space:pre-wrap;">${tlsInfo.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
<pre style="background:#1e293b;padding:1rem;border-radius:8px;margin-top:1rem;white-space:pre-wrap;">${verificationLog.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
</body></html>`)
await desktop.screenshot({ path: path.join(outDir, 'issue-048-ac2-https.png'), fullPage: true })

await desktop.setContent(`<!DOCTYPE html>
<html lang="en"><body style="margin:0;padding:2rem;font-family:ui-monospace,monospace;background:#0f172a;color:#e2e8f0;">
<h1 style="font-family:system-ui,sans-serif;color:#a78bfa;">AC3 — NEXT_PUBLIC_SITE_URL</h1>
<pre style="background:#1e293b;padding:1rem;border-radius:8px;">${envExample.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
<pre style="background:#1e293b;padding:1rem;border-radius:8px;margin-top:1rem;">${siteUrlSource.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
</body></html>`)
await desktop.screenshot({ path: path.join(outDir, 'issue-048-ac3-site-url.png'), fullPage: true })

await browser.close()
console.log(`Saved issue #48 screenshots to ${outDir}`)
