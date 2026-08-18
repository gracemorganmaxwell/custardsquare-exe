'use client'

import { useState } from 'react'

import type { ProjectItem } from '@/lib/default-projects'

type ProjectsWindowProps = {
  projects: ProjectItem[]
}

export function ProjectsWindow({ projects }: ProjectsWindowProps) {
  const [selectedUrl, setSelectedUrl] = useState<string | undefined>(undefined)
  const selected =
    selectedUrl === undefined
      ? undefined
      : projects.find((project) => project.url === selectedUrl)

  return (
    <div className="projects-window">
      <div className="projects-window__toolbar" aria-hidden="true">
        <span>Live sites</span>
        <span>{projects.length} item(s)</span>
      </div>

      {projects.length === 0 ? (
        <p className="projects-window__empty">No projects listed yet.</p>
      ) : (
        <ul aria-label="Live project sites" className="projects-window__list">
          {projects.map((project) => (
            <li key={project.url}>
              <a
                aria-current={selectedUrl === project.url ? 'true' : undefined}
                className="projects-window__row"
                href={project.url}
                onClick={() => setSelectedUrl(project.url)}
                rel="noopener noreferrer"
                target="_blank"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img alt="" height={16} src="/icons/desktop/projects.png" width={16} />
                <span className="projects-window__title">{project.title}</span>
                <span className="projects-window__path">{project.url}</span>
              </a>
            </li>
          ))}
        </ul>
      )}

      <div aria-label="Status bar" className="projects-window__status">
        <div className="projects-window__status-field">
          {selected ? selected.summary : 'Ready'}
        </div>
        <div className="projects-window__status-field">{projects.length} object(s)</div>
      </div>
    </div>
  )
}
