/**
 * Verify issue #12 — Soft delete cancelled; draft/published used instead (#7).
 * Usage: pnpm verify-issue-012
 */
import 'dotenv/config'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getPayload } from 'payload'
import config from '../src/payload.config.ts'
import { getPublishedArticleBySlug, getPublishedArticles } from '../src/lib/articles.ts'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const articlesSource = readFileSync(path.join(root, 'src/collections/Articles.ts'), 'utf8')
const accessSource = readFileSync(path.join(root, 'src/lib/access.ts'), 'utf8')
const articlesLibSource = readFileSync(path.join(root, 'src/lib/articles.ts'), 'utf8')
const issueManifest = readFileSync(
  path.join(root, 'docs/issues/012-soft-delete-fields-restore-workflow.md'),
  'utf8',
)

const noSoftDeleteFields =
  !articlesSource.includes('softDeletedAt') &&
  !articlesSource.includes('deletedReason') &&
  !articlesSource.includes('restoredAt') &&
  !articlesSource.includes('trash:')
const usesDraftPublished =
  articlesSource.includes('versions:') &&
  articlesSource.includes('drafts:') &&
  articlesSource.includes("name: 'status'") &&
  articlesSource.includes("'draft'") &&
  articlesSource.includes("'published'")
const publicFiltersPublished =
  accessSource.includes('publishedOnly') &&
  accessSource.includes("equals: 'published'") &&
  articlesLibSource.includes("status: { equals: 'published' }")
const manifestDocumentsCancellation =
  issueManifest.includes('Cancelled') && issueManifest.includes('draft/published')

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

const testSlug = `issue-012-evidence-${Date.now()}`

const payload = await getPayload({ config: await config })

const draft = await payload.create({
  collection: 'articles',
  draft: true,
  data: {
    title: 'Issue #12 evidence draft',
    slug: testSlug,
    excerpt: 'Draft article — should not appear in public queries.',
    content: minimalContent('Draft body for issue #12 verification.'),
  },
  overrideAccess: true,
})

const publicFind = await payload.find({
  collection: 'articles',
  where: { slug: { equals: testSlug } },
  overrideAccess: false,
})

const adminFind = await payload.find({
  collection: 'articles',
  where: { slug: { equals: testSlug } },
  overrideAccess: true,
})

const publicBySlug = await getPublishedArticleBySlug(testSlug)
const publicList = await getPublishedArticles(500)
const draftInPublicList = publicList.some((article) => article.slug === testSlug)

await payload.delete({
  collection: 'articles',
  id: draft.id,
  overrideAccess: true,
})

const afterDelete = await payload.find({
  collection: 'articles',
  where: { slug: { equals: testSlug } },
  overrideAccess: true,
})

const draftHiddenFromPublic = publicFind.totalDocs === 0 && publicBySlug === null && !draftInPublicList
const adminCanViewDraft = adminFind.totalDocs === 1
const hardDeleteWorks = afterDelete.totalDocs === 0

if (
  !noSoftDeleteFields ||
  !usesDraftPublished ||
  !publicFiltersPublished ||
  !manifestDocumentsCancellation
) {
  console.error('FAIL: soft delete cancellation or draft/published model incomplete')
  process.exit(1)
}

if (!draftHiddenFromPublic || !adminCanViewDraft || !hardDeleteWorks) {
  console.error('FAIL: draft/published behaviour incorrect')
  console.error({ draftHiddenFromPublic, adminCanViewDraft, hardDeleteWorks })
  process.exit(1)
}

const lines = [
  '=== Issue #12 verification ===',
  '',
  'Decision — Soft delete cancelled for MVP',
  `  softDeletedAt / deletedReason / restoredAt fields: absent`,
  `  Payload trash mode: not enabled`,
  `  docs/issues/012 documents cancellation: yes`,
  '',
  'AC — Use article status draft/published instead',
  `  versions.drafts on Articles: yes`,
  `  status field (_status mirror): draft | published`,
  `  draft hidden from public queries: ${draftHiddenFromPublic ? 'yes' : 'no'}`,
  `  admin can view draft (overrideAccess): ${adminCanViewDraft ? 'yes' : 'no'}`,
  `  hard delete (no restore workflow): ${hardDeleteWorks ? 'yes' : 'no'}`,
  `  note: unpublish/re-draft via Payload drafts instead of soft delete restore`,
  '',
  'ALL CHECKS PASSED',
]

console.log(lines.join('\n'))
process.exit(0)
