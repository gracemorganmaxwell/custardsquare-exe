function normalizeUrl(url: string): string {
  return url.trim().replace(/\/$/, '')
}

function addOrigin(origins: Set<string>, url?: string): void {
  if (url && url.trim().length > 0) {
    origins.add(normalizeUrl(url))
  }
}

/** Production custom domains — always trusted for admin CSRF cookies. */
const PRODUCTION_ORIGINS = ['https://custardsq.app', 'https://www.custardsq.app']

/**
 * Canonical site URL for Payload serverURL and metadata.
 * Must match the URL you use in the browser (including local vs Vercel preview).
 */
export function getServerURL(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim()

  // Local dev: avoid a production NEXT_PUBLIC_SITE_URL breaking admin auth cookies.
  if (process.env.NODE_ENV === 'development' && !process.env.VERCEL) {
    if (explicit && /localhost|127\.0\.0\.1/.test(explicit)) {
      return normalizeUrl(explicit)
    }

    return 'http://localhost:3000'
  }

  // Preview deploys: use this deployment's *.vercel.app URL (varies per branch).
  if (process.env.VERCEL_ENV === 'preview' && process.env.VERCEL_URL) {
    return normalizeUrl(`https://${process.env.VERCEL_URL}`)
  }

  if (explicit) {
    return normalizeUrl(explicit)
  }

  if (process.env.VERCEL_URL) {
    return normalizeUrl(`https://${process.env.VERCEL_URL}`)
  }

  return 'http://localhost:3000'
}

/**
 * Origins allowed for Payload CORS + CSRF cookie auth.
 * Browser Origin must match one of these exactly or admin API calls return 403.
 */
export function getTrustedOrigins(): string[] {
  const origins = new Set<string>()

  addOrigin(origins, getServerURL())
  addOrigin(origins, process.env.NEXT_PUBLIC_SITE_URL)
  addOrigin(origins, process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined)

  for (const origin of PRODUCTION_ORIGINS) {
    addOrigin(origins, origin)
  }

  addOrigin(origins, 'http://localhost:3000')
  addOrigin(origins, 'http://127.0.0.1:3000')

  return [...origins]
}
