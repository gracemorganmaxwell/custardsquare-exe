/**
 * Verify issue #48 acceptance criteria for custom domain + HTTPS.
 * Usage: pnpm verify-issue-048
 */
import 'dotenv/config'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFileSync } from 'node:child_process'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const envExample = readFileSync(path.join(root, '.env.example'), 'utf8')
const siteUrlSource = readFileSync(path.join(root, 'src/lib/site-url.ts'), 'utf8')

const productionUrl = 'https://custardsq.app'
const wwwUrl = 'https://www.custardsq.app'

const documentsSiteUrl =
  envExample.includes('NEXT_PUBLIC_SITE_URL') && envExample.includes('custardsq.app')
const productionOriginsConfigured =
  siteUrlSource.includes('https://custardsq.app') &&
  siteUrlSource.includes('https://www.custardsq.app')

function curlStatus(url) {
  return execFileSync('curl', ['-s', '-o', '/dev/null', '-w', '%{http_code}', url], {
    encoding: 'utf8',
  }).trim()
}

function curlFinalUrl(url) {
  return execFileSync('curl', ['-s', '-o', '/dev/null', '-w', '%{url_effective}', url], {
    encoding: 'utf8',
  }).trim()
}

const homeStatus = curlStatus(`${productionUrl}/`)
const adminStatus = curlStatus(`${productionUrl}/admin/login`)
const articlesStatus = curlStatus(`${productionUrl}/articles`)
const finalHomeUrl = curlFinalUrl(`${productionUrl}/`)
const finalWwwUrl = curlFinalUrl(`${wwwUrl}/`)
const usesHttps = finalHomeUrl.startsWith('https://') && finalWwwUrl.startsWith('https://')
const domainResolves = homeStatus === '200' && adminStatus === '200' && articlesStatus === '200'

if (!documentsSiteUrl || !productionOriginsConfigured) {
  console.error('FAIL: custom domain configuration not documented in repo')
  process.exit(1)
}

if (!domainResolves || !usesHttps) {
  console.error('FAIL: production domain or HTTPS checks failed')
  process.exit(1)
}

const lines = [
  '=== Issue #48 verification ===',
  '',
  'AC1 — Custom domain resolves',
  `  ${productionUrl}/ → HTTP ${homeStatus}`,
  `  ${productionUrl}/admin/login → HTTP ${adminStatus}`,
  `  ${productionUrl}/articles → HTTP ${articlesStatus}`,
  `  effective URL: ${finalHomeUrl}`,
  '',
  'AC2 — HTTPS works',
  `  https://${new URL(finalHomeUrl).host}/ uses TLS: ${usesHttps ? 'yes' : 'no'}`,
  `  www alias resolves: ${finalWwwUrl}`,
  '',
  'AC3 — NEXT_PUBLIC_SITE_URL updated',
  `  .env.example documents custardsq.app: ${documentsSiteUrl ? 'yes' : 'no'}`,
  `  site-url production origins: ${productionOriginsConfigured ? 'yes' : 'no'}`,
  '',
  'ALL CHECKS PASSED',
]

console.log(lines.join('\n'))
process.exit(0)
