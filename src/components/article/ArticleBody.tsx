import {
  type JSXConvertersFunction,
  RichText,
} from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import React from 'react'

import type { ArticleHeading } from '@/lib/lexical-headings'

type ArticleBodyProps = {
  content: SerializedEditorState
  headings: ArticleHeading[]
}

type CodeBlockFields = {
  code?: string
  language?: string
}

type CodeBlockNode = {
  fields: CodeBlockFields
}

function createArticleConverters(headingIds: string[]): JSXConvertersFunction {
  let headingIndex = 0

  return ({ defaultConverters }) => ({
    ...defaultConverters,
    heading: ({ node, nodesToJSX }) => {
      const children = nodesToJSX({ nodes: node.children })
      const tag = node.tag

      if (tag === 'h2' || tag === 'h3') {
        const id = headingIds[headingIndex]
        headingIndex += 1
        const Tag = tag

        return <Tag id={id}>{children}</Tag>
      }

      const Tag = tag
      return <Tag>{children}</Tag>
    },
    blocks: {
      ...defaultConverters.blocks,
      Code: ({ node }: { node: CodeBlockNode }) => {
        const fields = node.fields as CodeBlockFields
        const code = fields.code ?? ''
        const language = fields.language

        return (
          <figure className="code-block">
            {language ? <figcaption className="code-block__language">{language}</figcaption> : null}
            <pre>
              <code data-language={language}>{code}</code>
            </pre>
          </figure>
        )
      },
    },
  })
}

export function ArticleBody({ content, headings }: ArticleBodyProps) {
  const headingIds = headings.map((heading) => heading.id)

  return (
    <div className="article-body">
      <RichText converters={createArticleConverters(headingIds)} data={content} />
    </div>
  )
}
