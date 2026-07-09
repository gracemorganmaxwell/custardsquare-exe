import Link from 'next/link'

import { BootScreen } from '@/components/desktop/BootScreen'
import { DesktopShell } from '@/components/desktop/DesktopShell'
import { LoginScreen } from '@/components/desktop/LoginScreen'
import { Win95Titlebar } from '@/components/desktop/Win95Titlebar'
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
          <main className="desktop-window win95-raised">
            <Win95Titlebar title={settings.siteTitle} />
            <div className="home__body win95-inset">
              <p className="tagline">{settings.siteDescription}</p>
              <div className="links">
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
