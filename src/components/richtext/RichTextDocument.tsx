'use client'

import { RichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

type RichTextDocumentProps = {
  className?: string
  content: SerializedEditorState
}

/** Shared Lexical renderer for desktop windows (Resume, etc.). Articles keep TOC-aware ArticleBody. */
export function RichTextDocument({ className, content }: RichTextDocumentProps) {
  return (
    <div className={className}>
      <RichText data={content} />
    </div>
  )
}
