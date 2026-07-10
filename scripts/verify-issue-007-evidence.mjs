/**
 * Verify issue #7 acceptance criteria for Articles collection.
 * Usage: pnpm verify-issue-007
 */
import 'dotenv/config'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getPayload } from 'payload'
import config from '../src/payload.config.ts'
import { slugify } from '../src/lib/slugify.ts'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const articlesSource = readFileSync(path.join(root, 'src/collections/Articles.ts'), 'utf8')
const slugifySource = readFileSync(path.join(root, 'src/lib/slugify.ts'), 'utf8')

const hasVersions =
  articlesSource.includes('versions:') &&
  articlesSource.includes('drafts:') &&
  articlesSource.includes('autosave: true')
const hasSlugHook =
  articlesSource.includes('beforeValidate') && articlesSource.includes('slugify(data.title)')

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

const payload = await getPayload({ config: await config })

const legacyArticles = await payload.find({
  collection: 'articles',
  limit: 100,
  overrideAccess: true,
})

for (const article of legacyArticles.docs) {
  if (article.status === 'published' && article._status !== 'published') {
    await payload.update({
      collection: 'articles',
      id: article.id,
      data: {
        _status: 'published',
      },
      overrideAccess: true,
    })
  }

  if (article.status === 'draft' && !article._status) {
    await payload.update({
      collection: 'articles',
      id: article.id,
      data: {
        _status: 'draft',
      },
      overrideAccess: true,
    })
  }
}

const testTitle = `Issue 7 Evidence ${Date.now()}`
const expectedSlug = slugify(testTitle)

const draft = await payload.create({
  collection: 'articles',
  draft: true,
  data: {
    title: testTitle,
    excerpt: 'Temporary draft for issue #7 verification.',
    content: minimalContent('Draft body for issue #7.'),
  },
  overrideAccess: true,
})

const draftSaved =
  draft._status === 'draft' &&
  draft.slug === expectedSlug &&
  draft.status === 'draft'

const updatedDraft = await payload.update({
  collection: 'articles',
  id: draft.id,
  draft: true,
  data: {
    excerpt: 'Updated draft excerpt for version history.',
  },
  overrideAccess: true,
})

const { totalDocs: versionCountAfterDraft } = await payload.findVersions({
  collection: 'articles',
  where: {
    parent: {
      equals: draft.id,
    },
  },
  overrideAccess: true,
})

const published = await payload.update({
  collection: 'articles',
  id: draft.id,
  data: {
    _status: 'published',
  },
  overrideAccess: true,
})

const publishedOk =
  published._status === 'published' &&
  published.status === 'published' &&
  Boolean(published.publishedAt)

const { totalDocs: versionCountAfterPublish } = await payload.findVersions({
  collection: 'articles',
  where: {
    parent: {
      equals: draft.id,
    },
  },
  overrideAccess: true,
})

await payload.delete({
  collection: 'articles',
  id: draft.id,
  overrideAccess: true,
})

if (!hasVersions || !hasSlugHook) {
  console.error('FAIL: Articles collection missing versions/drafts/autosave or slug hook')
  process.exit(1)
}

if (!draftSaved) {
  console.error('FAIL: draft article was not saved with expected slug/status')
  console.error({ draft })
  process.exit(1)
}

if (!publishedOk) {
  console.error('FAIL: article did not publish correctly')
  console.error({ published })
  process.exit(1)
}

if (versionCountAfterDraft < 1 || versionCountAfterPublish < 2) {
  console.error(
    `FAIL: expected versions on save (draft=${versionCountAfterDraft}, publish=${versionCountAfterPublish})`,
  )
  process.exit(1)
}

const lines = [
  '=== Issue #7 verification ===',
  '',
  'AC1 — Admin can create and save draft article',
  `  payload.create({ draft: true }): id=${draft.id}`,
  `  _status: ${updatedDraft._status}`,
  `  slug: ${updatedDraft.slug}`,
  '',
  'AC2 — Admin can publish article',
  `  update _status → published: yes`,
  `  publishedAt set: ${published.publishedAt ?? 'no'}`,
  `  legacy status field synced: ${published.status}`,
  '',
  'AC3 — Versions are created on save',
  `  versions after draft saves: ${versionCountAfterDraft}`,
  `  versions after publish: ${versionCountAfterPublish}`,
  `  versions.drafts.autosave enabled: yes`,
  '',
  'AC4 — Slug auto-generated from title',
  `  title: "${testTitle}"`,
  `  slug: "${expectedSlug}"`,
  `  slugify.ts: ${slugifySource.includes('export function slugify') ? 'present' : 'missing'}`,
  '',
  'ALL CHECKS PASSED',
]

console.log(lines.join('\n'))
process.exit(0)
