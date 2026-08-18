'use client'

import { useState } from 'react'

import { Win95ScrollArea } from '@/components/ui95/Win95ScrollArea'
import type { ProjectItem } from '@/lib/default-projects'

type ProjectsWindowProps = {
  projects: ProjectItem[]
}

function storyParagraphs(story: string): string[] {
  return story
    .split(/\n\n+/)
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph.length > 0)
}

export function ProjectsWindow({ projects }: ProjectsWindowProps) {
  const [selectedUrl, setSelectedUrl] = useState<string | undefined>(projects[0]?.url)
  const selected =
    selectedUrl === undefined
      ? undefined
      : projects.find((project) => project.url === selectedUrl)
  const paragraphs = selected ? storyParagraphs(selected.story) : []

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
              <button
                aria-current={selectedUrl === project.url ? 'true' : undefined}
                className="projects-window__row"
                onClick={() => setSelectedUrl(project.url)}
                type="button"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img alt="" height={16} src="/icons/desktop/projects.png" width={16} />
                <span className="projects-window__title">{project.title}</span>
                <span className="projects-window__path">{project.url}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <section aria-label="Project story" className="projects-window__story">
        {selected ? (
          <>
            <div className="projects-window__story-header">
              <h2 className="projects-window__story-title">{selected.title}</h2>
              <a
                className="win95-button"
                href={selected.url}
                rel="noopener noreferrer"
                target="_blank"
              >
                Visit site
              </a>
            </div>
            <Win95ScrollArea
              aria-label={`${selected.title} story`}
              className="projects-window__story-body win95-inset"
            >
              {paragraphs.length > 0 ? (
                paragraphs.map((paragraph) => (
                  <p className="projects-window__story-copy" key={paragraph.slice(0, 48)}>
                    {paragraph}
                  </p>
                ))
              ) : (
                <p className="projects-window__story-copy">
                  No story yet. Add one in Site Settings → Projects window.
                </p>
              )}
            </Win95ScrollArea>
          </>
        ) : (
          <p className="projects-window__story-placeholder">Select a project to read the story.</p>
        )}
      </section>

      <div aria-label="Status bar" className="projects-window__status">
        <div className="projects-window__status-field">
          {selected ? selected.summary : 'Ready'}
        </div>
        <div className="projects-window__status-field">{projects.length} object(s)</div>
      </div>
    </div>
  )
}
