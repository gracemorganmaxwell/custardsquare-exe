import React from 'react'

import { SITE_NAME } from '@/lib/seo'
import { getServerURL } from '@/lib/site-url'

import './styles.css'

export const metadata = {
  description: "Gracie's public second brain disguised as a dreamy Windows 98 desktop.",
  metadataBase: new URL(getServerURL()),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
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
