'use client'

import { useEffect, useId, useRef, useState, type ReactNode } from 'react'

import { Win95Titlebar } from '@/components/desktop/Win95Titlebar'

type WinWindowProps = {
  children: ReactNode
  className?: string
  initialPosition?: {
    x: number
    y: number
  }
  title: string
}

type Point = {
  x: number
  y: number
}

function clampPosition(point: Point, width: number, height: number): Point {
  if (typeof window === 'undefined') {
    return point
  }

  const maxX = Math.max(8, window.innerWidth - width - 8)
  const maxY = Math.max(8, window.innerHeight - height - 8)

  return {
    x: Math.min(Math.max(8, point.x), maxX),
    y: Math.min(Math.max(8, point.y), maxY),
  }
}

export function WinWindow({ children, className, initialPosition, title }: WinWindowProps) {
  const titleId = useId()
  const windowRef = useRef<HTMLElement>(null)
  const dragOffsetRef = useRef<Point>({ x: 0, y: 0 })
  const [position, setPosition] = useState<Point | null>(initialPosition ?? null)
  const [dragging, setDragging] = useState(false)
  const [active, setActive] = useState(true)

  useEffect(() => {
    if (position !== null || !windowRef.current) {
      return
    }

    const rect = windowRef.current.getBoundingClientRect()
    setPosition(
      clampPosition(
        {
          x: Math.round((window.innerWidth - rect.width) / 2),
          y: Math.round((window.innerHeight - rect.height) / 2),
        },
        rect.width,
        rect.height,
      ),
    )
  }, [position])

  useEffect(() => {
    if (!dragging) {
      return
    }

    const onPointerMove = (event: PointerEvent) => {
      if (!windowRef.current) {
        return
      }

      const rect = windowRef.current.getBoundingClientRect()
      setPosition(
        clampPosition(
          {
            x: event.clientX - dragOffsetRef.current.x,
            y: event.clientY - dragOffsetRef.current.y,
          },
          rect.width,
          rect.height,
        ),
      )
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
  }, [dragging])

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

  return (
    <article
      aria-labelledby={titleId}
      className={classNames.join(' ')}
      onPointerDown={() => setActive(true)}
      ref={windowRef}
      style={
        position
          ? {
              left: position.x,
              top: position.y,
            }
          : undefined
      }
    >
      <Win95Titlebar
        active={active}
        dragging={dragging}
        onDragStart={(event) => {
          if (!windowRef.current) {
            return
          }

          const rect = windowRef.current.getBoundingClientRect()
          dragOffsetRef.current = {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
          }
          setActive(true)
          setDragging(true)
        }}
        title={title}
        titleId={titleId}
      />
      <div className="win-window__body">{children}</div>
    </article>
  )
}
