'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'

import { DesktopIcon } from '@/components/desktop/DesktopIcon'
import { DESKTOP_ICONS } from '@/lib/desktop-icons'

export function DesktopIconGrid() {
  const router = useRouter()
  const [selectedIndex, setSelectedIndex] = useState(0)

  const activateIcon = useCallback(
    (index: number) => {
      const icon = DESKTOP_ICONS[index]
      if (!icon || icon.disabled || !icon.href) {
        return
      }

      router.push(icon.href)
    },
    [router],
  )

  return (
    <div
      className="desktop-icon-grid"
      role="toolbar"
      aria-label="Desktop icons"
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
    >
      {DESKTOP_ICONS.map((icon, index) => (
        <DesktopIcon
          key={icon.id}
          disabled={icon.disabled}
          iconSrc={icon.iconSrc}
          isSelected={selectedIndex === index}
          label={icon.label}
          onActivate={() => activateIcon(index)}
          onSelect={() => setSelectedIndex(index)}
        />
      ))}
    </div>
  )
}
