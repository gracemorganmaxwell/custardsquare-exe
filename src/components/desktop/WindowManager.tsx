'use client'

import {
  AboutWindowBody,
  ThisComputerWindowBody,
  WelcomeWindowBody,
} from '@/components/desktop/windowBodies'
import { WinWindow } from '@/components/ui95/WinWindow'
import type { ExplorerArticleItem } from '@/components/desktop/ExplorerWindowBody'
import {
  getOpenWindows,
  useDesktopStore,
  type DesktopWindowId,
} from '@/lib/desktopStore'

type SocialLink = {
  label: string
  url: string
}

type WindowManagerProps = {
  articles: ExplorerArticleItem[]
  siteDescription: string
  socialLinks: SocialLink[]
}

function renderBody(
  id: DesktopWindowId,
  siteDescription: string,
  socialLinks: SocialLink[],
  articles: ExplorerArticleItem[],
) {
  if (id === 'welcome') {
    return <WelcomeWindowBody siteDescription={siteDescription} socialLinks={socialLinks} />
  }

  if (id === 'about') {
    return <AboutWindowBody />
  }

  return <ThisComputerWindowBody articles={articles} />
}

export function WindowManager({ articles, siteDescription, socialLinks }: WindowManagerProps) {
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
          {renderBody(windowState.id, siteDescription, socialLinks, articles)}
        </WinWindow>
      ))}
    </div>
  )
}
