import { chromium } from '@playwright/test'
import { readFile } from 'node:fs/promises'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { execSync } from 'node:child_process'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const outDir = path.resolve(root, 'docs/screenshots/foundation')
const baseUrl = process.env.BASE_URL ?? 'http://localhost:3000'

await mkdir(outDir, { recursive: true })

const tscResult = execSync('pnpm exec tsc --noEmit', { cwd: root, encoding: 'utf8' })
const tsconfig = await readFile(path.join(root, 'tsconfig.json'), 'utf8')

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })

// AC1 — pnpm dev (homepage loads from local dev server)
await page.goto(baseUrl, { waitUntil: 'networkidle' })
await page.getByRole('button', { name: 'Start' }).waitFor({ timeout: 15000 })
await page.screenshot({ path: path.join(outDir, 'issue-001-ac1-pnpm-dev.png'), fullPage: true })

// AC2 — TypeScript strict mode
await page.setContent(`<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><title>AC2 — TypeScript strict</title></head>
<body style="margin:0;padding:2rem;font-family:ui-monospace,monospace;background:#1e1e1e;color:#d4d4d4;">
  <h1 style="color:#9cdcfe;font-family:system-ui,sans-serif;">AC2 — TypeScript strict mode enabled</h1>
  <p style="font-family:system-ui,sans-serif;color:#4ec9b0;">pnpm exec tsc --noEmit → exit 0 (no errors)</p>
  <pre style="background:#252526;padding:1rem;border-radius:8px;overflow:auto;">${tsconfig.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
</body></html>`)
await page.screenshot({ path: path.join(outDir, 'issue-001-ac2-typescript-strict.png'), fullPage: true })

// AC3 — Payload admin route at /admin
await page.goto(`${baseUrl}/admin`, { waitUntil: 'networkidle' })
await page.waitForTimeout(600)
await page.screenshot({ path: path.join(outDir, 'issue-001-ac3-admin-route.png'), fullPage: true })

// AC4 — Basic homepage renders (desktop after Start)
await page.goto(baseUrl, { waitUntil: 'networkidle' })
await page.getByRole('button', { name: 'Start' }).click()
await page.locator('.desktop-shell').waitFor({ timeout: 10000 })
await page.waitForTimeout(400)
await page.screenshot({ path: path.join(outDir, 'issue-001-ac4-homepage.png'), fullPage: true })

await browser.close()

if (tscResult.trim()) {
  console.log(tscResult)
}

console.log(`Saved 4 acceptance-criteria screenshots to ${outDir}`)
