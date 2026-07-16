/**
 * Capture visual evidence for issues #039 / #040 (mobile shell).
 * Usage: node --import tsx/esm scripts/capture-issue-039-040-evidence.mjs
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
  viewport: { width: 390, height: 844 },
  reducedMotion: 'reduce',
  isMobile: true,
  hasTouch: true,
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
await dismissDevOverlay()

await page.locator('.desktop-icon-grid--mobile').waitFor({ state: 'visible', timeout: 8000 })
await page.locator('.welcome-window').waitFor({ state: 'hidden', timeout: 8000 }).catch(() => {})
await page.waitForTimeout(400)
await page.screenshot({
  path: path.join(outDir, 'issue-039-ac1-mobile-app-grid.png'),
  fullPage: true,
})

await click(page.getByRole('button', { name: 'Skills' }))
await page.locator('.win-window--mobile-panel .skills-window').waitFor({ state: 'visible', timeout: 8000 })
await page.waitForTimeout(300)
await page.screenshot({
  path: path.join(outDir, 'issue-039-ac2-tap-opens-fullscreen.png'),
  fullPage: true,
})
await page.screenshot({
  path: path.join(outDir, 'issue-040-ac1-fullscreen-panel-close.png'),
  fullPage: true,
})

const skillsPanel = page.locator('.win-window--mobile-panel').filter({ has: page.locator('.skills-window') })
await click(skillsPanel.getByRole('button', { name: 'Close' }))
await skillsPanel.waitFor({ state: 'hidden', timeout: 8000 })
await page.locator('.desktop-icon-grid--mobile').waitFor({ state: 'visible', timeout: 5000 })
await page.waitForTimeout(200)
await page.screenshot({
  path: path.join(outDir, 'issue-040-ac2-close-returns-to-grid.png'),
  fullPage: true,
})

await browser.close()
console.log(`Saved #039/#040 evidence to ${outDir}`)
