'use client'

import { useEffect, useRef } from 'react'

import { useDesktopStore } from '@/lib/desktopStore'

export function StartMenu() {
  const open = useDesktopStore((state) => state.startMenuOpen)
  const closeStartMenu = useDesktopStore((state) => state.closeStartMenu)
  const openWindow = useDesktopStore((state) => state.openWindow)
  const openExplorer = useDesktopStore((state) => state.openExplorer)
  const openShutdown = useDesktopStore((state) => state.openShutdown)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) {
      return
    }

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as HTMLElement
      if (target.closest('.start-menu') || target.closest('.taskbar__start')) {
        return
      }
      closeStartMenu()
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeStartMenu()
      }
    }

    window.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [closeStartMenu, open])

  if (!open) {
    return null
  }

  return (
    <div aria-label="Start menu" className="start-menu win95-raised" ref={menuRef} role="menu">
      <div aria-hidden="true" className="start-menu__banner">
        custardsquare.exe
      </div>
      <ul className="start-menu__list">
        <li role="none">
          <button
            className="start-menu__item"
            onClick={() => openWindow('welcome', 'Welcome — custardsquare.exe')}
            role="menuitem"
            type="button"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="" height={24} src="/icons/desktop/this_computer.png" width={24} />
            Welcome
          </button>
        </li>
        <li role="none">
          <button
            className="start-menu__item"
            onClick={() => openWindow('about', 'About')}
            role="menuitem"
            type="button"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="" height={24} src="/icons/desktop/about.png" width={24} />
            About
          </button>
        </li>
        <li role="none">
          <button
            className="start-menu__item"
            onClick={() => openExplorer('root')}
            role="menuitem"
            type="button"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="" height={24} src="/icons/desktop/this_computer.png" width={24} />
            My Computer
          </button>
        </li>
        <li role="none">
          <button
            className="start-menu__item"
            onClick={() => openWindow('articles', 'Articles')}
            role="menuitem"
            type="button"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="" height={24} src="/icons/desktop/articles.png" width={24} />
            Articles
          </button>
        </li>
        <li role="none">
          <button
            className="start-menu__item"
            onClick={() => openWindow('resume', 'Resume — RESUME.md')}
            role="menuitem"
            type="button"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="" height={24} src="/icons/desktop/projects.png" width={24} />
            Resume
          </button>
        </li>
        <li aria-hidden="true" className="start-menu__separator" />
        <li role="none">
          <button className="start-menu__item" onClick={() => openShutdown()} role="menuitem" type="button">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="" height={24} src="/icons/desktop/github.png" width={24} />
            Shut Down…
          </button>
        </li>
      </ul>
    </div>
  )
}
