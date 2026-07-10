import { chromium } from '@playwright/test'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.resolve(__dirname, '../docs/screenshots/issues')
const baseUrl = process.env.BASE_URL ?? 'http://localhost:3000'
const articleSlug = 'why-i-built-custardsquareexe'

const captures = [
  {
    issue: 22,
    file: 'issue-022-boot-screen.png',
    label: 'Boot screen (mid-sequence)',
    run: async (page) => {
      await page.goto(baseUrl, { waitUntil: 'domcontentloaded' })
      await page.locator('.boot-screen').waitFor({ timeout: 10000 })
      await page.waitForTimeout(700)
    },
  },
  {
    issue: 23,
    file: 'issue-023-start-screen.png',
    label: 'Start screen',
    run: async (page) => {
      await page.goto(baseUrl, { waitUntil: 'networkidle' })
      await page.getByRole('button', { name: 'Start' }).waitFor({ timeout: 15000 })
    },
  },
  {
    issue: 21,
    file: 'issue-021-design-tokens.png',
    label: 'Win95 design tokens (window chrome)',
    run: async (page) => {
      await page.goto(baseUrl, { waitUntil: 'networkidle' })
      await page.getByRole('button', { name: 'Start' }).waitFor({ timeout: 15000 })
      await page.locator('.login-screen__window').screenshot({
        path: path.join(outDir, 'issue-021-design-tokens.png'),
      })
      return 'element'
    },
  },
  {
    issue: 24,
    file: 'issue-024-desktop-shell.png',
    label: 'Desktop shell + wallpaper',
    run: async (page) => {
      await page.goto(baseUrl, { waitUntil: 'networkidle' })
      await page.getByRole('button', { name: 'Start' }).click()
      await page.locator('.desktop-shell').waitFor({ timeout: 10000 })
      await page.waitForTimeout(400)
    },
  },
  {
    issue: 25,
    file: 'issue-025-desktop-icons.png',
    label: 'Desktop icons',
    run: async (page) => {
      await page.goto(baseUrl, { waitUntil: 'networkidle' })
      await page.getByRole('button', { name: 'Start' }).click()
      await page.locator('.desktop-icon-grid').waitFor({ timeout: 10000 })
      await page.locator('.desktop-icon--selected').waitFor({ timeout: 5000 })
      await page.waitForTimeout(300)
    },
  },
  {
    issue: 14,
    file: 'issue-014-articles-index.png',
    label: 'Articles index',
    run: async (page) => {
      await page.goto(`${baseUrl}/articles`, { waitUntil: 'networkidle' })
      await page.locator('.article-list-header').waitFor({ timeout: 10000 })
    },
  },
  {
    issue: 15,
    file: 'issue-015-article-detail.png',
    label: 'Article detail',
    run: async (page) => {
      await page.goto(`${baseUrl}/articles/${articleSlug}`, { waitUntil: 'networkidle' })
      await page.locator('.article-header').waitFor({ timeout: 10000 })
    },
  },
  {
    issue: 16,
    file: 'issue-016-article-toc.png',
    label: 'Rich text + TOC',
    run: async (page) => {
      await page.goto(`${baseUrl}/articles/${articleSlug}`, { waitUntil: 'networkidle' })
      const toc = page.locator('.article-toc')
      if (await toc.count()) {
        await toc.waitFor({ timeout: 10000 })
      } else {
        await page.locator('.article-body').waitFor({ timeout: 10000 })
      }
    },
  },
]

await mkdir(outDir, { recursive: true })

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })

for (const capture of captures) {
  const result = await capture.run(page)
  if (result !== 'element') {
    await page.screenshot({
      path: path.join(outDir, capture.file),
      fullPage: true,
    })
  }
  console.log(`#${capture.issue} → ${capture.file}`)
}

await browser.close()
console.log(`\nSaved ${captures.length} screenshots to ${outDir}`)
