/**
 * Capture visual evidence for issues #26–#30 (desktop shell chrome).
 * Usage: node --import tsx/esm scripts/capture-issue-026-030-evidence.mjs
 */
import { chromium } from '@playwright/test'
import { mkdir } from 'node:fs/promises'
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

async function click(locator) {
  await locator.evaluate((el) => {
    if (el instanceof HTMLElement) {
      el.click()
    }
  })
}

async function dismissDevOverlay() {
  await page.evaluate(() => {
    document.querySelectorAll('nextjs-portal').forEach((node) => node.remove())
  })
}

await page.goto(baseUrl, { waitUntil: 'domcontentloaded', timeout: 20000 })
await page.getByRole('button', { name: 'Start' }).waitFor({ timeout: 15000 })
await dismissDevOverlay()
await click(page.getByRole('button', { name: 'Start' }))
await page.locator('.desktop-shell').waitFor({ timeout: 10000 })
await page.locator('.welcome-window, .win-window').waitFor({ timeout: 10000 })
await dismissDevOverlay()
await page.waitForTimeout(400)

// #26 — open windows + focus tracked (welcome open, taskbar present)
await page.screenshot({
  path: path.join(outDir, 'issue-026-ac1-ac2-open-focus.png'),
  fullPage: true,
})

// #27 — open/close + active titlebar
await page.screenshot({
  path: path.join(outDir, 'issue-027-ac1-open-window.png'),
  fullPage: true,
})
await page.screenshot({
  path: path.join(outDir, 'issue-027-ac2-active-titlebar.png'),
  fullPage: true,
})

const titlebar = page.locator('.welcome-window .win95-titlebar, .win-window .win95-titlebar').first()
const box = await titlebar.boundingBox()
if (!box) {
  throw new Error('Window titlebar not found')
}
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
await page.mouse.down()
await page.mouse.move(box.x + 160, box.y + 100, { steps: 10 })
await page.mouse.up()
await page.waitForTimeout(250)
await page.screenshot({
  path: path.join(outDir, 'issue-027-ac3-draggable-window.png'),
  fullPage: true,
})

// #28 — taskbar + clock
await page.locator('.taskbar').waitFor({ timeout: 5000 })
await page.locator('.taskbar__clock').waitFor({ timeout: 5000 })
await page.screenshot({
  path: path.join(outDir, 'issue-028-ac1-ac2-taskbar-clock.png'),
  fullPage: true,
})

await click(page.getByRole('button', { name: 'Minimize' }).first())
await page.waitForTimeout(200)
await click(page.locator('.taskbar__window-button').first())
await page.waitForTimeout(250)
await page.screenshot({
  path: path.join(outDir, 'issue-028-ac3-taskbar-restore.png'),
  fullPage: true,
})

// #29 — start menu
await dismissDevOverlay()
await click(page.locator('.taskbar__start'))
await page.locator('.start-menu').waitFor({ state: 'visible', timeout: 8000 })
await page.screenshot({
  path: path.join(outDir, 'issue-029-ac1-ac2-start-menu.png'),
  fullPage: true,
})

// #30 — shutdown dialog
await click(page.getByRole('menuitem', { name: /Shut Down/i }))
await page.locator('.shutdown-dialog').waitFor({ state: 'visible', timeout: 8000 })
await page.screenshot({
  path: path.join(outDir, 'issue-030-ac2-shutdown-dialog.png'),
  fullPage: true,
})

await click(page.getByRole('button', { name: 'Cancel' }))
await page.waitForTimeout(200)

await dismissDevOverlay()
await click(page.locator('.taskbar__start'))
await page.locator('.start-menu').waitFor({ state: 'visible', timeout: 8000 })
await click(page.getByRole('menuitem', { name: /Shut Down/i }))
await page.locator('.shutdown-dialog').waitFor({ state: 'visible', timeout: 8000 })
await click(page.getByRole('button', { name: 'Log Off' }))
await page.waitForTimeout(400)
await page.getByRole('button', { name: 'Start' }).waitFor({ timeout: 10000 })
await page.screenshot({
  path: path.join(outDir, 'issue-030-ac1-log-off-login.png'),
  fullPage: true,
})

await browser.close()
console.log(`Saved #26–#30 evidence to ${outDir}`)
