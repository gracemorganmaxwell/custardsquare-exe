'use client'

import { AdminFooterLink } from '@/components/desktop/AdminFooterLink'
import { DesktopShell } from '@/components/desktop/DesktopShell'
import { Win95Titlebar } from '@/components/desktop/Win95Titlebar'
import type { ExplorerArticleItem } from '@/components/desktop/ExplorerWindowBody'
import { useDesktopStore } from '@/lib/desktopStore'
import type { SocialLink } from '@/lib/social-links'

type DesktopExperienceProps = {
  articles: ExplorerArticleItem[]
  siteDescription: string
  siteTitle: string
  socialLinks: SocialLink[]
}

export function DesktopExperience({
  articles,
  siteDescription,
  siteTitle,
  socialLinks,
}: DesktopExperienceProps) {
  const session = useDesktopStore((state) => state.session)
  const enterDesktop = useDesktopStore((state) => state.enterDesktop)

  if (session === 'desktop') {
    return (
      <DesktopShell
        articles={articles}
        siteDescription={siteDescription}
        socialLinks={socialLinks}
      />
    )
  }

  return (
    <main className="login-screen">
      <div className="login-screen__window win95-raised">
        <Win95Titlebar title={siteTitle} />

        <div className="login-screen__body">
          <p className="login-screen__hint">Enter Gracie&apos;s second brain</p>

          <div className="login-screen__actions">
            <button className="win95-button login-screen__start" onClick={() => enterDesktop()} type="button">
              Start
            </button>
          </div>
        </div>
      </div>

      <AdminFooterLink />
    </main>
  )
}
