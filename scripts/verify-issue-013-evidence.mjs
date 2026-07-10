/**
 * Verify issue #13 acceptance criteria for public access control helpers.
 * Usage: pnpm verify-issue-013
 */
import 'dotenv/config'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFileSync } from 'node:child_process'
import { globSync } from 'node:fs'
import { getPayload } from 'payload'
import config from '../src/payload.config.ts'
import { getPublishedArticleBySlug, getPublishedArticles } from '../src/lib/articles.ts'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const baseUrl = process.env.BASE_URL ?? 'http://localhost:3000'
const accessSource = readFileSync(path.join(root, 'src/lib/access.ts'), 'utf8')
const articlesSource = readFileSync(path.join(root, 'src/collections/Articles.ts'), 'utf8')
const articlesLibSource = readFileSync(path.join(root, 'src/lib/articles.ts'), 'utf8')

const articlesUsePublishedOnly =
  articlesSource.includes('read: publishedOnly') &&
  accessSource.includes('export const publishedOnly')

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

const testSlug = `issue-013-evidence-${Date.now()}`

const payload = await getPayload({ config: await config })

const draft = await payload.create({
  collection: 'articles',
  draft: true,
  data: {
    title: 'Issue #13 evidence draft',
    slug: testSlug,
    excerpt: 'Draft article — must never appear in public queries.',
    content: minimalContent('Draft body for issue #13 verification.'),
  },
  overrideAccess: true,
})

const publicLocalFind = await payload.find({
  collection: 'articles',
  where: { slug: { equals: testSlug } },
  overrideAccess: false,
})

const publicApiJson = execFileSync(
  'curl',
  [
    '-s',
    '-g',
    `${baseUrl}/api/articles?where[slug][equals]=${encodeURIComponent(testSlug)}&depth=0`,
  ],
  { encoding: 'utf8' },
)
const publicApi = JSON.parse(publicApiJson)
const publicApiDocs = publicApi.docs ?? []

const publicBySlug = await getPublishedArticleBySlug(testSlug)
const publicList = await getPublishedArticles(500)
const draftInPublicList = publicList.some((article) => article.slug === testSlug)

await payload.delete({
  collection: 'articles',
  id: draft.id,
  overrideAccess: true,
})

const frontendRouteFiles = globSync('src/app/(frontend)/**/*.{tsx,ts}', {
  cwd: root,
  absolute: true,
})
const frontendSources = frontendRouteFiles.map((file) => readFileSync(file, 'utf8')).join('\n')

const frontendUsesPublishedHelpers =
  frontendSources.includes('getPublishedArticles') &&
  frontendSources.includes('getPublishedArticleBySlug')
const noStaticArticleBundles =
  !frontendSources.includes('generateStaticParams') &&
  !frontendSources.includes("export const dynamic = 'force-static'")
const frontendForceDynamic =
  frontendSources.includes("export const dynamic = 'force-dynamic'")

const draftsExcludedFromPublic =
  publicLocalFind.totalDocs === 0 &&
  publicApiDocs.length === 0 &&
  publicBySlug === null &&
  !draftInPublicList

if (!articlesUsePublishedOnly) {
  console.error('FAIL: Articles collection missing publishedOnly read access')
  process.exit(1)
}

if (!draftsExcludedFromPublic) {
  console.error('FAIL: draft article leaked into public queries')
  console.error({
    publicLocalFind: publicLocalFind.totalDocs,
    publicApiDocs: publicApiDocs.length,
    publicBySlug,
    draftInPublicList,
  })
  process.exit(1)
}

if (!frontendUsesPublishedHelpers || !noStaticArticleBundles || !frontendForceDynamic) {
  console.error('FAIL: frontend may bundle or expose draft data statically')
  process.exit(1)
}

const lines = [
  '=== Issue #13 verification ===',
  '',
  'AC1 — publishedOnly read access on Articles',
  `  Articles read: publishedOnly: ${articlesUsePublishedOnly ? 'yes' : 'no'}`,
  `  helper: src/lib/access.ts`,
  '',
  'AC2 — Drafts never returned in public Local API queries',
  `  payload.find (no user, no overrideAccess): ${publicLocalFind.totalDocs} docs`,
  `  REST GET /api/articles?slug=${testSlug}: ${publicApiDocs.length} docs`,
  `  getPublishedArticleBySlug: ${publicBySlug === null ? 'null' : 'leaked'}`,
  `  getPublishedArticles includes draft: ${draftInPublicList ? 'yes' : 'no'}`,
  '',
  'AC3 — No draft data in frontend static bundles',
  `  routes use getPublishedArticles / getPublishedArticleBySlug: yes`,
  `  generateStaticParams for articles: absent`,
  `  force-static on frontend routes: absent`,
  `  force-dynamic on frontend routes: yes`,
  `  frontend route files checked: ${frontendRouteFiles.length}`,
  '',
  'ALL CHECKS PASSED',
]

console.log(lines.join('\n'))
process.exit(0)
