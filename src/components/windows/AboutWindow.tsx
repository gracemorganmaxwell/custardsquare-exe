'use client'

import { LINKEDIN_LINK, linkedInUrl, type SocialLink } from '@/lib/social-links'

type AboutWindowProps = {
  siteDescription: string
  socialLinks: SocialLink[]
}

export function AboutWindow({ siteDescription, socialLinks }: AboutWindowProps) {
  const linkedIn = linkedInUrl(socialLinks)

  return (
    <div className="about-window">
      <div className="about-window__layout">
        <div className="about-window__portrait-wrap win95-inset">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt="Pixel portrait of Gracie"
            className="about-window__portrait"
            height={160}
            src="/brand/about-portrait.png"
            width={160}
          />
        </div>

        <div className="about-window__copy">
          <h2 className="about-window__name">Gracie</h2>
          <p className="about-window__tagline">{siteDescription}</p>
          <p className="about-window__bio">
            custardsquare.exe is my public second brain — a dreamy Windows 98 desktop over a real
            content system. Say hi on LinkedIn.
          </p>
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
