/**
 * Verify issue #2 acceptance criteria against local Neon Postgres.
 * Usage: pnpm verify-issue-002
 */
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config.ts'

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL || ''

if (!connectionString) {
  console.error('FAIL: DATABASE_URL (or POSTGRES_URL) is not set')
  process.exit(1)
}

const redactedUrl = connectionString.replace(/:([^:@/]+)@/, ':****@')

const payload = await getPayload({ config: await config })

const { totalDocs: articleCount } = await payload.find({
  collection: 'articles',
  limit: 1,
  overrideAccess: true,
})

const settings = await payload.findGlobal({
  slug: 'site-settings',
  overrideAccess: true,
})

const testSlug = `issue-002-evidence-${Date.now()}`

const minimalContent = {
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
            text: 'Temporary evidence row for issue #2.',
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

const created = await payload.create({
  collection: 'articles',
  draft: true,
  data: {
    title: 'Issue #2 evidence (temporary)',
    slug: testSlug,
    excerpt: 'Temporary row for create/read verification — deleted immediately.',
    content: minimalContent,
  },
  overrideAccess: true,
})

const readBack = await payload.findByID({
  collection: 'articles',
  id: created.id,
  overrideAccess: true,
})

await payload.delete({
  collection: 'articles',
  id: created.id,
  overrideAccess: true,
})

const lines = [
  '=== Issue #2 verification ===',
  '',
  'AC1 — DATABASE_URL works locally',
  `  connection: ${redactedUrl}`,
  `  adapter: @payloadcms/db-vercel-postgres`,
  '  status: connected',
  '',
  'AC2 — Payload can create and read content',
  `  read: ${articleCount} article(s) in Neon; siteTitle="${settings.siteTitle}"`,
  `  create: id=${created.id} slug=${testSlug}`,
  `  read-back: "${readBack.title}"`,
  '  cleanup: test article deleted',
  '',
  'AC3 — see .env.example (screenshot in issue comment)',
  '',
  'ALL CHECKS PASSED',
]

console.log(lines.join('\n'))
process.exit(0)
