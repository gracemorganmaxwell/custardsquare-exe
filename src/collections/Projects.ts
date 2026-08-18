import type { CollectionConfig } from 'payload'

import { isAdmin } from '../lib/access'

export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'url', 'published', 'sortOrder', 'updatedAt'],
    description:
      'Live sites in the desktop Projects window. Edit title, URL, summary, story, and favicon here.',
  },
  access: {
    read: ({ req }) => {
      if (req.user) {
        return true
      }

      return {
        published: {
          equals: true,
        },
      }
    },
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'url',
      type: 'text',
      required: true,
      admin: {
        description: 'Public URL. Visit site in the Projects window opens this.',
      },
    },
    {
      name: 'summary',
      type: 'textarea',
      required: true,
      admin: {
        description: 'One-line blurb in the Projects window status bar',
      },
    },
    {
      name: 'story',
      type: 'textarea',
      admin: {
        description: 'Longer story in the Projects window. Blank line between paragraphs.',
      },
    },
    {
      name: 'icon',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description:
          'Favicon or project icon. Leave empty to use the bundled site favicon when we already have one for this URL.',
      },
    },
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        description: 'Lower numbers appear first',
      },
    },
    {
      name: 'published',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description: 'Uncheck to hide from the public Projects window',
      },
    },
  ],
}
