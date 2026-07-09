import type { MetadataRoute } from 'next'

import { getServerURL } from '@/lib/site-url'

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getServerURL()

  if (process.env.VERCEL_ENV === 'preview') {
    return {
      rules: {
        disallow: '/',
        userAgent: '*',
      },
    }
  }

  return {
    rules: {
      allow: '/',
      disallow: ['/admin/', '/api/'],
      userAgent: '*',
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
