import configPromise from '@payload-config'
import { getPayload } from 'payload'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

import { DEFAULT_PROJECTS, type ProjectItem } from '@/lib/default-projects'
import { DEFAULT_RESUME_PDF_HREF } from '@/lib/default-resume'
import {
  buildDefaultResumeLexical,
  isLexicalContentEmpty,
} from '@/lib/default-resume-lexical'
import {
  DEFAULT_CREDITS,
  DEFAULT_SKILL_GROUPS,
  parseSkillItems,
  type SkillGroup,
} from '@/lib/default-skills'
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
  content: SerializedEditorState
  pdfHref: string
}

export type ResolvedSiteSettings = {
  about: ResolvedAboutContent
  credits: string
  defaultOgImage: Media | null
  favicon: Media | null
  resume: ResolvedResumeContent
  siteDescription: string
  siteTitle: string
  skills: SkillGroup[]
  socialLinks: NonNullable<SiteSetting['socialLinks']>
  projects: ProjectItem[]
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
    credits: settings?.credits?.trim() || DEFAULT_CREDITS,
    about: resolveAbout(settings?.about),
    resume: resolveResume(settings?.resume),
    skills: resolveSkills(settings?.skills),
    projects: resolveProjects(settings?.projects),
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
  const content = resume?.body

  return {
    content:
      content && !isLexicalContentEmpty(content) ? content : buildDefaultResumeLexical(),
    pdfHref: resolveMediaUrl(pdf) ?? DEFAULT_RESUME_PDF_HREF,
  }
}

function resolveSkills(skills: SiteSetting['skills'] | undefined): SkillGroup[] {
  if (!skills || skills.length === 0) {
    return DEFAULT_SKILL_GROUPS
  }

  return skills
    .map((entry) => ({
      group: entry.group.trim(),
      items: parseSkillItems(entry.items),
    }))
    .filter((entry) => entry.group.length > 0 && entry.items.length > 0)
}

function resolveProjects(projects: SiteSetting['projects'] | undefined): ProjectItem[] {
  if (!projects || projects.length === 0) {
    return DEFAULT_PROJECTS
  }

  return projects
    .map((entry) => {
      const url = entry.url.trim()
      const bundled = DEFAULT_PROJECTS.find((project) => project.url === url)

      return {
        title: entry.title.trim(),
        url,
        summary: entry.summary.trim(),
        story: entry.story?.trim() || bundled?.story || '',
      }
    })
    .filter((entry) => entry.title.length > 0 && entry.url.length > 0 && entry.summary.length > 0)
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
