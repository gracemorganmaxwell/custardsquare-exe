'use client'

import { RichTextDocument } from '@/components/richtext/RichTextDocument'
import type { ResolvedResumeContent } from '@/lib/site-settings'

type ResumeWindowProps = {
  resume: ResolvedResumeContent
}

export function ResumeWindow({ resume }: ResumeWindowProps) {
  return (
    <div className="resume-window">
      <div className="resume-window__toolbar">
        <span>RESUME.md</span>
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
      <div aria-label="Resume" className="resume-window__body win95-inset">
        <RichTextDocument className="resume-window__richtext" content={resume.content} />
      </div>
      <div aria-label="Status bar" className="resume-window__status">
        <div className="resume-window__status-field">
          Rich text · edit in Site Settings (headings, bold, links, lists…)
        </div>
        <div className="resume-window__status-field">Lexical</div>
      </div>
    </div>
  )
}
