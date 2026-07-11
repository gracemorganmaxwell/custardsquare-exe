'use client'

import type { ResolvedResumeContent } from '@/lib/site-settings'

type ResumeWindowProps = {
  resume: ResolvedResumeContent
}

export function ResumeWindow({ resume }: ResumeWindowProps) {
  return (
    <div className="resume-window">
      <div className="resume-window__toolbar">
        <span>RESUME.TXT</span>
        <a
          className="win95-button resume-window__download"
          download
          href={resume.pdfHref}
          rel="noopener noreferrer"
          target="_blank"
        >
          Download PDF
        </a>
      </div>
      <pre aria-label="Resume" className="resume-window__body win95-inset">
        {resume.body}
      </pre>
      <div aria-label="Status bar" className="resume-window__status">
        <div className="resume-window__status-field">Read-only · edit in Site Settings</div>
        <div className="resume-window__status-field">UTF-8</div>
      </div>
    </div>
  )
}
