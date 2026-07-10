/**
 * Capture visual evidence for issues #24, #27 (partial), #58.
 * Usage: node --import tsx/esm scripts/capture-issue-024-027-058-evidence.mjs
 */
import { chromium } from '@playwright/test'
import { mkdir } from 'node:fs/promises'
import { execFileSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const outDir = path.resolve(root, 'docs/screenshots/foundation')
const baseUrl = process.env.BASE_URL ?? 'http://localhost:3000'

await mkdir(outDir, { recursive: true })

const browser = await chromium.launch()
const page = await browser.newPage({
  viewport: { width: 1280, height: 800 },
  reducedMotion: 'reduce',
})

await page.goto(baseUrl, { waitUntil: 'domcontentloaded', timeout: 20000 })
await page.getByRole('button', { name: 'Start' }).waitFor({ timeout: 15000 })
await page.getByRole('button', { name: 'Start' }).click()
await page.locator('.desktop-shell').waitFor({ timeout: 10000 })
await page.locator('.welcome-window, .win-window').waitFor({ timeout: 10000 })
await page.waitForTimeout(500)

// #24 — Desktop shell + wallpaper
await page.screenshot({
  path: path.join(outDir, 'issue-024-ac1-desktop-shell.png'),
  fullPage: true,
})
await page.screenshot({
  path: path.join(outDir, 'issue-024-ac2-icons-windows-area.png'),
  fullPage: true,
})

// #58 — Brand wallpaper flag visible
await page.locator('.desktop-shell__wallpaper-flag').waitFor({ timeout: 5000 })
await page.screenshot({
  path: path.join(outDir, 'issue-058-ac2-wallpaper-flag.png'),
  fullPage: true,
})

// #27 — Draggable WinWindow: drag titlebar then screenshot
const titlebar = page.locator('.welcome-window .win95-titlebar')
const box = await titlebar.boundingBox()
if (!box) {
  throw new Error('Welcome window titlebar not found')
}
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
await page.mouse.down()
await page.mouse.move(box.x + 180, box.y + 120, { steps: 12 })
await page.mouse.up()
await page.waitForTimeout(300)
await page.screenshot({
  path: path.join(outDir, 'issue-027-ac3-draggable-window.png'),
  fullPage: true,
})
await page.screenshot({
  path: path.join(outDir, 'issue-027-ac2-active-titlebar.png'),
  fullPage: true,
})

// #58 — Favicon HTML evidence pages
const frontendIcons = execFileSync(
  'curl',
  ['-s', baseUrl],
  { encoding: 'utf8' },
)
const adminIcons = execFileSync(
  'curl',
  ['-s', `${baseUrl}/admin/login`],
  { encoding: 'utf8' },
)
const frontendHasIco = frontendIcons.includes('/favicon.ico')
const adminHasIco = adminIcons.includes('/admin-favicon.ico')

await page.setContent(`<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><title>AC1/AC3 — favicons</title></head>
<body style="margin:0;padding:2rem;font-family:ui-monospace,monospace;background:#0f172a;color:#e2e8f0;">
  <h1 style="font-family:system-ui,sans-serif;color:#86efac;">#58 — Favicons</h1>
  <p style="font-family:system-ui,sans-serif;">Frontend <code>/favicon.ico</code>: <strong>${frontendHasIco ? 'yes' : 'no'}</strong></p>
  <p style="font-family:system-ui,sans-serif;">Admin <code>/admin-favicon.ico</code>: <strong>${adminHasIco ? 'yes' : 'no'}</strong></p>
  <div style="display:flex;gap:2rem;margin-top:1.5rem;align-items:center;">
    <figure style="margin:0;text-align:center;">
      <img src="${baseUrl}/favicon.ico" width="32" height="32" alt="frontend favicon" style="image-rendering:pixelated;background:#111;padding:8px;border-radius:8px;" />
      <figcaption style="margin-top:0.5rem;">frontend</figcaption>
    </figure>
    <figure style="margin:0;text-align:center;">
      <img src="${baseUrl}/admin-favicon.ico" width="32" height="32" alt="cms favicon" style="image-rendering:pixelated;background:#111;padding:8px;border-radius:8px;" />
      <figcaption style="margin-top:0.5rem;">cms /admin</figcaption>
    </figure>
    <figure style="margin:0;text-align:center;">
      <img src="${baseUrl}/brand/desktop-background.png" width="100" height="100" alt="wallpaper flag" style="image-rendering:pixelated;background:#2a1f4e;padding:8px;border-radius:8px;" />
      <figcaption style="margin-top:0.5rem;">wallpaper flag</figcaption>
    </figure>
  </div>
</body></html>`)
await page.waitForTimeout(400)
await page.screenshot({
  path: path.join(outDir, 'issue-058-ac1-ac3-favicons.png'),
  fullPage: true,
})

await browser.close()

if (!frontendHasIco || !adminHasIco) {
  console.error('FAIL: favicon links missing from HTML')
  process.exit(1)
}

console.log(`Saved #24 / #27 / #58 evidence to ${outDir}`)
