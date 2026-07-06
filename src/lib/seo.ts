import type { Metadata } from 'next'

import type { Article, Media } from '@/payload-types'

import { getServerURL } from './site-url'

export const SITE_NAME = 'custardsquare.exe'

type MediaRef = number | Media | null | undefined

export function getAbsoluteUrl(path: string): string {
  const base = getServerURL()
  const normalizedPath = path.startsWith('/') ? path : `/${path}`

  return `${base}${normalizedPath}`
}

function resolveMedia(media: MediaRef): Media | null {
  if (!media || typeof media === 'number') {
    return null
  }

  return media
}

export function getMediaUrl(media: MediaRef): string | undefined {
  const resolved = resolveMedia(media)
  const url = resolved?.url

  if (!url) {
    return undefined
  }

  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }

  return getAbsoluteUrl(url)
}

export function getMediaAlt(media: MediaRef, fallback: string): string {
  const resolved = resolveMedia(media)

  if (resolved?.altText && resolved.altText.trim().length > 0) {
    return resolved.altText
  }

  return fallback
}

type PageMetadataInput = {
  canonicalPath: string
  description: string
  ogImage?: MediaRef
  pageTitle: Metadata['title']
  publishedAt?: string | null
  shareTitle: string
  type?: 'article' | 'website'
}

export function buildPageMetadata({
  canonicalPath,
  description,
  ogImage,
  pageTitle,
  publishedAt,
  shareTitle,
  type = 'website',
}: PageMetadataInput): Metadata {
  const canonical = getAbsoluteUrl(canonicalPath)
  const imageUrl = getMediaUrl(ogImage)
  const images = imageUrl
    ? [
        {
          alt: getMediaAlt(ogImage, shareTitle),
          height: resolveMedia(ogImage)?.height ?? undefined,
          url: imageUrl,
          width: resolveMedia(ogImage)?.width ?? undefined,
        },
      ]
    : undefined

  return {
    alternates: {
      canonical,
    },
    description,
    openGraph: {
      description,
      images,
      locale: 'en_NZ',
      siteName: SITE_NAME,
      title: shareTitle,
      type,
      url: canonical,
      ...(type === 'article' && publishedAt ? { publishedTime: publishedAt } : {}),
    },
    title: pageTitle,
    twitter: {
      card: imageUrl ? 'summary_large_image' : 'summary',
      description,
      images: imageUrl ? [imageUrl] : undefined,
      title: shareTitle,
    },
  }
}

export function buildArticleMetadata(article: Article): Metadata {
  const description = article.seoDescription?.trim() || article.excerpt
  const shareImage = article.ogImage ?? article.coverImage
  const seoTitle = article.seoTitle?.trim()
  const shareTitle = seoTitle || `${article.title} | ${SITE_NAME}`
  const pageTitle = seoTitle ? { absolute: seoTitle } : article.title

  return buildPageMetadata({
    canonicalPath: `/articles/${article.slug}`,
    description,
    ogImage: shareImage,
    pageTitle,
    publishedAt: article.publishedAt,
    shareTitle,
    type: 'article',
  })
}

export function buildArticlesIndexMetadata(): Metadata {
  const shareTitle = `Articles | ${SITE_NAME}`

  return buildPageMetadata({
    canonicalPath: '/articles',
    description: 'Learnings, notes, and write-ups from Grace.',
    pageTitle: 'Articles',
    shareTitle,
  })
}
