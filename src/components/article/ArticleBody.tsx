import { RichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

type ArticleBodyProps = {
  content: SerializedEditorState
}

export function ArticleBody({ content }: ArticleBodyProps) {
  return (
    <div className="article-body">
      <RichText data={content} />
    </div>
  )
}
