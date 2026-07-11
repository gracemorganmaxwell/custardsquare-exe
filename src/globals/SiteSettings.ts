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
      name: 'about',
      type: 'group',
      label: 'About window',
      admin: {
        description: 'Content for the desktop About app. Edit here — no code deploy needed.',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          defaultValue: 'Gracie',
          admin: {
            description: 'Display name in the About window',
          },
        },
        {
          name: 'bio',
          type: 'textarea',
          defaultValue:
            'custardsquare.exe is my public second brain — a dreamy Windows 98 desktop over a real content system. Say hi on LinkedIn.',
          admin: {
            description: 'About blurb under the name',
          },
        },
        {
          name: 'portrait',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description:
              'Portrait image (pixel art works great). Falls back to the bundled brand portrait if empty.',
          },
        },
      ],
    },
    {
      name: 'resume',
      type: 'group',
      label: 'Resume window',
      admin: {
        description:
          'README-style resume for the desktop app. Use headings, bold, links, lists, and code — same Lexical editor as Articles.',
      },
      fields: [
        {
          name: 'body',
          type: 'richText',
          admin: {
            description:
              'Rich resume body (headings, bold, links, lists, code). Leave empty to use the bundled default from gracie-resume-jul26.',
          },
        },
        {
          name: 'pdf',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description:
              'Optional PDF download. Falls back to /brand/gracie-resume-jul26.pdf if empty.',
          },
        },
      ],
    },
    {
      name: 'skills',
      type: 'array',
      label: 'Skills window',
      admin: {
        description: 'Grouped skills for the System Properties-style Skills app.',
      },
      fields: [
        {
          name: 'group',
          type: 'text',
          required: true,
          admin: {
            description: 'Group heading (e.g. Software Development)',
          },
        },
        {
          name: 'items',
          type: 'textarea',
          required: true,
          admin: {
            description: 'Comma-separated or line-separated skill items',
          },
        },
      ],
    },
    {
      name: 'credits',
      type: 'textarea',
      defaultValue:
        'Desktop icons by aconfuseddragon (itch.io).\nWindows 95/98 is a trademark of Microsoft Corporation. custardsquare.exe is an independent fan project and is not affiliated with Microsoft.',
      admin: {
        description:
          'Icon and asset credits. Shown in the Credits window (and optional /credits page).',
      },
    },
  ],
}
