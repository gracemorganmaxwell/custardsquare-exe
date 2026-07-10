import type { CollectionConfig } from 'payload'

function assertBlobConfiguredForVercelUpload() {
  if (process.env.VERCEL === '1' && !process.env.BLOB_READ_WRITE_TOKEN?.trim()) {
    throw new Error(
      'Media uploads on Vercel require BLOB_READ_WRITE_TOKEN. In the Vercel dashboard: Storage → Blob → Create store → connect to this project → redeploy.',
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
