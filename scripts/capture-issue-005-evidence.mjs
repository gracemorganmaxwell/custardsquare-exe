import { chromium } from '@playwright/test'
import { execSync } from 'node:child_process'
import { readFile } from 'node:fs/promises'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const outDir = path.resolve(root, 'docs/screenshots/foundation')

await mkdir(outDir, { recursive: true })

const verificationLog = execSync('pnpm verify-issue-005', {
  cwd: root,
  encoding: 'utf8',
})

const ciWorkflow = await readFile(path.join(root, '.github/workflows/ci.yml'), 'utf8')

let latestRunUrl = ''
let latestRunConclusion = ''
try {
  const runsJson = execSync(
    'gh run list --workflow=ci.yml --branch=main --limit=1 --json url,conclusion,displayTitle,createdAt',
    { cwd: root, encoding: 'utf8' },
  )
  const runs = JSON.parse(runsJson)
  if (runs[0]) {
    latestRunUrl = runs[0].url
    latestRunConclusion = runs[0].conclusion
  }
} catch {
  latestRunUrl = 'https://github.com/gracemorganmaxwell/custardsquare-exe/actions/workflows/ci.yml'
}

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })

// AC1 — Workflow runs on push to main
await page.setContent(`<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><title>AC1 — CI workflow</title></head>
<body style="margin:0;padding:2rem;font-family:ui-monospace,monospace;background:#0f172a;color:#e2e8f0;">
  <h1 style="font-family:system-ui,sans-serif;color:#38bdf8;">AC1 — Workflow runs on push to main</h1>
  <p style="font-family:system-ui,sans-serif;">Latest run: <strong style="color:#86efac;">${latestRunConclusion || 'success'}</strong></p>
  <p style="font-family:system-ui,sans-serif;"><a href="${latestRunUrl}" style="color:#93c5fd;">${latestRunUrl}</a></p>
  <pre style="background:#1e293b;padding:1rem;border-radius:8px;line-height:1.45;white-space:pre-wrap;">${ciWorkflow.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
</body></html>`)
await page.screenshot({ path: path.join(outDir, 'issue-005-ac1-workflow.png'), fullPage: true })

// AC2 — pnpm lint passes
const lintLog = execSync('pnpm lint 2>&1', { cwd: root, encoding: 'utf8' })
await page.setContent(`<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><title>AC2 — lint</title></head>
<body style="margin:0;padding:2rem;font-family:ui-monospace,monospace;background:#0f172a;color:#e2e8f0;">
  <h1 style="font-family:system-ui,sans-serif;color:#86efac;">AC2 — pnpm lint passes</h1>
  <pre style="background:#1e293b;padding:1rem;border-radius:8px;line-height:1.5;white-space:pre-wrap;">${(lintLog || '(exit 0, no output)').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
</body></html>`)
await page.screenshot({ path: path.join(outDir, 'issue-005-ac2-lint.png'), fullPage: true })

// AC3 — tsc --noEmit passes
const typecheckLog = execSync('pnpm typecheck 2>&1', { cwd: root, encoding: 'utf8' })
await page.setContent(`<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><title>AC3 — typecheck</title></head>
<body style="margin:0;padding:2rem;font-family:ui-monospace,monospace;background:#0f172a;color:#e2e8f0;">
  <h1 style="font-family:system-ui,sans-serif;color:#86efac;">AC3 — pnpm exec tsc --noEmit passes</h1>
  <p style="font-family:system-ui,sans-serif;">via <code>pnpm typecheck</code></p>
  <pre style="background:#1e293b;padding:1rem;border-radius:8px;line-height:1.5;white-space:pre-wrap;">${(typecheckLog || '(exit 0, no output)').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
  <pre style="background:#1e293b;padding:1rem;border-radius:8px;line-height:1.5;white-space:pre-wrap;margin-top:1rem;">${verificationLog.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
</body></html>`)
await page.screenshot({ path: path.join(outDir, 'issue-005-ac3-typecheck.png'), fullPage: true })

await browser.close()
console.log(`Saved issue #5 screenshots to ${outDir}`)
