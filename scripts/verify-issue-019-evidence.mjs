/**
 * Verify issue #19 acceptance criteria for sitemap + robots.txt.
 * Usage: pnpm verify-issue-019
 */
import 'dotenv/config'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFileSync } from 'node:child_process'
import { getPayload } from 'payload'
import config from '../src/payload.config.ts'
import { getPublishedArticles } from '../src/lib/articles.ts'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const baseUrl = process.env.BASE_URL ?? 'http://localhost:3000'
const sitemapSource = readFileSync(path.join(root, 'src/app/(frontend)/sitemap.ts'), 'utf8')
const robotsSource = readFileSync(path.join(root, 'src/app/robots.ts'), 'utf8')

const sitemapUsesPublished = sitemapSource.includes('getPublishedArticles')
const sitemapHasStaticRoutes =
  sitemapSource.includes("getAbsoluteUrl('/')") &&
  sitemapSource.includes("getAbsoluteUrl('/articles')")
const robotsAllowsPublic =
  robotsSource.includes("allow: '/'") && robotsSource.includes("disallow: ['/admin/', '/api/']")
const robotsReferencesSitemap = robotsSource.includes('sitemap:')

function minimalContent(text) {
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      children: [
        {
          type: 'paragraph',
          format: '',
          indent: 0,
          version: 1,
          children: [
            {
              mode: 'normal',
              text,
              type: 'text',
              style: '',
              detail: 0,
              format: 0,
              version: 1,
            },
          ],
          direction: null,
        },
      ],
      direction: null,
    },
  }
}

const testSlug = `issue-019-evidence-draft-${Date.now()}`
const payload = await getPayload({ config: await config })

const draft = await payload.create({
  collection: 'articles',
  draft: true,
  data: {
    title: 'Issue #19 evidence draft — must not sitemap',
    slug: testSlug,
    excerpt: 'Draft article excluded from sitemap.',
    content: minimalContent('Draft body for issue #19 verification.'),
  },
  overrideAccess: true,
})

const publishedArticles = await getPublishedArticles(500)
const sitemapStatus = execFileSync(
  'curl',
  ['-s', '-o', '/dev/null', '-w', '%{http_code}', `${baseUrl}/sitemap.xml`],
  { encoding: 'utf8' },
).trim()
const robotsStatus = execFileSync(
  'curl',
  ['-s', '-o', '/dev/null', '-w', '%{http_code}', `${baseUrl}/robots.txt`],
  { encoding: 'utf8' },
).trim()
const sitemapXml = execFileSync('curl', ['-s', `${baseUrl}/sitemap.xml`], { encoding: 'utf8' })
const robotsTxt = execFileSync('curl', ['-s', `${baseUrl}/robots.txt`], { encoding: 'utf8' })

const includesHome = sitemapXml.includes('/articles') && (sitemapXml.includes('<loc>') || sitemapXml.includes('<url>'))
const includesPublishedArticle =
  publishedArticles.length === 0 ||
  publishedArticles.some((article) => sitemapXml.includes(`/articles/${article.slug}`))
const excludesDraft = !sitemapXml.includes(testSlug)
const robotsAllowsIndexing = robotsTxt.includes('Allow: /') || robotsTxt.toLowerCase().includes('allow: /')
const robotsBlocksAdmin = robotsTxt.includes('/admin/')

await payload.delete({
  collection: 'articles',
  id: draft.id,
  overrideAccess: true,
})

if (!sitemapUsesPublished || !sitemapHasStaticRoutes || !robotsAllowsPublic || !robotsReferencesSitemap) {
  console.error('FAIL: sitemap/robots implementation incomplete')
  process.exit(1)
}

if (sitemapStatus !== '200' || robotsStatus !== '200') {
  console.error(`FAIL: sitemap (${sitemapStatus}) or robots (${robotsStatus}) not reachable`)
  process.exit(1)
}

if (!includesHome || !includesPublishedArticle || !excludesDraft) {
  console.error('FAIL: sitemap content checks failed')
  process.exit(1)
}

if (!robotsAllowsIndexing || !robotsBlocksAdmin) {
  console.error('FAIL: robots.txt rules incorrect')
  process.exit(1)
}

const lines = [
  '=== Issue #19 verification ===',
  '',
  'AC1 — Sitemap includes articles and static public routes',
  `  getPublishedArticles in sitemap.ts: ${sitemapUsesPublished ? 'yes' : 'no'}`,
  `  static / and /articles routes: ${sitemapHasStaticRoutes ? 'yes' : 'no'}`,
  `  published article URLs in sitemap: ${includesPublishedArticle ? 'yes' : 'no'}`,
  `  GET ${baseUrl}/sitemap.xml → HTTP ${sitemapStatus}`,
  '',
  'AC2 — Drafts excluded',
  `  draft slug in sitemap: ${excludesDraft ? 'no' : 'yes (fail)'}`,
  `  soft delete fields: not used (#12 cancelled)`,
  '',
  'AC3 — robots.txt allows indexing of public content',
  `  Allow / + disallow /admin/, /api/: ${robotsAllowsPublic ? 'yes' : 'no'}`,
  `  sitemap reference: ${robotsReferencesSitemap ? 'yes' : 'no'}`,
  `  GET ${baseUrl}/robots.txt → HTTP ${robotsStatus}`,
  '',
  'ALL CHECKS PASSED',
]

console.log(lines.join('\n'))
process.exit(0)
