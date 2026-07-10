import type { PointerEvent } from 'react'

type Win95TitlebarProps = {
  active?: boolean
  dragging?: boolean
  onDragStart?: (event: PointerEvent<HTMLDivElement>) => void
  title: string
  titleId?: string
}

export function Win95Titlebar({
  active = true,
  dragging = false,
  onDragStart,
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

        // Don't start a drag from the control buttons
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
      <div aria-hidden="true" className="win95-titlebar__controls">
        <span className="win95-titlebar__control win95-titlebar__control--minimize">
          <span className="win95-titlebar__glyph" />
        </span>
        <span className="win95-titlebar__control win95-titlebar__control--maximize">
          <span className="win95-titlebar__glyph" />
        </span>
        <span className="win95-titlebar__control win95-titlebar__control--close">
          <span className="win95-titlebar__glyph" />
        </span>
      </div>
    </div>
  )
}
