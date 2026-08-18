import type { Media } from '@/payload-types'
import { getServerURL } from '@/lib/site-url'

export function resolveMediaUrl(media: Media | null): string | undefined {
  const url = media?.url
  if (!url) {
    return undefined
  }

  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }

  const base = getServerURL()
  const path = url.startsWith('/') ? url : `/${url}`
  return `${base}${path}`
}

export function resolveMedia(media: number | Media | null | undefined): Media | null {
  if (!media || typeof media === 'number') {
    return null
  }

  return media
}
