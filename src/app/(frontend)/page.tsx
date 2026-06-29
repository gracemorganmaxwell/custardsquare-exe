import React from 'react'
import './styles.css'

export default function HomePage() {
  return (
    <main className="home">
      <div className="content">
        <p className="boot-line">Starting custardsquare.exe...</p>
        <h1>custardsquare.exe</h1>
        <p className="tagline">
          Gracie&apos;s public second brain disguised as a dreamy Windows 98 desktop.
        </p>
        <p className="status">Loading thoughts... Indexing crumbs... Desktop shell coming in M4.</p>
        <div className="links">
          <a className="admin" href="/admin">
            Admin CMS
          </a>
          <a className="docs" href="/articles">
            Articles
          </a>
          <a className="docs" href="https://github.com/gracemorganmaxwell/custardsquare-exe">
            GitHub
          </a>
        </div>
      </div>
    </main>
  )
}
