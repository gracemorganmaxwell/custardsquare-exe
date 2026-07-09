import type { MetadataRoute } from 'next'

import { getPublishedArticles } from '@/lib/articles'
import { getAbsoluteUrl } from '@/lib/seo'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getPublishedArticles(500)

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      changeFrequency: 'weekly',
      lastModified: new Date(),
      priority: 1,
      url: getAbsoluteUrl('/'),
    },
    {
      changeFrequency: 'daily',
      lastModified: new Date(),
      priority: 0.9,
      url: getAbsoluteUrl('/articles'),
    },
  ]

  const articleRoutes: MetadataRoute.Sitemap = articles.map((article) => ({
    changeFrequency: 'monthly',
    lastModified: article.updatedAt || article.publishedAt || undefined,
    priority: 0.8,
    url: getAbsoluteUrl(`/articles/${article.slug}`),
  }))

  return [...staticRoutes, ...articleRoutes]
}
