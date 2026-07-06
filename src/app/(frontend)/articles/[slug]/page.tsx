import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { ArticleBody } from '@/components/article/ArticleBody'
import { ArticleTableOfContents } from '@/components/article/ArticleTableOfContents'
import { getPublishedArticleBySlug } from '@/lib/articles'
import { extractArticleHeadings } from '@/lib/lexical-headings'
import { buildArticleMetadata, SITE_NAME } from '@/lib/seo'

import '../articles.css'

export const dynamic = 'force-dynamic'

type ArticlePageProps = {
  params: Promise<{
    slug: string
  }>
}

function formatDate(value: string | null | undefined): string {
  if (!value) {
    return ''
  }

  return new Intl.DateTimeFormat('en-NZ', {
    dateStyle: 'long',
  }).format(new Date(value))
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params
  const article = await getPublishedArticleBySlug(slug)

  if (!article) {
    return {
      title: `Article not found | ${SITE_NAME}`,
    }
  }

  return buildArticleMetadata(article)
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params
  const article = await getPublishedArticleBySlug(slug)

  if (!article) {
    notFound()
  }

  const headings = article.content ? extractArticleHeadings(article.content) : []
  const hasToc = headings.length >= 2

  return (
    <div className="article-page">
      <article className={`article-shell${hasToc ? ' article-shell-wide' : ''}`}>
        <Link className="article-back" href="/articles">
          ← All articles
        </Link>

        <header className="article-header">
          <h1>{article.title}</h1>
          {article.excerpt ? <p className="article-excerpt">{article.excerpt}</p> : null}
          <p className="article-meta">{formatDate(article.publishedAt)}</p>
        </header>

        <div className={hasToc ? 'article-layout article-layout--with-toc' : 'article-layout'}>
          {hasToc ? <ArticleTableOfContents headings={headings} /> : null}
          {article.content ? <ArticleBody content={article.content} headings={headings} /> : null}
        </div>
      </article>
    </div>
  )
}
