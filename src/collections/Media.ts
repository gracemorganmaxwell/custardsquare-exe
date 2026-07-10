import type { CollectionConfig } from 'payload'
import { APIError } from 'payload'

function assertBlobConfiguredForVercelUpload() {
  if (process.env.VERCEL === '1' && !process.env.BLOB_READ_WRITE_TOKEN?.trim()) {
    throw new APIError(
      'Media uploads on Vercel require BLOB_READ_WRITE_TOKEN. Vercel → Project → Settings → Environment Variables → add token for Production + Preview → redeploy. Check /api/media-storage-health',
      503,
    )
  }
}

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  hooks: {
    beforeValidate: [
      ({ operation }) => {
        if (operation === 'create' || operation === 'update') {
          assertBlobConfiguredForVercelUpload()
        }
      },
    ],
  },
  fields: [
    {
      name: 'altText',
      type: 'text',
      required: true,
      label: 'Alt text',
    },
    {
      name: 'caption',
      type: 'text',
    },
    {
      name: 'credit',
      type: 'text',
    },
    {
      name: 'sourceUrl',
      type: 'text',
    },
  ],
  upload: true,
}
