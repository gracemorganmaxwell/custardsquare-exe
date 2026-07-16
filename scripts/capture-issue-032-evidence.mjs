/**
 * Capture visual evidence for issue #32 (About window).
 * Usage: node --import tsx/esm scripts/capture-issue-032-evidence.mjs
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
await dismissDevOverlay()

await click(page.locator('.taskbar__start'))
await page.locator('.start-menu').waitFor({ state: 'visible', timeout: 8000 })
await click(page.getByRole('menuitem', { name: 'About' }))
await page.locator('.about-window').waitFor({ state: 'visible', timeout: 8000 })
await page.locator('.about-window__portrait').waitFor({ state: 'visible', timeout: 5000 })
await page.waitForTimeout(400)

await page.screenshot({
  path: path.join(outDir, 'issue-032-ac1-about-text.png'),
  fullPage: true,
})

const linkedIn = page.locator('.about-window a[href*="linkedin.com"]')
await linkedIn.waitFor({ state: 'visible', timeout: 5000 })
await page.screenshot({
  path: path.join(outDir, 'issue-032-ac2-linkedin-link.png'),
  fullPage: true,
})

await browser.close()
console.log(`Saved #32 evidence to ${outDir}`)
