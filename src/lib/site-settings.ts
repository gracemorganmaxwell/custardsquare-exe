import configPromise from '@payload-config'
import { getPayload } from 'payload'

import type { Media, SiteSetting } from '@/payload-types'

export const DEFAULT_SITE_TITLE = 'custardsquare.exe'

export const DEFAULT_SITE_DESCRIPTION =
  "Gracie's public second brain disguised as a dreamy Windows 98 desktop."

export type ResolvedSiteSettings = {
  credits: string | null
  defaultOgImage: Media | null
  favicon: Media | null
  siteDescription: string
  siteTitle: string
  socialLinks: NonNullable<SiteSetting['socialLinks']>
}

export async function getSiteSettings(): Promise<ResolvedSiteSettings> {
  const payload = await getPayload({ config: configPromise })

  const settings = await payload.findGlobal({
    slug: 'site-settings',
    depth: 1,
  })

  return {
    siteTitle: settings?.siteTitle?.trim() || DEFAULT_SITE_TITLE,
    siteDescription: settings?.siteDescription?.trim() || DEFAULT_SITE_DESCRIPTION,
    defaultOgImage: resolveMedia(settings?.defaultOgImage),
    favicon: resolveMedia(settings?.favicon),
    socialLinks: settings?.socialLinks ?? [],
    credits: settings?.credits?.trim() || null,
  }
}

function resolveMedia(media: number | Media | null | undefined): Media | null {
  if (!media || typeof media === 'number') {
    return null
  }

  return media
}
