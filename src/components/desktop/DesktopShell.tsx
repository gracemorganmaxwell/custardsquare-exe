'use client'

import { useEffect } from 'react'

import { AdminFooterLink } from '@/components/desktop/AdminFooterLink'
import { DesktopIconGrid } from '@/components/desktop/DesktopIconGrid'
import { ShutdownDialog } from '@/components/desktop/ShutdownDialog'
import { StartMenu } from '@/components/desktop/StartMenu'
import { Taskbar } from '@/components/desktop/Taskbar'
import { WindowManager } from '@/components/desktop/WindowManager'
import type { ExplorerArticleItem } from '@/components/desktop/ExplorerWindowBody'
import { useDesktopStore } from '@/lib/desktopStore'
import type { SkillGroup } from '@/lib/default-skills'
import type { ResolvedAboutContent, ResolvedResumeContent } from '@/lib/site-settings'
import type { SocialLink } from '@/lib/social-links'
import { useIsMobileDesktop } from '@/lib/useMediaQuery'

type DesktopShellProps = {
  about: ResolvedAboutContent
  articles: ExplorerArticleItem[]
  credits: string
  resume: ResolvedResumeContent
  siteDescription: string
  skills: SkillGroup[]
  socialLinks: SocialLink[]
}

export function DesktopShell({
  about,
  articles,
  credits,
  resume,
  siteDescription,
  skills,
  socialLinks,
}: DesktopShellProps) {
  const isMobile = useIsMobileDesktop()
  const closeWindow = useDesktopStore((state) => state.closeWindow)

  useEffect(() => {
    if (!isMobile) {
      return
    }

    // App grid is the home screen on mobile — Welcome is still in Start.
    closeWindow('welcome')
  }, [isMobile, closeWindow])

  return (
    <div className={`desktop-shell${isMobile ? ' desktop-shell--mobile' : ''}`}>
      <div aria-hidden="true" className="desktop-shell__wallpaper">
        <div className="desktop-shell__wallpaper-brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt=""
            className="desktop-shell__wallpaper-flag"
            height={100}
            src="/brand/desktop-background.png"
            width={100}
          />
          <p className="desktop-shell__wallpaper-caption">custardsquare OS</p>
        </div>
      </div>
      <div aria-hidden="true" className="desktop-shell__crt" />
      <section aria-label={isMobile ? 'Apps' : 'Desktop icons'} className="desktop-shell__icons">
        <DesktopIconGrid />
      </section>
      <WindowManager
        about={about}
        articles={articles}
        credits={credits}
        resume={resume}
        siteDescription={siteDescription}
        skills={skills}
        socialLinks={socialLinks}
      />
      <StartMenu />
      <Taskbar />
      <ShutdownDialog />
      <AdminFooterLink />
    </div>
  )
}
