/**
 * Capture visual evidence for issue #51 (Projects collection + window).
 * Usage: node --import tsx/esm scripts/capture-issue-051-evidence.mjs
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
await click(page.getByRole('menuitem', { name: 'Projects' }))
await page.locator('.projects-window').waitFor({ state: 'visible', timeout: 8000 })
await page.waitForTimeout(300)
await dismissDevOverlay()

await page.screenshot({
  path: path.join(outDir, 'issue-051-ac1-projects-list.png'),
  fullPage: true,
})

const rows = page.locator('.projects-window__row')
const rowCount = await rows.count()
if (rowCount < 2) {
  throw new Error(`Expected at least 2 project rows, found ${rowCount}`)
}

await click(rows.nth(1))
await page.waitForTimeout(200)
await dismissDevOverlay()

await page.screenshot({
  path: path.join(outDir, 'issue-051-ac2-project-story.png'),
  fullPage: true,
})

await browser.close()
console.log(`Saved #51 evidence to ${outDir}`)
