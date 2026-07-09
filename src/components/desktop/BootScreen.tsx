'use client'

import { useEffect, useMemo, useState } from 'react'

type BootScreenProps = {
  children: React.ReactNode
  siteTitle: string
}

function getBootLines(siteTitle: string): string[] {
  return [
    `Starting ${siteTitle}...`,
    'Loading second brain modules...',
    'Indexing crumbs...',
    'Ready.',
  ]
}

export function BootScreen({ children, siteTitle }: BootScreenProps) {
  const lines = useMemo(() => getBootLines(siteTitle), [siteTitle])
  const [visibleLineCount, setVisibleLineCount] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduceMotion) {
      const timer = window.setTimeout(() => {
        setVisibleLineCount(lines.length)
        setIsComplete(true)
      }, 0)
      return () => window.clearTimeout(timer)
    }

    let lineIndex = 0
    const lineTimer = window.setInterval(() => {
      lineIndex += 1
      setVisibleLineCount(lineIndex)

      if (lineIndex >= lines.length) {
        window.clearInterval(lineTimer)
        window.setTimeout(() => setIsComplete(true), 500)
      }
    }, 480)

    return () => window.clearInterval(lineTimer)
  }, [lines.length])

  if (isComplete) {
    return children
  }

  const visibleLines = lines.slice(0, visibleLineCount)

  return (
    <main aria-busy="true" aria-label="Starting custardsquare.exe" className="boot-screen">
      <div className="boot-screen__inner">
        {visibleLines.map((line) => (
          <p className="boot-screen__line" key={line}>
            {line}
          </p>
        ))}
        {visibleLineCount < lines.length ? (
          <p aria-hidden="true" className="boot-screen__cursor">
            _
          </p>
        ) : null}
      </div>
    </main>
  )
}
