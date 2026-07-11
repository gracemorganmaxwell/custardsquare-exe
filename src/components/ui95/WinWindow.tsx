'use client'

import {
  useEffect,
  useId,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react'

import { Win95Titlebar } from '@/components/desktop/Win95Titlebar'
import type { DesktopPoint } from '@/lib/desktopStore'

type WinWindowProps = {
  active?: boolean
  children: ReactNode
  className?: string
  hidden?: boolean
  initialPosition?: DesktopPoint | null
  onClose?: () => void
  onFocus?: () => void
  onMinimize?: () => void
  onPositionChange?: (position: DesktopPoint) => void
  title: string
  zIndex?: number
}

function clampPosition(point: DesktopPoint, width: number, height: number): DesktopPoint {
  if (typeof window === 'undefined') {
    return point
  }

  const maxX = Math.max(8, window.innerWidth - width - 8)
  const maxY = Math.max(8, window.innerHeight - height - 48)

  return {
    x: Math.min(Math.max(8, point.x), maxX),
    y: Math.min(Math.max(8, point.y), maxY),
  }
}

export function WinWindow({
  active = true,
  children,
  className,
  hidden = false,
  initialPosition = null,
  onClose,
  onFocus,
  onMinimize,
  onPositionChange,
  title,
  zIndex = 2,
}: WinWindowProps) {
  const titleId = useId()
  const windowRef = useRef<HTMLElement>(null)
  const dragOffsetRef = useRef<DesktopPoint>({ x: 0, y: 0 })
  const [position, setPosition] = useState<DesktopPoint | null>(initialPosition)
  const [dragging, setDragging] = useState(false)

  useEffect(() => {
    if (position !== null || !windowRef.current || hidden) {
      return
    }

    const rect = windowRef.current.getBoundingClientRect()
    const next = clampPosition(
      {
        x: Math.round((window.innerWidth - rect.width) / 2),
        y: Math.round((window.innerHeight - rect.height) / 3),
      },
      rect.width,
      rect.height,
    )
    setPosition(next)
    onPositionChange?.(next)
  }, [hidden, onPositionChange, position])

  useEffect(() => {
    if (!dragging) {
      return
    }

    const onPointerMove = (event: PointerEvent) => {
      if (!windowRef.current) {
        return
      }

      const rect = windowRef.current.getBoundingClientRect()
      const next = clampPosition(
        {
          x: event.clientX - dragOffsetRef.current.x,
          y: event.clientY - dragOffsetRef.current.y,
        },
        rect.width,
        rect.height,
      )
      setPosition(next)
      onPositionChange?.(next)
    }

    const onPointerUp = () => {
      setDragging(false)
    }

    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)

    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
    }
  }, [dragging, onPositionChange])

  const classNames = [
    'win-window',
    'win95-raised',
    active ? 'win-window--active' : 'win-window--inactive',
  ]
  if (className) {
    classNames.push(className)
  }
  if (dragging) {
    classNames.push('win-window--dragging')
  }
  if (position) {
    classNames.push('win-window--positioned')
  }
  if (hidden) {
    classNames.push('win-window--hidden')
  }

  return (
    <article
      aria-hidden={hidden}
      aria-labelledby={titleId}
      className={classNames.join(' ')}
      onPointerDown={() => onFocus?.()}
      ref={windowRef}
      style={{
        zIndex,
        ...(position
          ? {
              left: position.x,
              top: position.y,
            }
          : undefined),
      }}
    >
      <Win95Titlebar
        active={active}
        dragging={dragging}
        onClose={onClose}
        onDragStart={(event: ReactPointerEvent<HTMLDivElement>) => {
          if (!windowRef.current) {
            return
          }

          const rect = windowRef.current.getBoundingClientRect()
          dragOffsetRef.current = {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
          }
          onFocus?.()
          setDragging(true)
        }}
        onMinimize={onMinimize}
        title={title}
        titleId={titleId}
      />
      <div className="win-window__body">{children}</div>
    </article>
  )
}
