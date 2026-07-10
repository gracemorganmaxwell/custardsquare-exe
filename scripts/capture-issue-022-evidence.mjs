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

const verificationLog = execSync('pnpm verify-issue-022', { cwd: root, encoding: 'utf8' })
const bootSource = await readFile(path.join(root, 'src/components/desktop/BootScreen.tsx'), 'utf8')

const browser = await chromium.launch()
const desktop = await browser.newPage({ viewport: { width: 1280, height: 800 } })

await desktop.goto(baseUrl, { waitUntil: 'domcontentloaded', timeout: 15000 })
await desktop.locator('.boot-screen').waitFor({ timeout: 10000 })
await desktop.waitForTimeout(700)
await desktop.screenshot({ path: path.join(outDir, 'issue-022-ac1-boot-screen.png'), fullPage: true })
await desktop.screenshot({
  path: path.join(issuesOutDir, 'issue-022-boot-screen.png'),
  fullPage: true,
})

await desktop.goto(baseUrl, { waitUntil: 'domcontentloaded', timeout: 15000 })
await desktop.getByRole('button', { name: 'Start' }).waitFor({ timeout: 15000 })
await desktop.screenshot({ path: path.join(outDir, 'issue-022-ac2-login-after-boot.png'), fullPage: true })

const reducedMotion = await browser.newPage({
  viewport: { width: 1280, height: 800 },
})
await reducedMotion.emulateMedia({ reducedMotion: 'reduce' })
await reducedMotion.goto(baseUrl, { waitUntil: 'domcontentloaded', timeout: 15000 })
await reducedMotion.getByRole('button', { name: 'Start' }).waitFor({ timeout: 15000 })
await reducedMotion.screenshot({
  path: path.join(outDir, 'issue-022-ac3-reduced-motion.png'),
  fullPage: true,
})

await desktop.setContent(`<!DOCTYPE html>
<html lang="en"><body style="margin:0;padding:2rem;font-family:ui-monospace,monospace;background:#0f172a;color:#e2e8f0;">
<h1 style="font-family:system-ui,sans-serif;color:#a78bfa;">AC3 — prefers-reduced-motion branch</h1>
<pre style="background:#1e293b;padding:1rem;border-radius:8px;">${bootSource.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
<pre style="background:#1e293b;padding:1rem;border-radius:8px;margin-top:1rem;white-space:pre-wrap;">${verificationLog.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
</body></html>`)
await desktop.screenshot({ path: path.join(outDir, 'issue-022-ac3-reduced-motion-code.png'), fullPage: true })

await browser.close()
console.log(`Saved issue #22 screenshots to ${outDir}`)
