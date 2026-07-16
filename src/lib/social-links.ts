export type SocialLink = {
  label: string
  url: string
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
