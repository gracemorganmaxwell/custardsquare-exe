import type { DesktopWindowId, ExplorerFolderId } from '@/lib/desktopStore'
import { explorerWindowTitle } from '@/lib/desktopStore'

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

/** aconfuseddragon Win95 Plus icons — copied from learning-journey-os/public/icons/ */
export const DESKTOP_ICONS: DesktopIconItem[] = [
  {
    id: 'articles',
    label: 'Articles',
    iconSrc: '/icons/desktop/articles.png',
    windowId: 'this-computer',
    windowTitle: explorerWindowTitle('articles'),
    explorerFolder: 'articles',
  },
  {
    id: 'about',
    label: 'About',
    iconSrc: '/icons/desktop/about.png',
    windowId: 'about',
    windowTitle: 'About',
  },
  {
    id: 'this-computer',
    label: 'My Computer',
    iconSrc: '/icons/desktop/this_computer.png',
    windowId: 'this-computer',
    windowTitle: explorerWindowTitle('root'),
    explorerFolder: 'root',
  },
]
