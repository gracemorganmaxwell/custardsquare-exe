import Link from 'next/link'

import { getPublishedArticles } from '@/lib/articles'
import { buildArticlesIndexMetadata } from '@/lib/seo'

import './articles.css'

export const dynamic = 'force-dynamic'

export const metadata = buildArticlesIndexMetadata()

function formatDate(value: string | null | undefined): string {
  if (!value) {
    return ''
  }

  return new Intl.DateTimeFormat('en-NZ', {
    dateStyle: 'long',
  }).format(new Date(value))
}

export default async function ArticlesPage() {
  const articles = await getPublishedArticles()

  return (
    <div className="article-page">
      <div className="article-shell article-shell-wide">
        <Link className="article-back" href="/">
          ← custardsquare.exe
        </Link>

        <header className="article-list-header">
          <h1>Articles</h1>
          <p>Long-form notes from the second brain.</p>
        </header>

        {articles.length === 0 ? (
          <p className="article-empty">No published articles yet. Check back soon.</p>
        ) : (
          <ul className="article-list">
            {articles.map((article) => (
              <li key={article.id}>
                <article className="article-card">
                  <h2>
                    <Link href={`/articles/${article.slug}`}>{article.title}</Link>
                  </h2>
                  <p>{article.excerpt}</p>
                  <p className="article-meta">{formatDate(article.publishedAt)}</p>
                </article>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
