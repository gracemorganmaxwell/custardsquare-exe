import Link from 'next/link'

import { getSiteSettings } from '@/lib/site-settings'

import './styles.css'

export const dynamic = 'force-dynamic'

const FALLBACK_SOCIAL_LINKS = [
  {
    label: 'GitHub',
    url: 'https://github.com/gracemorganmaxwell/custardsquare-exe',
  },
]

export default async function HomePage() {
  const settings = await getSiteSettings()
  const socialLinks =
    settings.socialLinks.length > 0 ? settings.socialLinks : FALLBACK_SOCIAL_LINKS

  return (
    <main className="home">
      <div className="content">
        <p className="boot-line">Starting {settings.siteTitle}...</p>
        <h1>{settings.siteTitle}</h1>
        <p className="tagline">{settings.siteDescription}</p>
        <p className="status">Loading thoughts... Indexing crumbs... Desktop shell coming in M4.</p>
        <div className="links">
          <a className="admin" href="/admin">
            Admin CMS
          </a>
          <a className="docs" href="/articles">
            Articles
          </a>
          {socialLinks.map((link) => (
            <a className="docs" href={link.url} key={link.url} rel="noopener noreferrer">
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </main>
  )
}
