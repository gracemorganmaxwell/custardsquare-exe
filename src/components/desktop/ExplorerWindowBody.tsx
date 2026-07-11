'use client'

import Link from 'next/link'
import { useState } from 'react'

import {
  useDesktopStore,
  type ExplorerFolderId,
} from '@/lib/desktopStore'

export type ExplorerArticleItem = {
  slug: string
  title: string
}

type ExplorerWindowBodyProps = {
  articles: ExplorerArticleItem[]
}

type TreeItem = {
  folder: ExplorerFolderId
  iconSrc: string
  label: string
}

const TREE_ITEMS: TreeItem[] = [
  {
    folder: 'root',
    iconSrc: '/icons/desktop/this_computer.png',
    label: 'SECOND_BRAIN',
  },
  {
    folder: 'articles',
    iconSrc: '/icons/desktop/articles.png',
    label: 'Articles',
  },
  {
    folder: 'dreams',
    iconSrc: '/icons/desktop/projects.png',
    label: 'Dreams',
  },
  {
    folder: 'about',
    iconSrc: '/icons/desktop/about.png',
    label: 'About',
  },
]

function folderLabel(folder: ExplorerFolderId): string {
  if (folder === 'articles') {
    return 'Articles'
  }

  if (folder === 'dreams') {
    return 'Dreams'
  }

  if (folder === 'about') {
    return 'About'
  }

  return 'SECOND_BRAIN'
}

export function ExplorerWindowBody({ articles }: ExplorerWindowBodyProps) {
  const folder = useDesktopStore((state) => state.explorerFolder)
  const setExplorerFolder = useDesktopStore((state) => state.setExplorerFolder)
  const openWindow = useDesktopStore((state) => state.openWindow)
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null)

  const rootFolders = TREE_ITEMS.filter((item) => item.folder !== 'root')
  const objectCount =
    folder === 'articles'
      ? articles.length
      : folder === 'root'
        ? rootFolders.length
        : folder === 'dreams'
          ? 1
          : 1

  const selectedLabel =
    folder === 'articles' && selectedSlug
      ? (articles.find((article) => article.slug === selectedSlug)?.title ?? selectedSlug)
      : folderLabel(folder)

  return (
    <div className="explorer">
      <div className="explorer__panes">
        <ul aria-label="Folders" className="explorer__tree">
          {TREE_ITEMS.map((item) => (
            <li key={item.folder}>
              <button
                aria-current={folder === item.folder ? 'true' : undefined}
                className="explorer__tree-item"
                onClick={() => {
                  setSelectedSlug(null)
                  setExplorerFolder(item.folder)
                }}
                type="button"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img alt="" height={16} src={item.iconSrc} width={16} />
                {item.label}
              </button>
            </li>
          ))}
        </ul>

        <div aria-label={`${folderLabel(folder)} contents`} className="explorer__files">
          {folder === 'root' ? (
            <div className="explorer__file-grid">
              {rootFolders.map((item) => (
                <button
                  className="explorer__file"
                  key={item.folder}
                  onClick={() => setExplorerFolder(item.folder)}
                  type="button"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img alt="" className="explorer__file-icon" height={32} src={item.iconSrc} width={32} />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          ) : null}

          {folder === 'articles' ? (
            articles.length === 0 ? (
              <p className="explorer__empty">No published articles yet.</p>
            ) : (
              <div className="explorer__file-grid">
                {articles.map((article) => (
                  <Link
                    aria-current={selectedSlug === article.slug ? 'true' : undefined}
                    className="explorer__file"
                    href={`/articles/${article.slug}`}
                    key={article.slug}
                    onClick={() => setSelectedSlug(article.slug)}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      alt=""
                      className="explorer__file-icon"
                      height={32}
                      src="/icons/desktop/articles.png"
                      width={32}
                    />
                    <span>{article.title}</span>
                  </Link>
                ))}
              </div>
            )
          ) : null}

          {folder === 'dreams' ? (
            <p className="explorer__empty">Dreams folder — more content lands in a later milestone.</p>
          ) : null}

          {folder === 'about' ? (
            <div className="explorer__file-grid">
              <button
                className="explorer__file"
                onClick={() => openWindow('about', 'About')}
                type="button"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt=""
                  className="explorer__file-icon"
                  height={32}
                  src="/icons/desktop/about.png"
                  width={32}
                />
                <span>About.txt</span>
              </button>
            </div>
          ) : null}
        </div>
      </div>

      <div aria-label="Status bar" className="explorer__status">
        <div className="explorer__status-field">{objectCount} object(s)</div>
        <div className="explorer__status-field">Selected: {selectedLabel}</div>
        <div className="explorer__status-field">C:\</div>
      </div>
    </div>
  )
}
