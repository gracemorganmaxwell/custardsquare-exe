'use client'

import Link from 'next/link'
import { useState } from 'react'

export type ArticlesWindowItem = {
  slug: string
  title: string
}

type ArticlesWindowProps = {
  articles: ArticlesWindowItem[]
}

export function ArticlesWindow({ articles }: ArticlesWindowProps) {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null)
  const selected =
    selectedSlug === null
      ? null
      : (articles.find((article) => article.slug === selectedSlug) ?? null)

  return (
    <div className="articles-window">
      <div className="articles-window__toolbar" aria-hidden="true">
        <span>Published articles</span>
        <span>{articles.length} item(s)</span>
      </div>

      {articles.length === 0 ? (
        <p className="articles-window__empty">No published articles yet.</p>
      ) : (
        <ul aria-label="Published articles" className="articles-window__list">
          {articles.map((article) => (
            <li key={article.slug}>
              <Link
                aria-current={selectedSlug === article.slug ? 'true' : undefined}
                className="articles-window__row"
                href={`/articles/${article.slug}`}
                onClick={() => setSelectedSlug(article.slug)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img alt="" height={16} src="/icons/desktop/articles.png" width={16} />
                <span className="articles-window__title">{article.title}</span>
                <span className="articles-window__path">/articles/{article.slug}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <div aria-label="Status bar" className="articles-window__status">
        <div className="articles-window__status-field">
          {selected ? `Selected: ${selected.title}` : 'Ready'}
        </div>
        <div className="articles-window__status-field">{articles.length} object(s)</div>
      </div>
    </div>
  )
}
