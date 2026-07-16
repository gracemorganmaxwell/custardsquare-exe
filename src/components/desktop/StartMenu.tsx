'use client'

import { useEffect, useRef } from 'react'

import { useDesktopStore } from '@/lib/desktopStore'
import { GITHUB_LINK } from '@/lib/social-links'

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
        custardsquare OS
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
            <img alt="" height={24} src="/icons/desktop/welcome.svg" width={24} />
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
            <img alt="" height={24} src="/icons/desktop/about.svg" width={24} />
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
            <img alt="" height={24} src="/icons/desktop/this_computer.svg" width={24} />
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
            <img alt="" height={24} src="/icons/desktop/articles.svg" width={24} />
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
            <img alt="" height={24} src="/icons/desktop/resume.svg" width={24} />
            Resume
          </button>
        </li>
        <li role="none">
          <button
            className="start-menu__item"
            onClick={() => openWindow('skills', 'Skills')}
            role="menuitem"
            type="button"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="" height={24} src="/icons/desktop/skills.svg" width={24} />
            Skills
          </button>
        </li>
        <li role="none">
          <button
            className="start-menu__item"
            onClick={() => openWindow('terminal', 'Terminal — custardsquare OS')}
            role="menuitem"
            type="button"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="" height={24} src="/icons/desktop/terminal.svg" width={24} />
            Terminal
          </button>
        </li>
        <li role="none">
          <button
            className="start-menu__item"
            onClick={() => openWindow('notes', 'Notes')}
            role="menuitem"
            type="button"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="" height={24} src="/icons/desktop/notes.svg" width={24} />
            Notes
          </button>
        </li>
        <li role="none">
          <button
            className="start-menu__item"
            onClick={() => openWindow('projects', 'Projects')}
            role="menuitem"
            type="button"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="" height={24} src="/icons/desktop/projects.svg" width={24} />
            Projects
          </button>
        </li>
        <li role="none">
          <button
            className="start-menu__item"
            onClick={() => openWindow('credits', 'Credits')}
            role="menuitem"
            type="button"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="" height={24} src="/icons/desktop/credits.svg" width={24} />
            Credits
          </button>
        </li>
        <li role="none">
          <a
            className="start-menu__item"
            href={GITHUB_LINK.url}
            onClick={() => closeStartMenu()}
            rel="noopener noreferrer"
            role="menuitem"
            target="_blank"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="" height={24} src="/icons/desktop/github.svg" width={24} />
            GitHub
          </a>
        </li>
        <li aria-hidden="true" className="start-menu__separator" />
        <li role="none">
          <button className="start-menu__item" onClick={() => openShutdown()} role="menuitem" type="button">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="" height={24} src="/icons/desktop/shutdown.svg" width={24} />
            Shut Down…
          </button>
        </li>
      </ul>
    </div>
  )
}
