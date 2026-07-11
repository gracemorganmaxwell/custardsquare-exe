import type { Metadata } from 'next'
import Link from 'next/link'

import { getSiteSettings } from '@/lib/site-settings'

import '../articles/articles.css'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()

  return {
    title: `Credits — ${settings.siteTitle}`,
    description: 'Icon and asset credits for custardsquare.exe.',
  }
}

export default async function CreditsPage() {
  const settings = await getSiteSettings()

  return (
    <div className="article-page">
      <div className="article-shell">
        <Link className="article-back" href="/">
          ← {settings.siteTitle}
        </Link>

        <header className="article-list-header">
          <h1>Credits</h1>
          <p>Icons, trademarks, and thanks.</p>
        </header>

        <pre className="article-credits">{settings.credits}</pre>
      </div>
    </div>
  )
}
