'use client'

import { AdminFooterLink } from '@/components/desktop/AdminFooterLink'
import { DesktopIconGrid } from '@/components/desktop/DesktopIconGrid'
import { ShutdownDialog } from '@/components/desktop/ShutdownDialog'
import { StartMenu } from '@/components/desktop/StartMenu'
import { Taskbar } from '@/components/desktop/Taskbar'
import { WindowManager } from '@/components/desktop/WindowManager'
import type { ExplorerArticleItem } from '@/components/desktop/ExplorerWindowBody'
import type { ResolvedAboutContent } from '@/lib/site-settings'
import type { SocialLink } from '@/lib/social-links'

type DesktopShellProps = {
  about: ResolvedAboutContent
  articles: ExplorerArticleItem[]
  siteDescription: string
  socialLinks: SocialLink[]
}

export function DesktopShell({ about, articles, siteDescription, socialLinks }: DesktopShellProps) {
  return (
    <div className="desktop-shell">
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
      <section aria-label="Desktop icons" className="desktop-shell__icons">
        <DesktopIconGrid />
      </section>
      <WindowManager
        about={about}
        articles={articles}
        siteDescription={siteDescription}
        socialLinks={socialLinks}
      />
      <StartMenu />
      <Taskbar />
      <ShutdownDialog />
      <AdminFooterLink />
    </div>
  )
}
