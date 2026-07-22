'use client'

import {
  ThisComputerWindowBody,
  WelcomeWindowBody,
} from '@/components/desktop/windowBodies'
import type { ExplorerArticleItem } from '@/components/desktop/ExplorerWindowBody'
import { AboutWindow } from '@/components/windows/AboutWindow'
import { ArticlesWindow } from '@/components/windows/ArticlesWindow'
import { ComingSoonWindow } from '@/components/windows/ComingSoonWindow'
import { CreditsWindow } from '@/components/windows/CreditsWindow'
import { ProjectsWindow } from '@/components/windows/ProjectsWindow'
import { ResumeWindow } from '@/components/windows/ResumeWindow'
import { SkillsWindow } from '@/components/windows/SkillsWindow'
import { TerminalWindow } from '@/components/windows/TerminalWindow'
import { WinWindow } from '@/components/ui95/WinWindow'
import {
  getOpenWindows,
  useDesktopStore,
  type DesktopWindowId,
} from '@/lib/desktopStore'
import type { SkillGroup } from '@/lib/default-skills'
import type { ResolvedAboutContent, ResolvedResumeContent } from '@/lib/site-settings'
import type { SocialLink } from '@/lib/social-links'

type WindowManagerProps = {
  about: ResolvedAboutContent
  articles: ExplorerArticleItem[]
  credits: string
  resume: ResolvedResumeContent
  siteDescription: string
  skills: SkillGroup[]
  socialLinks: SocialLink[]
}

function windowClassName(id: DesktopWindowId): string | undefined {
  if (id === 'welcome') return 'welcome-window'
  if (id === 'this-computer') return 'explorer-window'
  if (id === 'articles') return 'articles-app-window'
  if (id === 'about') return 'about-app-window'
  if (id === 'resume') return 'resume-app-window'
  if (id === 'skills') return 'skills-app-window'
  if (id === 'credits') return 'credits-app-window'
  if (id === 'notes') return 'coming-soon-app-window'
  if (id === 'projects') return 'projects-app-window'
  if (id === 'terminal') return 'terminal-app-window'
  return undefined
}

function renderBody(
  id: DesktopWindowId,
  about: ResolvedAboutContent,
  resume: ResolvedResumeContent,
  skills: SkillGroup[],
  credits: string,
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

  if (id === 'skills') {
    return <SkillsWindow groups={skills} />
  }

  if (id === 'credits') {
    return <CreditsWindow credits={credits} />
  }

  if (id === 'notes') {
    return (
      <ComingSoonWindow
        appName="Notes"
        blurb="Sticky thoughts and crumbs will land here when the Notes collection ships."
      />
    )
  }

  if (id === 'projects') {
    return <ProjectsWindow />
  }

  if (id === 'terminal') {
    return <TerminalWindow />
  }

  return <ThisComputerWindowBody articles={articles} />
}

export function WindowManager({
  about,
  articles,
  credits,
  resume,
  siteDescription,
  skills,
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
          className={windowClassName(windowState.id)}
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
            skills,
            credits,
            siteDescription,
            socialLinks,
            articles,
          )}
        </WinWindow>
      ))}
    </div>
  )
}
