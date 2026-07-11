'use client'

import {
  ExplorerWindowBody,
  type ExplorerArticleItem,
} from '@/components/desktop/ExplorerWindowBody'
import { useDesktopStore } from '@/lib/desktopStore'

type SocialLink = {
  label: string
  url: string
}

type WelcomeWindowBodyProps = {
  siteDescription: string
  socialLinks: SocialLink[]
}

const LINKEDIN_LINK: SocialLink = {
  label: 'LinkedIn',
  url: 'https://www.linkedin.com/in/graciemorgan-maxwell/',
}

function welcomeLinks(socialLinks: SocialLink[]): SocialLink[] {
  const hasLinkedIn = socialLinks.some((link) => /linkedin\.com/i.test(link.url))
  return hasLinkedIn ? socialLinks : [...socialLinks, LINKEDIN_LINK]
}

export function WelcomeWindowBody({ siteDescription, socialLinks }: WelcomeWindowBodyProps) {
  const links = welcomeLinks(socialLinks)
  const openExplorer = useDesktopStore((state) => state.openExplorer)

  return (
    <div className="home__body win95-inset">
      <p className="tagline">{siteDescription}</p>
      <div className="links">
        <button className="win95-button docs" onClick={() => openExplorer('articles')} type="button">
          Articles
        </button>
        {links.map((link) => (
          <a className="win95-button docs" href={link.url} key={link.url} rel="noopener noreferrer">
            {link.label}
          </a>
        ))}
      </div>
    </div>
  )
}

export function AboutWindowBody() {
  return (
    <div className="home__body win95-inset">
      <p className="tagline">
        custardsquare.exe is Gracie&apos;s public second brain — a dreamy Windows 98 desktop over a
        real content system.
      </p>
      <p className="tagline">More About content lands in a later milestone.</p>
    </div>
  )
}

export function ThisComputerWindowBody({ articles }: { articles: ExplorerArticleItem[] }) {
  return <ExplorerWindowBody articles={articles} />
}
