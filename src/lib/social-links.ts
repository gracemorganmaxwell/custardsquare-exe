export type SocialLink = {
  label: string
  url: string
}

export const GITHUB_LINK: SocialLink = {
  label: 'GitHub',
  url: 'https://github.com/gracemorganmaxwell/custardsquare-exe',
}

export const LINKEDIN_LINK: SocialLink = {
  label: 'LinkedIn',
  url: 'https://www.linkedin.com/in/graciemorgan-maxwell/',
}

export function withLinkedIn(socialLinks: SocialLink[]): SocialLink[] {
  const hasLinkedIn = socialLinks.some((link) => /linkedin\.com/i.test(link.url))
  return hasLinkedIn ? socialLinks : [...socialLinks, LINKEDIN_LINK]
}

export function linkedInUrl(socialLinks: SocialLink[]): string {
  const match = withLinkedIn(socialLinks).find((link) => /linkedin\.com/i.test(link.url))
  return match?.url ?? LINKEDIN_LINK.url
}

export function githubUrl(socialLinks: SocialLink[]): string {
  const match = socialLinks.find((link) => /github\.com/i.test(link.url))
  return match?.url ?? GITHUB_LINK.url
}
