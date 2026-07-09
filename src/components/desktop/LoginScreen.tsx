'use client'

import Link from 'next/link'
import { useState } from 'react'

type LoginScreenProps = {
  children: React.ReactNode
  siteTitle: string
}

export function LoginScreen({ children, siteTitle }: LoginScreenProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  if (isLoggedIn) {
    return children
  }

  return (
    <main className="login-screen">
      <div className="login-screen__window win95-raised">
        <div className="win95-titlebar">Welcome to {siteTitle}</div>

        <form
          className="login-screen__form"
          onSubmit={(event) => {
            event.preventDefault()
            setIsLoggedIn(true)
          }}
        >
          <p className="login-screen__hint">
            Visitor login — cosmetic only. Any username and password work.
          </p>

          <label className="login-screen__field">
            <span className="login-screen__label">User name:</span>
            <input
              autoComplete="username"
              className="login-screen__input win95-inset"
              defaultValue="visitor"
              name="username"
              type="text"
            />
          </label>

          <label className="login-screen__field">
            <span className="login-screen__label">Password:</span>
            <input
              autoComplete="current-password"
              className="login-screen__input win95-inset"
              defaultValue="password"
              name="password"
              type="password"
            />
          </label>

          <div className="login-screen__actions">
            <button className="win95-button" type="submit">
              OK
            </button>
          </div>
        </form>
      </div>

      <p className="login-screen__admin-note">
        CMS admin?{' '}
        <Link href="/admin">Sign in at /admin</Link>
      </p>
    </main>
  )
}
