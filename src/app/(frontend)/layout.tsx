import React from 'react'
import './styles.css'

export const metadata = {
  description: "Gracie's public second brain disguised as a dreamy Windows 98 desktop.",
  title: 'custardsquare.exe',
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
