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

const verificationLog = execSync('pnpm verify-issue-021', { cwd: root, encoding: 'utf8' })
const win95Source = await readFile(path.join(root, 'src/styles/win95.css'), 'utf8')

const browser = await chromium.launch()
const desktop = await browser.newPage({ viewport: { width: 1280, height: 800 } })

await desktop.goto(baseUrl, { waitUntil: 'domcontentloaded', timeout: 15000 })
await desktop.getByRole('button', { name: 'Start' }).waitFor({ timeout: 15000 })
await desktop.locator('.login-screen__window').screenshot({
  path: path.join(outDir, 'issue-021-ac2-bevel-utilities.png'),
})
await desktop.locator('.login-screen__window').screenshot({
  path: path.join(issuesOutDir, 'issue-021-design-tokens.png'),
})

await desktop.setContent(`<!DOCTYPE html>
<html lang="en"><body style="margin:0;padding:2rem;font-family:ui-monospace,monospace;background:#0f172a;color:#e2e8f0;">
<h1 style="font-family:system-ui,sans-serif;color:#86efac;">AC1 — CSS variables</h1>
<pre style="background:#1e293b;padding:1rem;border-radius:8px;max-height:420px;overflow:auto;">${win95Source.slice(0, 2200).replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
<pre style="background:#1e293b;padding:1rem;border-radius:8px;white-space:pre-wrap;margin-top:1rem;">${verificationLog.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
</body></html>`)
await desktop.screenshot({ path: path.join(outDir, 'issue-021-ac1-tokens.png'), fullPage: true })

await browser.close()
console.log(`Saved issue #21 screenshots to ${outDir}`)
