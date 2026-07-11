import configPromise from '@payload-config'
import { getPayload } from 'payload'

import {
  DEFAULT_RESUME_BODY,
  DEFAULT_RESUME_PDF_HREF,
} from '@/lib/default-resume'
import type { Media, SiteSetting } from '@/payload-types'
import { getServerURL } from '@/lib/site-url'

export const DEFAULT_SITE_TITLE = 'custardsquare.exe'

export const DEFAULT_SITE_DESCRIPTION =
  "Gracie's public second brain disguised as a dreamy Windows 98 desktop."

export const DEFAULT_ABOUT_NAME = 'Gracie'

export const DEFAULT_ABOUT_BIO =
  'custardsquare.exe is my public second brain — a dreamy Windows 98 desktop over a real content system. Say hi on LinkedIn.'

export const DEFAULT_ABOUT_PORTRAIT_SRC = '/brand/about-portrait.png'

export type ResolvedAboutContent = {
  bio: string
  name: string
  portraitAlt: string
  portraitSrc: string
}

export type ResolvedResumeContent = {
  body: string
  pdfHref: string
}

export type ResolvedSiteSettings = {
  about: ResolvedAboutContent
  credits: string | null
  defaultOgImage: Media | null
  favicon: Media | null
  resume: ResolvedResumeContent
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
    about: resolveAbout(settings?.about),
    resume: resolveResume(settings?.resume),
  }
}

function resolveAbout(about: SiteSetting['about'] | undefined): ResolvedAboutContent {
  const portrait = resolveMedia(about?.portrait)
  const name = about?.name?.trim() || DEFAULT_ABOUT_NAME
  const alt = portrait?.altText?.trim()

  return {
    name,
    bio: about?.bio?.trim() || DEFAULT_ABOUT_BIO,
    portraitSrc: resolveMediaUrl(portrait) ?? DEFAULT_ABOUT_PORTRAIT_SRC,
    portraitAlt: alt && alt.length > 0 ? alt : `Portrait of ${name}`,
  }
}

function resolveResume(resume: SiteSetting['resume'] | undefined): ResolvedResumeContent {
  const pdf = resolveMedia(resume?.pdf)

  return {
    body: resume?.body?.trim() || DEFAULT_RESUME_BODY,
    pdfHref: resolveMediaUrl(pdf) ?? DEFAULT_RESUME_PDF_HREF,
  }
}

function resolveMediaUrl(media: Media | null): string | undefined {
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

function resolveMedia(media: number | Media | null | undefined): Media | null {
  if (!media || typeof media === 'number') {
    return null
  }

  return media
}
