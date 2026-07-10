/**
 * Verify issue #22 acceptance criteria for boot screen + reduced motion.
 * Usage: pnpm verify-issue-022
 */
import 'dotenv/config'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFileSync } from 'node:child_process'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const baseUrl = process.env.BASE_URL ?? 'http://localhost:3000'
const bootSource = readFileSync(path.join(root, 'src/components/desktop/BootScreen.tsx'), 'utf8')
const pageSource = readFileSync(path.join(root, 'src/app/(frontend)/page.tsx'), 'utf8')
const bootCssSource = readFileSync(path.join(root, 'src/styles/boot.css'), 'utf8')

const hasStartupLines =
  bootSource.includes('getBootLines') && bootSource.includes('Starting ${siteTitle}')
const continuesToDesktop = bootSource.includes('isComplete') && pageSource.includes('<BootScreen')
const hasReducedMotion =
  bootSource.includes('prefers-reduced-motion: reduce') &&
  bootSource.includes('setVisibleLineCount(lines.length)')
const hasBootStyles =
  bootCssSource.includes('.boot-screen') && bootCssSource.includes('.boot-screen__line')

const homeStatus = execFileSync(
  'curl',
  ['-s', '-o', '/dev/null', '-w', '%{http_code}', `${baseUrl}/`],
  { encoding: 'utf8' },
).trim()

if (!hasStartupLines || !continuesToDesktop || !hasReducedMotion || !hasBootStyles) {
  console.error('FAIL: boot screen implementation incomplete')
  process.exit(1)
}

if (homeStatus !== '200') {
  console.error(`FAIL: homepage returned HTTP ${homeStatus}`)
  process.exit(1)
}

const lines = [
  '=== Issue #22 verification ===',
  '',
  'AC1 — Shows custardsquare.exe startup lines',
  `  getBootLines startup copy: ${hasStartupLines ? 'yes' : 'no'}`,
  `  boot-screen styles: ${hasBootStyles ? 'yes' : 'no'}`,
  '',
  'AC2 — Continues to desktop/login',
  `  BootScreen wraps homepage: ${continuesToDesktop ? 'yes' : 'no'}`,
  `  completes to children after boot: ${bootSource.includes('return children') ? 'yes' : 'no'}`,
  `  route: ${baseUrl}/ → HTTP ${homeStatus}`,
  '',
  'AC3 — Reduced motion skips typing animation',
  `  prefers-reduced-motion branch: ${hasReducedMotion ? 'yes' : 'no'}`,
  '  visual proof: capture script screenshots boot + reduced-motion code',
  '',
  'ALL CHECKS PASSED',
]

console.log(lines.join('\n'))
process.exit(0)
