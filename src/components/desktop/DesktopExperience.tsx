'use client'

import { AdminFooterLink } from '@/components/desktop/AdminFooterLink'
import { DesktopShell } from '@/components/desktop/DesktopShell'
import { Win95Titlebar } from '@/components/desktop/Win95Titlebar'
import type { ExplorerArticleItem } from '@/components/desktop/ExplorerWindowBody'
import { useDesktopStore } from '@/lib/desktopStore'
import type { ResolvedAboutContent, ResolvedResumeContent } from '@/lib/site-settings'
import type { SocialLink } from '@/lib/social-links'

type DesktopExperienceProps = {
  about: ResolvedAboutContent
  articles: ExplorerArticleItem[]
  resume: ResolvedResumeContent
  siteDescription: string
  siteTitle: string
  socialLinks: SocialLink[]
}

export function DesktopExperience({
  about,
  articles,
  resume,
  siteDescription,
  siteTitle,
  socialLinks,
}: DesktopExperienceProps) {
  const session = useDesktopStore((state) => state.session)
  const enterDesktop = useDesktopStore((state) => state.enterDesktop)

  if (session === 'desktop') {
    return (
      <DesktopShell
        about={about}
        articles={articles}
        resume={resume}
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
