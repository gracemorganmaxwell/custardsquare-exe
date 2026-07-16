'use client'

type ComingSoonWindowProps = {
  appName: string
  blurb: string
}

export function ComingSoonWindow({ appName, blurb }: ComingSoonWindowProps) {
  return (
    <div className="coming-soon-window">
      <div className="coming-soon-window__body win95-inset">
        <h2 className="coming-soon-window__title">{appName}</h2>
        <p className="coming-soon-window__blurb">{blurb}</p>
        <p className="coming-soon-window__note">Coming soon in a later milestone.</p>
      </div>
    </div>
  )
}
