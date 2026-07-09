type Win95TitlebarProps = {
  title: string
}

export function Win95Titlebar({ title }: Win95TitlebarProps) {
  return (
    <div className="win95-titlebar">
      <span className="win95-titlebar__title">{title}</span>
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
