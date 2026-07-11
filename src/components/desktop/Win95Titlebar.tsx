import type { PointerEvent } from 'react'

type Win95TitlebarProps = {
  active?: boolean
  dragging?: boolean
  onClose?: () => void
  onDragStart?: (event: PointerEvent<HTMLDivElement>) => void
  onMinimize?: () => void
  title: string
  titleId?: string
}

export function Win95Titlebar({
  active = true,
  dragging = false,
  onClose,
  onDragStart,
  onMinimize,
  title,
  titleId,
}: Win95TitlebarProps) {
  const classNames = ['win95-titlebar']
  if (!active) {
    classNames.push('win95-titlebar--inactive')
  }
  if (dragging) {
    classNames.push('win95-titlebar--dragging')
  }
  if (onDragStart) {
    classNames.push('win95-titlebar--draggable')
  }

  return (
    <div
      className={classNames.join(' ')}
      onPointerDown={(event) => {
        if (!onDragStart) {
          return
        }

        if ((event.target as HTMLElement).closest('.win95-titlebar__controls')) {
          return
        }

        event.preventDefault()
        onDragStart(event)
      }}
    >
      <span className="win95-titlebar__title" id={titleId}>
        {title}
      </span>
      <div className="win95-titlebar__controls">
        <button
          aria-label="Minimize"
          className="win95-titlebar__control win95-titlebar__control--minimize"
          disabled={!onMinimize}
          onClick={(event) => {
            event.stopPropagation()
            onMinimize?.()
          }}
          type="button"
        >
          <span className="win95-titlebar__glyph" />
        </button>
        <button
          aria-label="Maximize"
          className="win95-titlebar__control win95-titlebar__control--maximize"
          disabled
          type="button"
        >
          <span className="win95-titlebar__glyph" />
        </button>
        <button
          aria-label="Close"
          className="win95-titlebar__control win95-titlebar__control--close"
          disabled={!onClose}
          onClick={(event) => {
            event.stopPropagation()
            onClose?.()
          }}
          type="button"
        >
          <span className="win95-titlebar__glyph" />
        </button>
      </div>
    </div>
  )
}
