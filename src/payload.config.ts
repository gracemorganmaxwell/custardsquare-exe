import { vercelPostgresAdapter } from '@payloadcms/db-vercel-postgres'
import {
  BlocksFeature,
  CodeBlock,
  FixedToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Articles } from './collections/Articles'
import { SiteSettings } from './globals/SiteSettings'
import { getServerURL, getTrustedOrigins } from './lib/site-url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const trustedOrigins = getTrustedOrigins()
const blobToken = process.env.BLOB_READ_WRITE_TOKEN?.trim() ?? ''

export default buildConfig({
  serverURL: getServerURL(),
  csrf: trustedOrigins,
  cors: trustedOrigins,
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      icons: {
        apple: [{ type: 'image/png', url: '/brand/cms-favicon.png' }],
        icon: [
          { sizes: 'any', url: '/admin-favicon.ico' },
          { sizes: '32x32', type: 'image/png', url: '/admin-favicon-32.png' },
          { sizes: '50x50', type: 'image/png', url: '/brand/cms-favicon.png' },
        ],
        shortcut: '/admin-favicon.ico',
      },
      titleSuffix: ' — custardsquare.exe',
    },
  },
  collections: [Users, Media, Articles],
  globals: [SiteSettings],
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures,
      FixedToolbarFeature(),
      BlocksFeature({
        blocks: [CodeBlock()],
      }),
    ],
  }),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: vercelPostgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL || '',
    },
  }),
  sharp,
  plugins: [
    vercelBlobStorage({
      collections: {
        media: {
          disablePayloadAccessControl: true,
        },
      },
      token: blobToken,
      clientUploads: true,
      enabled: Boolean(blobToken),
    }),
  ],
})
