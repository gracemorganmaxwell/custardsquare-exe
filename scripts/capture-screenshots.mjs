import { chromium } from '@playwright/test'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.resolve(__dirname, '../docs/screenshots')
const baseUrl = process.env.BASE_URL ?? 'http://localhost:3000'

await mkdir(outDir, { recursive: true })

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })

await page.goto(baseUrl, { waitUntil: 'networkidle' })
await page.getByRole('button', { name: 'Start' }).waitFor({ timeout: 15000 })
await page.screenshot({ path: path.join(outDir, 'start-screen.png'), fullPage: true })

await page.getByRole('button', { name: 'Start' }).click()
await page.locator('.desktop-shell').waitFor({ timeout: 10000 })
await page.waitForTimeout(500)
await page.screenshot({ path: path.join(outDir, 'desktop.png'), fullPage: true })

await browser.close()
console.log(`Saved screenshots to ${outDir}`)
