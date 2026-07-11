'use client'

import { useCallback, useState } from 'react'

import { DesktopIcon } from '@/components/desktop/DesktopIcon'
import { DESKTOP_ICONS } from '@/lib/desktop-icons'
import { useDesktopStore } from '@/lib/desktopStore'

export function DesktopIconGrid() {
  const openWindow = useDesktopStore((state) => state.openWindow)
  const openExplorer = useDesktopStore((state) => state.openExplorer)
  const [selectedIndex, setSelectedIndex] = useState(0)

  const activateIcon = useCallback(
    (index: number) => {
      const icon = DESKTOP_ICONS[index]
      if (!icon || icon.disabled) {
        return
      }

      if (icon.explorerFolder) {
        openExplorer(icon.explorerFolder)
        return
      }

      if (icon.windowId) {
        openWindow(icon.windowId, icon.windowTitle ?? icon.label)
      }
    },
    [openExplorer, openWindow],
  )

  return (
    <div
      aria-label="Desktop icons"
      className="desktop-icon-grid"
      onKeyDown={(event) => {
        const lastIndex = DESKTOP_ICONS.length - 1

        if (event.key === 'ArrowDown') {
          event.preventDefault()
          setSelectedIndex((current) => Math.min(current + 1, lastIndex))
        }

        if (event.key === 'ArrowUp') {
          event.preventDefault()
          setSelectedIndex((current) => Math.max(current - 1, 0))
        }

        if (event.key === 'Home') {
          event.preventDefault()
          setSelectedIndex(0)
        }

        if (event.key === 'End') {
          event.preventDefault()
          setSelectedIndex(lastIndex)
        }
      }}
      role="toolbar"
    >
      {DESKTOP_ICONS.map((icon, index) => (
        <DesktopIcon
          disabled={icon.disabled}
          iconSrc={icon.iconSrc}
          isSelected={selectedIndex === index}
          key={icon.id}
          label={icon.label}
          onActivate={() => activateIcon(index)}
          onSelect={() => setSelectedIndex(index)}
        />
      ))}
    </div>
  )
}
