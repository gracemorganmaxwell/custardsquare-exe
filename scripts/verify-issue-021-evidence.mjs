/**
 * Verify issue #21 acceptance criteria for design tokens + win95.css.
 * Usage: pnpm verify-issue-021
 */
import 'dotenv/config'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFileSync } from 'node:child_process'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const baseUrl = process.env.BASE_URL ?? 'http://localhost:3000'
const win95Source = readFileSync(path.join(root, 'src/styles/win95.css'), 'utf8')
const layoutSource = readFileSync(path.join(root, 'src/app/(frontend)/layout.tsx'), 'utf8')
const pageSource = readFileSync(path.join(root, 'src/app/(frontend)/page.tsx'), 'utf8')

const hasGreyTokens =
  win95Source.includes('--win95-grey') && win95Source.includes('--win95-grey-dark')
const hasAccentTokens =
  win95Source.includes('--dream-pink') &&
  win95Source.includes('--dream-purple') &&
  win95Source.includes('--dream-lavender')
const hasTitleBarTokens =
  win95Source.includes('--win95-title-active-bg') &&
  win95Source.includes('--win95-title-active-fg')
const hasRaisedUtility = win95Source.includes('.win95-raised')
const hasInsetUtility = win95Source.includes('.win95-inset')
const importedInLayout = layoutSource.includes("import '@/styles/win95.css'")
const usedOnHomepage = pageSource.includes('win95-raised') && pageSource.includes('win95-inset')

const homeStatus = execFileSync(
  'curl',
  ['-s', '-o', '/dev/null', '-w', '%{http_code}', `${baseUrl}/`],
  { encoding: 'utf8' },
).trim()
const homeHtml = execFileSync('curl', ['-s', `${baseUrl}/`], { encoding: 'utf8' })
const hasRaisedOnPage = homeHtml.includes('win95-raised')
const hasInsetOnPage = homeHtml.includes('win95-inset')
const hasTitlebarOnPage = homeHtml.includes('win95-titlebar')

if (
  !hasGreyTokens ||
  !hasAccentTokens ||
  !hasTitleBarTokens ||
  !hasRaisedUtility ||
  !hasInsetUtility ||
  !importedInLayout ||
  !usedOnHomepage
) {
  console.error('FAIL: win95 design tokens implementation incomplete')
  process.exit(1)
}

if (homeStatus !== '200' || !hasRaisedOnPage || !hasInsetOnPage) {
  console.error('FAIL: homepage does not render win95 utility classes')
  process.exit(1)
}

const lines = [
  '=== Issue #21 verification ===',
  '',
  'AC1 — CSS variables for grey, pink/purple accent, title bar colours',
  `  grey tokens: ${hasGreyTokens ? 'yes' : 'no'}`,
  `  dream accent tokens: ${hasAccentTokens ? 'yes' : 'no'}`,
  `  title bar tokens: ${hasTitleBarTokens ? 'yes' : 'no'}`,
  `  imported in frontend layout: ${importedInLayout ? 'yes' : 'no'}`,
  '',
  'AC2 — Raised/inset border utilities work',
  `  .win95-raised defined: ${hasRaisedUtility ? 'yes' : 'no'}`,
  `  .win95-inset defined: ${hasInsetUtility ? 'yes' : 'no'}`,
  `  homepage uses raised/inset: ${usedOnHomepage ? 'yes' : 'no'}`,
  `  rendered on page HTML: ${hasRaisedOnPage && hasInsetOnPage ? 'yes' : 'no'}`,
  `  title bar chrome on page: ${hasTitlebarOnPage ? 'yes' : 'no'}`,
  `  route: ${baseUrl}/ → HTTP ${homeStatus}`,
  '',
  'ALL CHECKS PASSED',
]

console.log(lines.join('\n'))
process.exit(0)
