/**
 * Capture visual evidence for issue #34 (Resume window).
 * Usage: node --import tsx/esm scripts/capture-issue-034-evidence.mjs
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
await click(page.getByRole('menuitem', { name: 'Resume' }))
await page.locator('.resume-window').waitFor({ state: 'visible', timeout: 8000 })
await page.locator('.resume-window__body').waitFor({ state: 'visible', timeout: 5000 })
await page.waitForTimeout(400)

await page.screenshot({
  path: path.join(outDir, 'issue-034-ac1-resume-text.png'),
  fullPage: true,
})

const download = page.locator('.resume-window__download')
await download.waitFor({ state: 'visible', timeout: 5000 })
const href = await download.getAttribute('href')
if (!href || (!href.includes('resume') && !href.includes('.pdf'))) {
  throw new Error(`Unexpected resume PDF href: ${href}`)
}

await page.screenshot({
  path: path.join(outDir, 'issue-034-ac2-pdf-download.png'),
  fullPage: true,
})

await browser.close()
console.log(`Saved #34 evidence to ${outDir}`)
