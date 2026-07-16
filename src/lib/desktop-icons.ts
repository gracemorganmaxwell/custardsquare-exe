import type { DesktopWindowId, ExplorerFolderId } from '@/lib/desktopStore'
import { explorerWindowTitle } from '@/lib/desktopStore'
import { GITHUB_LINK } from '@/lib/social-links'

export type DesktopIconItem = {
  disabled?: boolean
  explorerFolder?: ExplorerFolderId
  href?: string
  iconSrc: string
  id: string
  label: string
  windowId?: DesktopWindowId
  windowTitle?: string
}

/**
 * aconfuseddragon Win95 Plus icons — full pack in /public/icons/pack/
 * (copied from learning-journey-os). Desktop aliases live in /public/icons/desktop/.
 */
export const DESKTOP_ICONS: DesktopIconItem[] = [
  {
    id: 'this-computer',
    label: 'My Computer',
    iconSrc: '/icons/desktop/this_computer.svg',
    windowId: 'this-computer',
    windowTitle: explorerWindowTitle('root'),
    explorerFolder: 'root',
  },
  {
    id: 'articles',
    label: 'Articles',
    iconSrc: '/icons/desktop/articles.svg',
    windowId: 'articles',
    windowTitle: 'Articles',
  },
  {
    id: 'about',
    label: 'About',
    iconSrc: '/icons/desktop/about.svg',
    windowId: 'about',
    windowTitle: 'About',
  },
  {
    id: 'resume',
    label: 'Resume',
    iconSrc: '/icons/desktop/resume.svg',
    windowId: 'resume',
    windowTitle: 'Resume — RESUME.md',
  },
  {
    id: 'skills',
    label: 'Skills',
    iconSrc: '/icons/desktop/skills.svg',
    windowId: 'skills',
    windowTitle: 'Skills',
  },
  {
    id: 'terminal',
    label: 'Terminal',
    iconSrc: '/icons/desktop/terminal.svg',
    windowId: 'terminal',
    windowTitle: 'Terminal — custardsquare OS',
  },
  {
    id: 'notes',
    label: 'Notes',
    iconSrc: '/icons/desktop/notes.svg',
    windowId: 'notes',
    windowTitle: 'Notes',
  },
  {
    id: 'projects',
    label: 'Projects',
    iconSrc: '/icons/desktop/projects.svg',
    windowId: 'projects',
    windowTitle: 'Projects',
  },
  {
    id: 'credits',
    label: 'Credits',
    iconSrc: '/icons/desktop/credits.svg',
    windowId: 'credits',
    windowTitle: 'Credits',
  },
  {
    id: 'github',
    label: 'GitHub',
    iconSrc: '/icons/desktop/github.svg',
    href: GITHUB_LINK.url,
  },
]
