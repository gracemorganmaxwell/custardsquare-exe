'use client'

import {
  ThisComputerWindowBody,
  WelcomeWindowBody,
} from '@/components/desktop/windowBodies'
import type { ExplorerArticleItem } from '@/components/desktop/ExplorerWindowBody'
import { AboutWindow } from '@/components/windows/AboutWindow'
import { ArticlesWindow } from '@/components/windows/ArticlesWindow'
import { ResumeWindow } from '@/components/windows/ResumeWindow'
import { WinWindow } from '@/components/ui95/WinWindow'
import {
  getOpenWindows,
  useDesktopStore,
  type DesktopWindowId,
} from '@/lib/desktopStore'
import type { ResolvedAboutContent, ResolvedResumeContent } from '@/lib/site-settings'
import type { SocialLink } from '@/lib/social-links'

type WindowManagerProps = {
  about: ResolvedAboutContent
  articles: ExplorerArticleItem[]
  resume: ResolvedResumeContent
  siteDescription: string
  socialLinks: SocialLink[]
}

function renderBody(
  id: DesktopWindowId,
  about: ResolvedAboutContent,
  resume: ResolvedResumeContent,
  siteDescription: string,
  socialLinks: SocialLink[],
  articles: ExplorerArticleItem[],
) {
  if (id === 'welcome') {
    return <WelcomeWindowBody siteDescription={siteDescription} socialLinks={socialLinks} />
  }

  if (id === 'about') {
    return (
      <AboutWindow about={about} siteDescription={siteDescription} socialLinks={socialLinks} />
    )
  }

  if (id === 'articles') {
    return <ArticlesWindow articles={articles} />
  }

  if (id === 'resume') {
    return <ResumeWindow resume={resume} />
  }

  return <ThisComputerWindowBody articles={articles} />
}

export function WindowManager({
  about,
  articles,
  resume,
  siteDescription,
  socialLinks,
}: WindowManagerProps) {
  const windows = useDesktopStore((state) => state.windows)
  const focusedWindowId = useDesktopStore((state) => state.focusedWindowId)
  const closeWindow = useDesktopStore((state) => state.closeWindow)
  const focusWindow = useDesktopStore((state) => state.focusWindow)
  const minimizeWindow = useDesktopStore((state) => state.minimizeWindow)
  const setWindowPosition = useDesktopStore((state) => state.setWindowPosition)

  return (
    <div className="desktop-shell__windows">
      {getOpenWindows(windows).map((windowState) => (
        <WinWindow
          active={focusedWindowId === windowState.id}
          className={
            windowState.id === 'welcome'
              ? 'welcome-window'
              : windowState.id === 'this-computer'
                ? 'explorer-window'
                : windowState.id === 'articles'
                  ? 'articles-app-window'
                  : windowState.id === 'about'
                    ? 'about-app-window'
                    : windowState.id === 'resume'
                      ? 'resume-app-window'
                      : undefined
          }
          hidden={windowState.minimized}
          initialPosition={windowState.position}
          key={windowState.id}
          onClose={() => closeWindow(windowState.id)}
          onFocus={() => focusWindow(windowState.id)}
          onMinimize={() => minimizeWindow(windowState.id)}
          onPositionChange={(position) => setWindowPosition(windowState.id, position)}
          title={windowState.title}
          zIndex={windowState.zIndex}
        >
          {renderBody(
            windowState.id,
            about,
            resume,
            siteDescription,
            socialLinks,
            articles,
          )}
        </WinWindow>
      ))}
    </div>
  )
}
