'use client'

import { useState } from 'react'

import { PROJECT_LINKS } from '@/lib/project-links'

export function ProjectsWindow() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selected =
    selectedId === null
      ? null
      : (PROJECT_LINKS.find((project) => project.id === selectedId) ?? null)

  return (
    <div className="projects-window">
      <div className="projects-window__toolbar" aria-hidden="true">
        <span>Portfolio shortcuts</span>
        <span>{PROJECT_LINKS.length} item(s)</span>
      </div>

      <div aria-label="Projects" className="projects-window__files">
        <div className="explorer__file-grid">
          {PROJECT_LINKS.map((project) => (
            <a
              aria-current={selectedId === project.id ? 'true' : undefined}
              className="explorer__file"
              href={project.url}
              key={project.id}
              onClick={() => setSelectedId(project.id)}
              onFocus={() => setSelectedId(project.id)}
              rel="noopener noreferrer"
              target="_blank"
              title={project.blurb}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt=""
                className="explorer__file-icon"
                height={32}
                src="/icons/desktop/browser.png"
                width={32}
              />
              <span>{project.label}</span>
            </a>
          ))}
        </div>
      </div>

      <div aria-label="Status bar" className="projects-window__status">
        <div className="projects-window__status-field">
          {selected ? selected.blurb : 'Ready'}
        </div>
        <div className="projects-window__status-field">{PROJECT_LINKS.length} object(s)</div>
      </div>
    </div>
  )
}
