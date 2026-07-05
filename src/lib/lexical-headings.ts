import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

import { slugify } from './slugify'

export type ArticleHeading = {
  id: string
  level: 2 | 3
  text: string
}

type LexicalNode = {
  type?: string
  tag?: string
  text?: string
  children?: LexicalNode[]
}

function getNodeText(node: LexicalNode): string {
  if (node.type === 'text' && typeof node.text === 'string') {
    return node.text
  }

  if (Array.isArray(node.children)) {
    return node.children.map((child) => getNodeText(child)).join('')
  }

  return ''
}

function walkNodes(nodes: LexicalNode[], headings: Omit<ArticleHeading, 'id'>[]): void {
  for (const node of nodes) {
    if (node.type === 'heading' && (node.tag === 'h2' || node.tag === 'h3')) {
      const text = getNodeText(node).trim()

      if (text.length > 0) {
        headings.push({
          level: node.tag === 'h2' ? 2 : 3,
          text,
        })
      }
    }

    if (Array.isArray(node.children)) {
      walkNodes(node.children, headings)
    }
  }
}

function assignHeadingIds(headings: Omit<ArticleHeading, 'id'>[]): ArticleHeading[] {
  const used = new Map<string, number>()

  return headings.map((heading) => {
    const base = slugify(heading.text) || 'section'
    const count = used.get(base) ?? 0
    used.set(base, count + 1)

    const id = count === 0 ? base : `${base}-${count + 1}`

    return {
      ...heading,
      id,
    }
  })
}

export function extractArticleHeadings(content: SerializedEditorState): ArticleHeading[] {
  const root = content.root as LexicalNode | undefined

  if (!root || !Array.isArray(root.children)) {
    return []
  }

  const headings: Omit<ArticleHeading, 'id'>[] = []
  walkNodes(root.children, headings)

  return assignHeadingIds(headings)
}
