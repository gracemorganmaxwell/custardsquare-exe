'use client'

import { AdminFooterLink } from '@/components/desktop/AdminFooterLink'
import { BootScreen } from '@/components/desktop/BootScreen'
import { DesktopShell } from '@/components/desktop/DesktopShell'
import { Win95Titlebar } from '@/components/desktop/Win95Titlebar'
import type { ExplorerArticleItem } from '@/components/desktop/ExplorerWindowBody'
import { useDesktopStore } from '@/lib/desktopStore'
import type { SkillGroup } from '@/lib/default-skills'
import type { ResolvedAboutContent, ResolvedResumeContent } from '@/lib/site-settings'
import type { SocialLink } from '@/lib/social-links'

type DesktopExperienceProps = {
  about: ResolvedAboutContent
  articles: ExplorerArticleItem[]
  credits: string
  resume: ResolvedResumeContent
  siteDescription: string
  siteTitle: string
  skills: SkillGroup[]
  socialLinks: SocialLink[]
}

export function DesktopExperience({
  about,
  articles,
  credits,
  resume,
  siteDescription,
  siteTitle,
  skills,
  socialLinks,
}: DesktopExperienceProps) {
  const session = useDesktopStore((state) => state.session)
  const bootGeneration = useDesktopStore((state) => state.bootGeneration)
  const enterDesktop = useDesktopStore((state) => state.enterDesktop)

  if (session === 'boot') {
    return <BootScreen key={bootGeneration} siteTitle={siteTitle} />
  }

  if (session === 'desktop') {
    return (
      <DesktopShell
        about={about}
        articles={articles}
        credits={credits}
        resume={resume}
        siteDescription={siteDescription}
        skills={skills}
        socialLinks={socialLinks}
      />
    )
  }

  return (
    <main className="login-screen">
      <div className="login-screen__window win95-raised">
        <Win95Titlebar title={`${siteTitle} — custardsquare OS`} />

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
