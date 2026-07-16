'use client'

type CreditsWindowProps = {
  credits: string
}

export function CreditsWindow({ credits }: CreditsWindowProps) {
  return (
    <div className="credits-window">
      <div className="credits-window__body win95-inset">
        <h2 className="credits-window__title">Credits</h2>
        <pre className="credits-window__text">{credits}</pre>
      </div>
    </div>
  )
}
