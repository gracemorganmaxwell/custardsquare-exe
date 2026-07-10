const WORDS_PER_MINUTE = 200

function countWords(text: string): number {
  const trimmed = text.trim()
  if (trimmed.length === 0) {
    return 0
  }

  return trimmed.split(/\s+/).length
}

function extractTextFromLexical(node: unknown): string {
  if (!node || typeof node !== 'object') {
    return ''
  }

  const record = node as Record<string, unknown>
  const chunks: string[] = []

  if (typeof record.text === 'string') {
    chunks.push(record.text)
  }

  if (Array.isArray(record.children)) {
    for (const child of record.children) {
      chunks.push(extractTextFromLexical(child))
    }
  }

  return chunks.join(' ')
}

/** Estimate reading time in whole minutes (minimum 1 when any text exists). */
export function readingTimeMinutes(content: unknown, excerpt = ''): number {
  const bodyText = extractTextFromLexical(content)
  const words = countWords(`${excerpt} ${bodyText}`)

  if (words === 0) {
    return 0
  }

  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE))
}
