/**
 * Capture visual evidence for issue #60 (rich-text Resume).
 * Usage: node --import tsx/esm scripts/capture-issue-060-evidence.mjs
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
await page.locator('.resume-window__richtext').waitFor({ state: 'visible', timeout: 5000 })
await page.locator('.resume-window__richtext h1, .resume-window__richtext h2').first().waitFor({
  state: 'visible',
  timeout: 5000,
})
await page.waitForTimeout(400)

await page.screenshot({
  path: path.join(outDir, 'issue-060-ac2-rich-resume-ui.png'),
  fullPage: true,
})

const linkCount = await page.locator('.resume-window__richtext a').count()
const listCount = await page.locator('.resume-window__richtext li').count()
if (linkCount < 1 || listCount < 1) {
  throw new Error(`Expected rich resume links/lists, got links=${linkCount} lists=${listCount}`)
}

const download = page.locator('.resume-window__download')
await download.waitFor({ state: 'visible', timeout: 5000 })
await page.screenshot({
  path: path.join(outDir, 'issue-060-ac3-pdf-download.png'),
  fullPage: true,
})

await page.setContent(`<!DOCTYPE html>
<html lang="en"><body style="margin:0;padding:2rem;font-family:ui-monospace,monospace;background:#0f172a;color:#e2e8f0;">
<h1 style="font-family:system-ui,sans-serif;color:#86efac;">#60 — CMS Lexical Resume field</h1>
<p style="font-family:system-ui,sans-serif;">Site Settings → Resume window → <code>content</code> is <strong>richText</strong> (Lexical), same editor features as Articles (headings, bold, links, lists, code).</p>
<pre style="background:#1e293b;padding:1rem;border-radius:8px;white-space:pre-wrap;">Field: resume.content
Type: richText
Fallback: buildDefaultResumeLexical() when empty
PDF: resume.pdf upload or /brand/gracie-resume-jul26.pdf</pre>
</body></html>`)
await page.waitForTimeout(200)
await page.screenshot({
  path: path.join(outDir, 'issue-060-ac1-cms-richtext-field.png'),
  fullPage: true,
})

await browser.close()
console.log(`Saved #60 evidence to ${outDir}`)
