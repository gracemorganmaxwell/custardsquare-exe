import type { GlobalConfig } from 'payload'

import { isAdmin } from '../lib/access'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  admin: {
    description: 'Site-wide title, images, links, and credits. Only you edit this.',
  },
  access: {
    read: () => true,
    update: isAdmin,
  },
  fields: [
    {
      name: 'siteTitle',
      type: 'text',
      required: true,
      defaultValue: 'custardsquare.exe',
      admin: {
        description: 'Browser tab title and site name',
      },
    },
    {
      name: 'siteDescription',
      type: 'textarea',
      required: true,
      defaultValue:
        "Gracie's public second brain disguised as a dreamy Windows 98 desktop.",
      admin: {
        description: 'Default meta description for pages without their own',
      },
    },
    {
      name: 'defaultOgImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Fallback social share image when a page has no OG image',
      },
    },
    {
      name: 'favicon',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Browser tab icon — square PNG recommended',
      },
    },
    {
      name: 'socialLinks',
      type: 'array',
      admin: {
        description: 'Links shown on the homepage (GitHub, etc.)',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'credits',
      type: 'textarea',
      admin: {
        description:
          'Icon and asset credits (e.g. aconfuseddragon on itch.io). Shown in Credits window later.',
      },
    },
  ],
}
