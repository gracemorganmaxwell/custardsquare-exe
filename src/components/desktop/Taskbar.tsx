'use client'

import { useEffect, useState } from 'react'

import { useDesktopStore } from '@/lib/desktopStore'

function formatClock(date: Date) {
  return new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

export function Taskbar() {
  const windows = useDesktopStore((state) => state.windows)
  const focusedWindowId = useDesktopStore((state) => state.focusedWindowId)
  const startMenuOpen = useDesktopStore((state) => state.startMenuOpen)
  const restoreWindow = useDesktopStore((state) => state.restoreWindow)
  const focusWindow = useDesktopStore((state) => state.focusWindow)
  const toggleStartMenu = useDesktopStore((state) => state.toggleStartMenu)
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30_000)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <footer className="taskbar win95-raised">
      <button
        aria-expanded={startMenuOpen}
        aria-haspopup="menu"
        className={`taskbar__start win95-button${startMenuOpen ? ' taskbar__start--active' : ''}`}
        onClick={() => toggleStartMenu()}
        type="button"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt="" className="taskbar__start-icon" height={16} src="/brand/custardsq-favicon.svg" width={16} />
        Start
      </button>

      <div aria-label="Open windows" className="taskbar__windows" role="toolbar">
        {windows.map((windowState) => {
          const isActive = focusedWindowId === windowState.id && !windowState.minimized
          return (
            <button
              aria-pressed={isActive}
              className={`taskbar__window-button win95-button${isActive ? ' taskbar__window-button--active' : ''}`}
              key={windowState.id}
              onClick={() => {
                if (windowState.minimized) {
                  restoreWindow(windowState.id)
                  return
                }

                focusWindow(windowState.id)
              }}
              type="button"
            >
              {windowState.title}
            </button>
          )
        })}
      </div>

      <time aria-label="Local time" className="taskbar__clock win95-inset" dateTime={now.toISOString()}>
        {formatClock(now)}
      </time>
    </footer>
  )
}
