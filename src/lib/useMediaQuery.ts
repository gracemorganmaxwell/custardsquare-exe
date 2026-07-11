'use client'

import { useEffect, useState } from 'react'

/** Shared shell breakpoint for #039 / #040 mobile layout. */
export const DESKTOP_MOBILE_QUERY = '(max-width: 640px)'

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)

    function update() {
      setMatches(media.matches)
    }

    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [query])

  return matches
}

export function useIsMobileDesktop(): boolean {
  return useMediaQuery(DESKTOP_MOBILE_QUERY)
}
