'use client'

type DesktopIconProps = {
  label: string
  iconSrc: string
  isSelected: boolean
  disabled?: boolean
  openOnSingleClick?: boolean
  onActivate: () => void
  onSelect: () => void
}

export function DesktopIcon({
  label,
  iconSrc,
  isSelected,
  disabled = false,
  openOnSingleClick = false,
  onActivate,
  onSelect,
}: DesktopIconProps) {
  return (
    <button
      className={`desktop-icon${isSelected ? ' desktop-icon--selected' : ''}`}
      disabled={disabled}
      tabIndex={isSelected ? 0 : -1}
      type="button"
      onClick={() => {
        onSelect()
        if (openOnSingleClick && !disabled) {
          onActivate()
        }
      }}
      onDoubleClick={() => {
        if (!openOnSingleClick && !disabled) {
          onActivate()
        }
      }}
      onFocus={onSelect}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          if (!disabled) {
            onActivate()
          }
        }
      }}
    >
      <span className="desktop-icon__image-wrap">
        <img alt="" aria-hidden="true" className="desktop-icon__image" height={32} src={iconSrc} width={32} />
      </span>
      <span className="desktop-icon__label">{label}</span>
    </button>
  )
}
