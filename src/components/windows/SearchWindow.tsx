'use client'

import Link from 'next/link'
import { useState } from 'react'

export type SearchWindowItem = {
  excerpt: string
  slug: string
  title: string
}

type SearchWindowProps = {
  articles: SearchWindowItem[]
}

function matchesQuery(article: SearchWindowItem, query: string): boolean {
  const needle = query.trim().toLowerCase()
  if (!needle) {
    return true
  }

  return (
    article.title.toLowerCase().includes(needle) ||
    article.excerpt.toLowerCase().includes(needle)
  )
}

export function SearchWindow({ articles }: SearchWindowProps) {
  const [query, setQuery] = useState('')
  const [selectedSlug, setSelectedSlug] = useState('')

  const filtered = articles.filter((article) => matchesQuery(article, query))
  const selected = filtered.find((article) => article.slug === selectedSlug)
  const hasQuery = query.trim().length > 0

  return (
    <div className="search-window">
      <div className="search-window__toolbar">
        <label className="search-window__label" htmlFor="desktop-search-query">
          Find what:
        </label>
        <input
          autoComplete="off"
          className="search-window__input"
          id="desktop-search-query"
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Filter by title or excerpt…"
          spellCheck={false}
          type="search"
          value={query}
        />
      </div>

      {articles.length === 0 ? (
        <p className="search-window__empty">No published articles yet.</p>
      ) : filtered.length === 0 ? (
        <p className="search-window__empty">
          No articles match “{query.trim()}”.
        </p>
      ) : (
        <ul aria-label="Search results" className="search-window__list">
          {filtered.map((article) => (
            <li key={article.slug}>
              <Link
                aria-current={selectedSlug === article.slug ? 'true' : undefined}
                className="search-window__row"
                href={`/articles/${article.slug}`}
                onClick={() => setSelectedSlug(article.slug)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img alt="" height={16} src="/icons/desktop/articles.png" width={16} />
                <span className="search-window__text">
                  <span className="search-window__title">{article.title}</span>
                  <span className="search-window__excerpt">{article.excerpt}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <div aria-label="Status bar" className="search-window__status">
        <div className="search-window__status-field">
          {selected ? `Selected: ${selected.title}` : hasQuery ? 'Filtered' : 'Ready'}
        </div>
        <div className="search-window__status-field">
          {filtered.length} of {articles.length} result(s)
        </div>
      </div>
    </div>
  )
}
