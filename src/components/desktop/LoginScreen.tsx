'use client'

import { useState } from 'react'

import { AdminFooterLink } from '@/components/desktop/AdminFooterLink'
import { Win95Titlebar } from '@/components/desktop/Win95Titlebar'

type LoginScreenProps = {
  children: React.ReactNode
  siteTitle: string
}

export function LoginScreen({ children, siteTitle }: LoginScreenProps) {
  const [hasStarted, setHasStarted] = useState(false)

  if (hasStarted) {
    return children
  }

  return (
    <main className="login-screen">
      <div className="login-screen__window win95-raised">
        <Win95Titlebar title={siteTitle} />

        <div className="login-screen__body">
          <p className="login-screen__hint">Enter Gracie&apos;s second brain</p>

          <div className="login-screen__actions">
            <button
              className="win95-button login-screen__start"
              type="button"
              onClick={() => setHasStarted(true)}
            >
              Start
            </button>
          </div>
        </div>
      </div>

      <AdminFooterLink />
    </main>
  )
}
