/**
 * Capture visual evidence for issues #033, #035, #037, #038, #059, #063.
 * Usage: node --import tsx/esm scripts/capture-issue-033-059-evidence.mjs
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

async function openFromStart(name) {
  await click(page.locator('.taskbar__start'))
  await page.locator('.start-menu').waitFor({ state: 'visible', timeout: 8000 })
  await click(page.getByRole('menuitem', { name }))
}

await page.goto(baseUrl, { waitUntil: 'domcontentloaded', timeout: 20000 })
await page.getByRole('button', { name: 'Start' }).waitFor({ timeout: 15000 })
await dismissDevOverlay()
await click(page.getByRole('button', { name: 'Start' }))
await page.locator('.desktop-shell').waitFor({ timeout: 10000 })
await dismissDevOverlay()

// #063 — single click selects, double click opens
const skillsIcon = page.getByRole('button', { name: 'Skills' })
await click(skillsIcon)
await page.waitForTimeout(200)
await page.screenshot({
  path: path.join(outDir, 'issue-063-ac1-single-click-select.png'),
  fullPage: true,
})
await skillsIcon.dblclick()
await page.locator('.skills-window').waitFor({ state: 'visible', timeout: 8000 })
await page.waitForTimeout(200)
await page.screenshot({
  path: path.join(outDir, 'issue-033-ac1-skills-window.png'),
  fullPage: true,
})
await page.screenshot({
  path: path.join(outDir, 'issue-063-ac2-double-click-open.png'),
  fullPage: true,
})

await openFromStart('Credits')
await page.locator('.credits-window').waitFor({ state: 'visible', timeout: 8000 })
await page.waitForTimeout(200)
await page.screenshot({
  path: path.join(outDir, 'issue-035-ac1-credits-window.png'),
  fullPage: true,
})

await openFromStart('Terminal')
await page.locator('.terminal-window').waitFor({ state: 'visible', timeout: 8000 })
await page.locator('#terminal-input').fill('help')
await page.locator('#terminal-input').press('Enter')
await page.waitForTimeout(200)
await page.screenshot({
  path: path.join(outDir, 'issue-037-ac1-terminal-help.png'),
  fullPage: true,
})
await page.locator('#terminal-input').fill('open articles')
await page.locator('#terminal-input').press('Enter')
await page.locator('.articles-window').waitFor({ state: 'visible', timeout: 8000 })
await page.waitForTimeout(200)
await page.screenshot({
  path: path.join(outDir, 'issue-037-ac2-open-articles.png'),
  fullPage: true,
})

const notesIcon = page.getByRole('button', { name: 'Notes' })
await notesIcon.dblclick()
await page.locator('.coming-soon-window').waitFor({ state: 'visible', timeout: 8000 })
await page.waitForTimeout(200)
await page.screenshot({
  path: path.join(outDir, 'issue-038-ac1-notes-placeholder.png'),
  fullPage: true,
})

await openFromStart('Shut Down…')
await page.locator('.shutdown-dialog').waitFor({ state: 'visible', timeout: 8000 })
await page.waitForTimeout(200)
await page.screenshot({
  path: path.join(outDir, 'issue-059-ac1-shutdown-os-identity.png'),
  fullPage: true,
})

await page.goto(`${baseUrl}/credits`, { waitUntil: 'domcontentloaded', timeout: 20000 })
await page.getByRole('heading', { name: 'Credits' }).waitFor({ timeout: 10000 })
await page.screenshot({
  path: path.join(outDir, 'issue-035-ac2-credits-page.png'),
  fullPage: true,
})

await browser.close()
console.log(`Saved #033/#035/#037/#038/#059/#063 evidence to ${outDir}`)
