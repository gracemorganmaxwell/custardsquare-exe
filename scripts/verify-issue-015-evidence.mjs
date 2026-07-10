/**
 * Verify issue #15 acceptance criteria for the /articles/[slug] detail page.
 * Usage: pnpm verify-issue-015
 */
import 'dotenv/config'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFileSync } from 'node:child_process'
import { getPayload } from 'payload'
import config from '../src/payload.config.ts'
import { getPublishedArticleBySlug } from '../src/lib/articles.ts'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const baseUrl = process.env.BASE_URL ?? 'http://localhost:3000'
const articlePageSource = readFileSync(
  path.join(root, 'src/app/(frontend)/articles/[slug]/page.tsx'),
  'utf8',
)
const articleBodySource = readFileSync(
  path.join(root, 'src/components/article/ArticleBody.tsx'),
  'utf8',
)
const articlesLibSource = readFileSync(path.join(root, 'src/lib/articles.ts'), 'utf8')

const usesPublishedBySlug = articlePageSource.includes('getPublishedArticleBySlug')
const rendersLexicalBody =
  articlePageSource.includes('ArticleBody') &&
  articleBodySource.includes('RichText') &&
  articleBodySource.includes('@payloadcms/richtext-lexical/react')
const showsMetadata =
  articlePageSource.includes('article.title') &&
  articlePageSource.includes('article.excerpt') &&
  articlePageSource.includes('article.publishedAt') &&
  articlePageSource.includes('buildArticleMetadata')
const filtersPublishedOnly =
  articlesLibSource.includes('status: { equals: \'published\' }') ||
  articlesLibSource.includes('status: { equals: "published" }')

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

const testSlug = `issue-015-evidence-draft-${Date.now()}`
const payload = await getPayload({ config: await config })

const draft = await payload.create({
  collection: 'articles',
  draft: true,
  data: {
    title: 'Issue #15 evidence draft — must 404',
    slug: testSlug,
    excerpt: 'Draft excerpt that should never appear on the public detail route.',
    content: minimalContent('Draft body for issue #15 verification.'),
  },
  overrideAccess: true,
})

const draftBySlug = await getPublishedArticleBySlug(testSlug)
const draftPageStatus = execFileSync(
  'curl',
  ['-s', '-o', '/dev/null', '-w', '%{http_code}', `${baseUrl}/articles/${testSlug}`],
  { encoding: 'utf8' },
).trim()

let publishedSlug = ''
let publishedPageStatus = 'unavailable'
let publishedBodyOnPage = false
let publishedTitleOnPage = false

const { docs: publishedDocs } = await payload.find({
  collection: 'articles',
  limit: 1,
  where: {
    status: { equals: 'published' },
  },
  overrideAccess: true,
})

if (publishedDocs[0]) {
  publishedSlug = publishedDocs[0].slug
  publishedPageStatus = execFileSync(
    'curl',
    ['-s', '-o', '/dev/null', '-w', '%{http_code}', `${baseUrl}/articles/${publishedSlug}`],
    { encoding: 'utf8' },
  ).trim()

  const publishedHtml = execFileSync(
    'curl',
    ['-s', `${baseUrl}/articles/${publishedSlug}`],
    { encoding: 'utf8' },
  )
  publishedTitleOnPage = publishedHtml.includes(publishedDocs[0].title)
  publishedBodyOnPage = publishedHtml.includes('article-body')
}

await payload.delete({
  collection: 'articles',
  id: draft.id,
  overrideAccess: true,
})

if (!usesPublishedBySlug || !rendersLexicalBody || !showsMetadata || !filtersPublishedOnly) {
  console.error('FAIL: /articles/[slug] page implementation incomplete')
  process.exit(1)
}

if (draftBySlug !== null) {
  console.error('FAIL: draft article resolved via getPublishedArticleBySlug')
  process.exit(1)
}

if (draftPageStatus !== '404') {
  console.error(`FAIL: draft detail route returned HTTP ${draftPageStatus}, expected 404`)
  process.exit(1)
}

if (publishedDocs[0] && publishedPageStatus !== '200') {
  console.error(`FAIL: published article route returned HTTP ${publishedPageStatus}`)
  process.exit(1)
}

if (publishedDocs[0] && (!publishedTitleOnPage || !publishedBodyOnPage)) {
  console.error('FAIL: published article detail page missing title or article body')
  process.exit(1)
}

const lines = [
  '=== Issue #15 verification ===',
  '',
  'AC1 — Article body renders from Lexical rich text',
  `  page uses getPublishedArticleBySlug(): ${usesPublishedBySlug ? 'yes' : 'no'}`,
  `  ArticleBody + RichText: ${rendersLexicalBody ? 'yes' : 'no'}`,
  `  title/excerpt/date + SEO metadata: ${showsMetadata ? 'yes' : 'no'}`,
  publishedDocs[0]
    ? `  published route: ${baseUrl}/articles/${publishedSlug} → HTTP ${publishedPageStatus}`
    : '  published route: n/a (no published articles yet)',
  publishedDocs[0]
    ? `  article body container on page: ${publishedBodyOnPage ? 'yes' : 'no'}`
    : '',
  '',
  'AC2 — Drafts return 404',
  `  getPublishedArticleBySlug(draft): ${draftBySlug === null ? 'null' : 'leaked'}`,
  `  GET /articles/${testSlug} → HTTP ${draftPageStatus}`,
  '',
  'AC3 — Soft-deleted content returns 404',
  '  soft delete fields: not used (#12 cancelled)',
  '',
  'ALL CHECKS PASSED',
].filter(Boolean)

console.log(lines.join('\n'))
process.exit(0)
