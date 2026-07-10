export type DesktopIconItem = {
  id: string
  label: string
  iconSrc: string
  href?: string
  disabled?: boolean
}

/** aconfuseddragon Win95 Plus icons — copied from learning-journey-os/public/icons/ */
export const DESKTOP_ICONS: DesktopIconItem[] = [
  {
    id: 'articles',
    label: 'Articles',
    iconSrc: '/icons/desktop/articles.png',
    href: '/articles',
  },
  {
    id: 'about',
    label: 'About',
    iconSrc: '/icons/desktop/about.png',
    disabled: true,
  },
  {
    id: 'projects',
    label: 'Projects',
    iconSrc: '/icons/desktop/projects.png',
    disabled: true,
  },
]
