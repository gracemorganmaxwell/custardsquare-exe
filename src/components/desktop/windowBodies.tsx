'use client'

import {
  ExplorerWindowBody,
  type ExplorerArticleItem,
} from '@/components/desktop/ExplorerWindowBody'
import { useDesktopStore } from '@/lib/desktopStore'
import { withLinkedIn, type SocialLink } from '@/lib/social-links'

type WelcomeWindowBodyProps = {
  siteDescription: string
  socialLinks: SocialLink[]
}

export function WelcomeWindowBody({ siteDescription, socialLinks }: WelcomeWindowBodyProps) {
  const links = withLinkedIn(socialLinks)
  const openWindow = useDesktopStore((state) => state.openWindow)

  return (
    <div className="home__body win95-inset">
      <p className="tagline">{siteDescription}</p>
      <div className="links">
        <button
          className="win95-button docs"
          onClick={() => openWindow('articles', 'Articles')}
          type="button"
        >
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

export function ThisComputerWindowBody({ articles }: { articles: ExplorerArticleItem[] }) {
  return <ExplorerWindowBody articles={articles} />
}
