'use client'

import Link from 'next/link'

import { WinWindow } from '@/components/ui95/WinWindow'

type SocialLink = {
  label: string
  url: string
}

type WelcomeWindowProps = {
  siteDescription: string
  siteTitle: string
  socialLinks: SocialLink[]
}

export function WelcomeWindow({ siteDescription, siteTitle, socialLinks }: WelcomeWindowProps) {
  return (
    <WinWindow className="welcome-window" title={siteTitle}>
      <div className="home__body win95-inset">
        <p className="tagline">{siteDescription}</p>
        <div className="links">
          <Link className="win95-button docs" href="/articles">
            Articles
          </Link>
          {socialLinks.map((link) => (
            <a className="win95-button docs" href={link.url} key={link.url} rel="noopener noreferrer">
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </WinWindow>
  )
}
