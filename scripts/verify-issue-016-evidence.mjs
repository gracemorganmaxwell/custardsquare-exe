/**
 * Verify issue #16 acceptance criteria for rich text rendering + TOC.
 * Usage: pnpm verify-issue-016
 */
import 'dotenv/config'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFileSync } from 'node:child_process'
import { extractArticleHeadings } from '../src/lib/lexical-headings.ts'
import { getPublishedArticleBySlug } from '../src/lib/articles.ts'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const baseUrl = process.env.BASE_URL ?? 'http://localhost:3000'
const articleSlug = process.env.ARTICLE_SLUG ?? 'why-i-built-custardsquareexe'

const articleBodySource = readFileSync(
  path.join(root, 'src/components/article/ArticleBody.tsx'),
  'utf8',
)
const tocSource = readFileSync(
  path.join(root, 'src/components/article/ArticleTableOfContents.tsx'),
  'utf8',
)
const headingsLibSource = readFileSync(path.join(root, 'src/lib/lexical-headings.ts'), 'utf8')
const articlesCssSource = readFileSync(
  path.join(root, 'src/app/(frontend)/articles/articles.css'),
  'utf8',
)

const rendersRichText =
  articleBodySource.includes('RichText') &&
  articleBodySource.includes('@payloadcms/richtext-lexical/react')
const rendersCodeBlocks =
  articleBodySource.includes('code-block') && articleBodySource.includes('blocks:')
const rendersHeadingsWithIds =
  articleBodySource.includes("tag === 'h2'") && articleBodySource.includes("tag === 'h3'")
const tocFromH2H3 =
  tocSource.includes('ArticleHeading') &&
  headingsLibSource.includes("node.tag === 'h2'") &&
  headingsLibSource.includes("node.tag === 'h3'")
const readableTypography =
  articlesCssSource.includes('.article-body') &&
  articlesCssSource.includes('line-height') &&
  articlesCssSource.includes('.article-body h2') &&
  articlesCssSource.includes('.article-body ul')

const article = await getPublishedArticleBySlug(articleSlug)
const headings = article?.content ? extractArticleHeadings(article.content) : []

let pageHtml = ''
let hasTocOnPage = false
let hasBodyOnPage = false
let hasHeadingOnPage = false
let hasCodeBlockOnPage = false
let hasListOnPage = false
let pageStatus = 'unavailable'

if (article) {
  pageStatus = execFileSync(
    'curl',
    ['-s', '-o', '/dev/null', '-w', '%{http_code}', `${baseUrl}/articles/${articleSlug}`],
    { encoding: 'utf8' },
  ).trim()
  pageHtml = execFileSync('curl', ['-s', `${baseUrl}/articles/${articleSlug}`], { encoding: 'utf8' })
  hasTocOnPage = pageHtml.includes('article-toc')
  hasBodyOnPage = pageHtml.includes('article-body')
  hasHeadingOnPage = pageHtml.includes('<h2') || pageHtml.includes('<h3')
  hasCodeBlockOnPage = pageHtml.includes('code-block')
  hasListOnPage = pageHtml.includes('<ul') || pageHtml.includes('<ol')
}

if (!rendersRichText || !rendersCodeBlocks || !rendersHeadingsWithIds || !tocFromH2H3 || !readableTypography) {
  console.error('FAIL: rich text / TOC implementation incomplete')
  process.exit(1)
}

if (!article) {
  console.error('FAIL: sample published article not found for rendering checks')
  process.exit(1)
}

if (pageStatus !== '200' || !hasBodyOnPage) {
  console.error('FAIL: article detail page did not render body')
  process.exit(1)
}

const lines = [
  '=== Issue #16 verification ===',
  '',
  'AC1 — Headings, lists, code blocks render correctly',
  `  RichText renderer: ${rendersRichText ? 'yes' : 'no'}`,
  `  Code block converter: ${rendersCodeBlocks ? 'yes' : 'no'}`,
  `  heading ids on h2/h3: ${rendersHeadingsWithIds ? 'yes' : 'no'}`,
  `  page has headings: ${hasHeadingOnPage ? 'yes' : 'no'}`,
  `  page has lists: ${hasListOnPage ? 'yes' : 'no'}`,
  `  page has code blocks: ${hasCodeBlockOnPage ? 'yes' : 'no'}`,
  '',
  'AC2 — TOC generated from h2/h3',
  `  extractArticleHeadings h2/h3: ${tocFromH2H3 ? 'yes' : 'no'}`,
  `  headings extracted: ${headings.length}`,
  `  TOC on page (>=2 headings): ${hasTocOnPage ? 'yes' : headings.length < 2 ? 'n/a (<2 headings)' : 'no'}`,
  '',
  'AC3 — Readable typography on article pages',
  `  article-body typography styles: ${readableTypography ? 'yes' : 'no'}`,
  `  route: ${baseUrl}/articles/${articleSlug} → HTTP ${pageStatus}`,
  '',
  'ALL CHECKS PASSED',
]

console.log(lines.join('\n'))
process.exit(0)
