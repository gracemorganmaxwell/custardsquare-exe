'use client'

import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from 'react'

type Win95ScrollAreaProps = {
  'aria-label'?: string
  children: ReactNode
  className?: string
}

type ScrollMetrics = {
  canScroll: boolean
  thumbHeight: number
  thumbTop: number
}

export function Win95ScrollArea({
  'aria-label': ariaLabel,
  children,
  className,
}: Win95ScrollAreaProps) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [metrics, setMetrics] = useState<ScrollMetrics>({
    canScroll: false,
    thumbHeight: 24,
    thumbTop: 0,
  })

  function syncThumb() {
    const viewport = viewportRef.current
    if (!viewport) {
      return
    }

    const { clientHeight, scrollHeight, scrollTop } = viewport
    const canScroll = scrollHeight > clientHeight + 1
    const trackHeight = Math.max(clientHeight - 32, 1)
    const thumbHeight = canScroll
      ? Math.max(24, Math.round((clientHeight / scrollHeight) * trackHeight))
      : trackHeight
    const maxThumbTop = Math.max(trackHeight - thumbHeight, 0)
    const maxScrollTop = Math.max(scrollHeight - clientHeight, 1)
    const thumbTop = canScroll ? Math.round((scrollTop / maxScrollTop) * maxThumbTop) : 0

    setMetrics({ canScroll, thumbHeight, thumbTop })
  }

  useEffect(() => {
    const viewport = viewportRef.current
    const content = contentRef.current
    if (!viewport || !content) {
      return
    }

    syncThumb()

    const observer = new ResizeObserver(() => {
      syncThumb()
    })
    observer.observe(viewport)
    observer.observe(content)

    return () => observer.disconnect()
  }, [])

  function scrollByStep(direction: -1 | 1) {
    const viewport = viewportRef.current
    if (!viewport) {
      return
    }

    viewport.scrollBy({ top: direction * 48, behavior: 'auto' })
  }

  function onTrackPointerDown(event: PointerEvent<HTMLDivElement>) {
    const viewport = viewportRef.current
    const track = event.currentTarget
    if (!viewport || !metrics.canScroll) {
      return
    }

    const rect = track.getBoundingClientRect()
    const y = event.clientY - rect.top
    const trackHeight = Math.max(rect.height, 1)
    const ratio = Math.min(Math.max(y / trackHeight, 0), 1)
    const maxScrollTop = viewport.scrollHeight - viewport.clientHeight
    viewport.scrollTop = ratio * maxScrollTop
  }

  return (
    <div className={`win95-scroll${className ? ` ${className}` : ''}`}>
      <div
        aria-label={ariaLabel}
        className="win95-scroll__viewport"
        onScroll={() => syncThumb()}
        ref={viewportRef}
      >
        <div className="win95-scroll__content" ref={contentRef}>
          {children}
        </div>
      </div>
      <div aria-hidden="true" className="win95-scroll__bar">
        <button
          className="win95-scroll__button"
          disabled={!metrics.canScroll}
          onClick={() => scrollByStep(-1)}
          type="button"
        >
          ▲
        </button>
        <div className="win95-scroll__track" onPointerDown={onTrackPointerDown}>
          <div
            className="win95-scroll__thumb"
            style={{ height: `${metrics.thumbHeight}px`, top: `${metrics.thumbTop}px` }}
          />
        </div>
        <button
          className="win95-scroll__button"
          disabled={!metrics.canScroll}
          onClick={() => scrollByStep(1)}
          type="button"
        >
          ▼
        </button>
      </div>
    </div>
  )
}
