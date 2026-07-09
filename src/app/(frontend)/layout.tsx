import type { Metadata } from 'next'
import React from 'react'

import { buildRootMetadata } from '@/lib/seo'
import { getSiteSettings } from '@/lib/site-settings'

import './styles.css'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()

  return buildRootMetadata(settings)
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  )
}
