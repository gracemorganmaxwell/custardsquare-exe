'use client'

import { LINKEDIN_LINK, linkedInUrl, type SocialLink } from '@/lib/social-links'
import type { ResolvedAboutContent } from '@/lib/site-settings'

type AboutWindowProps = {
  about: ResolvedAboutContent
  siteDescription: string
  socialLinks: SocialLink[]
}

export function AboutWindow({ about, siteDescription, socialLinks }: AboutWindowProps) {
  const linkedIn = linkedInUrl(socialLinks)

  return (
    <div className="about-window">
      <div className="about-window__layout">
        <div className="about-window__portrait-wrap win95-inset">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt={about.portraitAlt}
            className="about-window__portrait"
            height={160}
            src={about.portraitSrc}
            width={160}
          />
        </div>

        <div className="about-window__copy">
          <h2 className="about-window__name">{about.name}</h2>
          <p className="about-window__tagline">{siteDescription}</p>
          <p className="about-window__bio">{about.bio}</p>
          <div className="about-window__actions">
            <a
              className="win95-button"
              href={linkedIn}
              rel="noopener noreferrer"
              target="_blank"
            >
              {LINKEDIN_LINK.label}
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
