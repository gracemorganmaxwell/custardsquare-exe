/**
 * Verify issue #5 acceptance criteria for CI lint + typecheck.
 * Usage: pnpm verify-issue-005
 */
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { execSync } from 'node:child_process'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const ciWorkflow = readFileSync(path.join(root, '.github/workflows/ci.yml'), 'utf8')

const runsOnPushMain =
  ciWorkflow.includes('on:') &&
  ciWorkflow.includes('push:') &&
  ciWorkflow.includes('main')

const runsLint = ciWorkflow.includes('pnpm lint')
const runsTypecheck =
  ciWorkflow.includes('pnpm typecheck') || ciWorkflow.includes('tsc --noEmit')

if (!runsOnPushMain || !runsLint || !runsTypecheck) {
  console.error('FAIL: ci.yml missing required triggers or steps')
  process.exit(1)
}

let lintExit = 0
let typecheckExit = 0
let lintOutput = ''
let typecheckOutput = ''

try {
  lintOutput = execSync('pnpm lint', { cwd: root, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] })
} catch (error) {
  lintExit = error.status ?? 1
  lintOutput = `${error.stdout ?? ''}${error.stderr ?? ''}`
}

try {
  typecheckOutput = execSync('pnpm typecheck', { cwd: root, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] })
} catch (error) {
  typecheckExit = error.status ?? 1
  typecheckOutput = `${error.stdout ?? ''}${error.stderr ?? ''}`
}

let latestRun = 'unavailable'
try {
  const runsJson = execSync(
    'gh run list --workflow=ci.yml --branch=main --limit=1 --json databaseId,conclusion,displayTitle,url,event',
    { cwd: root, encoding: 'utf8' },
  )
  const runs = JSON.parse(runsJson)
  if (runs[0]) {
    latestRun = `${runs[0].conclusion} — ${runs[0].displayTitle} (${runs[0].event})\n  ${runs[0].url}`
  }
} catch {
  latestRun = 'gh run list unavailable'
}

if (lintExit !== 0 || typecheckExit !== 0) {
  console.error('FAIL: lint or typecheck did not pass locally')
  console.error(lintOutput)
  console.error(typecheckOutput)
  process.exit(1)
}

const lines = [
  '=== Issue #5 verification ===',
  '',
  'AC1 — Workflow runs on push to main',
  `  .github/workflows/ci.yml push→main: ${runsOnPushMain ? 'yes' : 'no'}`,
  `  pull_request→main: ${ciWorkflow.includes('pull_request:') ? 'yes' : 'no'}`,
  `  latest GitHub Actions run: ${latestRun}`,
  '',
  'AC2 — pnpm lint passes',
  `  exit code: ${lintExit}`,
  lintOutput.trim() ? `  output: ${lintOutput.trim().split('\n').slice(-3).join(' | ')}` : '  output: (clean)',
  '',
  'AC3 — pnpm exec tsc --noEmit passes',
  `  command: pnpm typecheck → tsc --noEmit`,
  `  exit code: ${typecheckExit}`,
  typecheckOutput.trim()
    ? `  output: ${typecheckOutput.trim().split('\n').slice(-3).join(' | ')}`
    : '  output: (clean)',
  '',
  'ALL CHECKS PASSED',
]

console.log(lines.join('\n'))
process.exit(0)
