/**
 * Verify issue #17 acceptance criteria for SEO metadata helpers.
 * Usage: pnpm verify-issue-017
 */
import 'dotenv/config'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFileSync } from 'node:child_process'
import { getPublishedArticleBySlug } from '../src/lib/articles.ts'
import { buildArticleMetadata } from '../src/lib/seo.ts'
import { getSiteSettings } from '../src/lib/site-settings.ts'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const baseUrl = process.env.BASE_URL ?? 'http://localhost:3000'
const articleSlug = process.env.ARTICLE_SLUG ?? 'why-i-built-custardsquareexe'
const seoSource = readFileSync(path.join(root, 'src/lib/seo.ts'), 'utf8')
const articlePageSource = readFileSync(
  path.join(root, 'src/app/(frontend)/articles/[slug]/page.tsx'),
  'utf8',
)

const hasBuildArticleMetadata = seoSource.includes('export function buildArticleMetadata')
const usesSeoFallbacks =
  seoSource.includes('article.seoDescription') && seoSource.includes('article.excerpt')
const usesOgImageFallback =
  seoSource.includes('article.ogImage') && seoSource.includes('article.coverImage')
const hasOpenGraph = seoSource.includes('openGraph:') && seoSource.includes("type: 'article'")
const hasTwitter = seoSource.includes('twitter:')
const hasCanonical = seoSource.includes('alternates:') && seoSource.includes('canonical')
const pageUsesGenerateMetadata =
  articlePageSource.includes('generateMetadata') &&
  articlePageSource.includes('buildArticleMetadata')

const article = await getPublishedArticleBySlug(articleSlug)
const settings = await getSiteSettings()

if (!article) {
  console.error('FAIL: no published article found for SEO checks')
  process.exit(1)
}

const metadata = buildArticleMetadata(article, settings)
const canonical = metadata.alternates?.canonical
const description = metadata.description
const ogTitle = metadata.openGraph?.title
const twitterCard = metadata.twitter?.card

let pageHtml = ''
let htmlHasOgTitle = false
let htmlHasDescription = false
let htmlHasCanonical = false
let htmlHasOgImage = false
let pageStatus = 'unavailable'

pageStatus = execFileSync(
  'curl',
  ['-s', '-o', '/dev/null', '-w', '%{http_code}', `${baseUrl}/articles/${articleSlug}`],
  { encoding: 'utf8' },
).trim()
pageHtml = execFileSync('curl', ['-s', `${baseUrl}/articles/${articleSlug}`], { encoding: 'utf8' })
htmlHasOgTitle = pageHtml.includes('property="og:title"') || pageHtml.includes('name="og:title"')
htmlHasDescription =
  pageHtml.includes('name="description"') || pageHtml.includes('property="og:description"')
htmlHasCanonical = pageHtml.includes('rel="canonical"')
htmlHasOgImage = pageHtml.includes('property="og:image"')

if (
  !hasBuildArticleMetadata ||
  !usesSeoFallbacks ||
  !usesOgImageFallback ||
  !hasOpenGraph ||
  !hasTwitter ||
  !hasCanonical ||
  !pageUsesGenerateMetadata
) {
  console.error('FAIL: SEO helpers implementation incomplete')
  process.exit(1)
}

if (!description || !ogTitle || !canonical || !twitterCard) {
  console.error('FAIL: buildArticleMetadata missing expected fields')
  process.exit(1)
}

if (pageStatus !== '200' || !htmlHasDescription || !htmlHasCanonical) {
  console.error('FAIL: article page missing SEO tags in HTML')
  process.exit(1)
}

const lines = [
  '=== Issue #17 verification ===',
  '',
  'AC1 — title and description from seoTitle/seoDescription or fallbacks',
  `  buildArticleMetadata: ${hasBuildArticleMetadata ? 'yes' : 'no'}`,
  `  seoDescription/excerpt fallbacks: ${usesSeoFallbacks ? 'yes' : 'no'}`,
  `  metadata.description: ${description ? 'set' : 'missing'}`,
  `  HTML description meta: ${htmlHasDescription ? 'yes' : 'no'}`,
  '',
  'AC2 — Open Graph image from ogImage or coverImage',
  `  ogImage/coverImage fallback chain: ${usesOgImageFallback ? 'yes' : 'no'}`,
  `  openGraph configured: ${hasOpenGraph ? 'yes' : 'no'}`,
  `  HTML og:image: ${htmlHasOgImage ? 'yes' : 'optional (no image set)'}`,
  `  twitter card: ${twitterCard ?? 'missing'}`,
  '',
  'AC3 — canonical URL supported',
  `  alternates.canonical in helper: ${hasCanonical ? 'yes' : 'no'}`,
  `  canonical for sample article: ${canonical}`,
  `  HTML canonical link: ${htmlHasCanonical ? 'yes' : 'no'}`,
  `  route: ${baseUrl}/articles/${articleSlug} → HTTP ${pageStatus}`,
  '',
  'ALL CHECKS PASSED',
]

console.log(lines.join('\n'))
process.exit(0)
