import type { ArticleHeading } from '@/lib/lexical-headings'

type ArticleTableOfContentsProps = {
  headings: ArticleHeading[]
}

export function ArticleTableOfContents({ headings }: ArticleTableOfContentsProps) {
  if (headings.length < 2) {
    return null
  }

  return (
    <nav aria-label="Table of contents" className="article-toc">
      <p className="article-toc__title">On this page</p>
      <ol className="article-toc__list">
        {headings.map((heading) => (
          <li
            className={heading.level === 3 ? 'article-toc__item article-toc__item--nested' : 'article-toc__item'}
            key={heading.id}
          >
            <a className="article-toc__link" href={`#${heading.id}`}>
              {heading.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
