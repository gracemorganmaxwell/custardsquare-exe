import type { Metadata } from 'next'

import type { Article, Media } from '@/payload-types'

import {
  DEFAULT_SITE_DESCRIPTION,
  DEFAULT_SITE_TITLE,
  type ResolvedSiteSettings,
} from './site-settings'
import { getServerURL } from './site-url'

export const SITE_NAME = DEFAULT_SITE_TITLE

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
  siteName?: string
  type?: 'article' | 'website'
}

export function buildPageMetadata({
  canonicalPath,
  description,
  ogImage,
  pageTitle,
  publishedAt,
  shareTitle,
  siteName = SITE_NAME,
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
      siteName,
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

const DEFAULT_FRONTEND_FAVICON = '/brand/custardsq-favicon.png'

export function buildRootMetadata(settings: ResolvedSiteSettings): Metadata {
  const faviconUrl = getMediaUrl(settings.favicon) ?? DEFAULT_FRONTEND_FAVICON

  return {
    ...buildPageMetadata({
      canonicalPath: '/',
      description: settings.siteDescription,
      ogImage: settings.defaultOgImage,
      pageTitle: {
        default: settings.siteTitle,
        template: `%s | ${settings.siteTitle}`,
      },
      shareTitle: settings.siteTitle,
      siteName: settings.siteTitle,
    }),
    description: settings.siteDescription,
    // Set after page metadata so icons are never overwritten; include type/sizes for browser pickup
    icons: {
      apple: [{ type: 'image/png', url: faviconUrl }],
      icon: [
        { sizes: 'any', url: '/favicon.ico' },
        { sizes: '32x32', type: 'image/png', url: '/favicon-32.png' },
        { sizes: '50x50', type: 'image/png', url: faviconUrl },
      ],
      shortcut: '/favicon.ico',
    },
    metadataBase: new URL(getServerURL()),
  }
}

export function buildArticleMetadata(
  article: Article,
  settings: ResolvedSiteSettings,
): Metadata {
  const siteTitle = settings.siteTitle
  const description = article.seoDescription?.trim() || article.excerpt
  const shareImage = article.ogImage ?? article.coverImage ?? settings.defaultOgImage
  const seoTitle = article.seoTitle?.trim()
  const shareTitle = seoTitle || `${article.title} | ${siteTitle}`
  const pageTitle = seoTitle ? { absolute: seoTitle } : article.title

  return buildPageMetadata({
    canonicalPath: `/articles/${article.slug}`,
    description,
    ogImage: shareImage,
    pageTitle,
    publishedAt: article.publishedAt,
    shareTitle,
    siteName: siteTitle,
    type: 'article',
  })
}

export function buildArticlesIndexMetadata(settings: ResolvedSiteSettings): Metadata {
  const siteTitle = settings.siteTitle
  const shareTitle = `Articles | ${siteTitle}`

  return buildPageMetadata({
    canonicalPath: '/articles',
    description: settings.siteDescription || DEFAULT_SITE_DESCRIPTION,
    ogImage: settings.defaultOgImage,
    pageTitle: 'Articles',
    shareTitle,
    siteName: siteTitle,
  })
}
