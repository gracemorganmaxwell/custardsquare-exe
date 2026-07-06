import configPromise from '@payload-config'
import { getPayload } from 'payload'

import type { Article } from '@/payload-types'

export async function getPublishedArticleBySlug(slug: string): Promise<Article | null> {
  const payload = await getPayload({ config: configPromise })

  const { docs } = await payload.find({
    collection: 'articles',
    depth: 1,
    limit: 1,
    where: {
      and: [{ slug: { equals: slug } }, { status: { equals: 'published' } }],
    },
  })

  return docs[0] ?? null
}

export async function getPublishedArticles(limit = 100): Promise<Article[]> {
  const payload = await getPayload({ config: configPromise })

  const { docs } = await payload.find({
    collection: 'articles',
    limit,
    sort: '-publishedAt',
    where: {
      status: {
        equals: 'published',
      },
    },
  })

  return docs
}
