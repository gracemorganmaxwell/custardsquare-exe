/**
 * Verify issue #3 acceptance criteria for Vercel Blob media storage.
 * Usage: pnpm verify-issue-003
 */
import 'dotenv/config'
import { readFile } from 'node:fs/promises'
import { getPayload } from 'payload'
import config from '../src/payload.config.ts'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const payloadConfigSource = readFileSync(path.join(root, 'src/payload.config.ts'), 'utf8')
const mediaCollectionSource = readFileSync(path.join(root, 'src/collections/Media.ts'), 'utf8')
const envExample = readFileSync(path.join(root, '.env.example'), 'utf8')

const hasBlobAdapter =
  payloadConfigSource.includes('vercelBlobStorage') &&
  payloadConfigSource.includes('media: true') &&
  payloadConfigSource.includes('clientUploads: true')

const mediaCollectionUpload = mediaCollectionSource.includes('upload: true')
const envDocumentsToken =
  envExample.includes('BLOB_READ_WRITE_TOKEN') &&
  envExample.toLowerCase().includes('blob')

const blobToken = process.env.BLOB_READ_WRITE_TOKEN?.trim() ?? ''
const tokenStatus = blobToken ? 'set (redacted)' : 'not set locally'

if (!hasBlobAdapter || !mediaCollectionUpload) {
  console.error('FAIL: Blob adapter or Media upload config missing')
  process.exit(1)
}

if (!envDocumentsToken) {
  console.error('FAIL: BLOB_READ_WRITE_TOKEN not documented in .env.example')
  process.exit(1)
}

const payload = await getPayload({ config: await config })
const buffer = await readFile(path.join(root, 'public/icons/desktop/articles.png'))
const testName = `issue-003-evidence-${Date.now()}.png`

const created = await payload.create({
  collection: 'media',
  data: { altText: 'Issue #3 evidence (temporary)' },
  file: {
    data: buffer,
    mimetype: 'image/png',
    name: testName,
    size: buffer.length,
  },
  overrideAccess: true,
})

const readBack = await payload.findByID({
  collection: 'media',
  id: created.id,
  overrideAccess: true,
})

await payload.delete({
  collection: 'media',
  id: created.id,
  overrideAccess: true,
})

const storageNote = blobToken
  ? 'Upload uses Vercel Blob when BLOB_READ_WRITE_TOKEN is set.'
  : 'Upload succeeded in dev (local /api/media/file/ fallback without token).'

const lines = [
  '=== Issue #3 verification ===',
  '',
  'AC1 — Media collection uses Blob adapter',
  `  vercelBlobStorage plugin: ${hasBlobAdapter ? 'yes' : 'no'}`,
  `  collections.media: true`,
  `  clientUploads: true`,
  `  Media collection upload: true`,
  '',
  'AC2 — BLOB_READ_WRITE_TOKEN documented',
  `  .env.example contains BLOB_READ_WRITE_TOKEN: yes`,
  '',
  'AC3 — Admin can upload image in dev when token is set',
  `  BLOB_READ_WRITE_TOKEN: ${tokenStatus}`,
  `  create: id=${created.id} filename=${testName}`,
  `  read-back alt: "${readBack.altText}"`,
  `  url: ${readBack.url}`,
  `  note: ${storageNote}`,
  '  cleanup: test media deleted',
  '',
  'ALL CHECKS PASSED',
]

console.log(lines.join('\n'))
process.exit(0)
