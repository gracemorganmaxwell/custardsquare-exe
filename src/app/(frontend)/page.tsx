import Link from 'next/link'

import { BootScreen } from '@/components/desktop/BootScreen'
import { DesktopShell } from '@/components/desktop/DesktopShell'
import { LoginScreen } from '@/components/desktop/LoginScreen'
import { getSiteSettings } from '@/lib/site-settings'

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
    <BootScreen siteTitle={settings.siteTitle}>
      <LoginScreen siteTitle={settings.siteTitle}>
        <DesktopShell>
          <main className="home desktop-window win95-raised">
            <div className="win95-titlebar">{settings.siteTitle}</div>
            <div className="home__body win95-inset">
              <h1>{settings.siteTitle}</h1>
              <p className="tagline">{settings.siteDescription}</p>
              <p className="status">Desktop icons and windows arrive in the next tickets.</p>
              <div className="links">
                <Link className="win95-button admin" href="/admin">
                  Admin CMS
                </Link>
                <Link className="win95-button docs" href="/articles">
                  Articles
                </Link>
                {socialLinks.map((link) => (
                  <a
                    className="win95-button docs"
                    href={link.url}
                    key={link.url}
                    rel="noopener noreferrer"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </main>
        </DesktopShell>
      </LoginScreen>
    </BootScreen>
  )
}
