import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import type { TocItem } from '../data/formaCaseStudy'
import { useActiveSection } from '../hooks/useActiveSection'
import { TableOfContents } from './TableOfContents'

type Props = {
  title: string
  brand?: string
  toc: TocItem[]
  children: ReactNode
  heroImage?: string
  lede?: string
}

export function CaseStudyLayout({
  title,
  brand,
  toc,
  children,
  heroImage,
  lede,
}: Props) {
  const [tocOpen, setTocOpen] = useState(false)
  const activeId = useActiveSection(toc)

  return (
    <div className="page case-page">
      <header className="topbar">
        <Link className="brand" to="/">
          <span className="brand__back">←</span>
          <span>Po Yen Tseng</span>
        </Link>
        <button
          type="button"
          className="topbar__toc-btn"
          onClick={() => setTocOpen(true)}
        >
          Contents
        </button>
      </header>

      <section className="hero hero--case" id="top">
        <div className="hero__atmosphere" aria-hidden="true" />
        <div className="hero__copy">
          {brand ? <p className="hero__brand">{brand}</p> : null}
          <h1>{title}</h1>
          {lede ? <p className="hero__lede">{lede}</p> : null}
          <div className="hero__actions">
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => setTocOpen(true)}
            >
              Browse contents
            </button>
            <a className="btn btn--ghost" href={`#${toc[0]?.id ?? 'top'}`}>
              Start reading
            </a>
          </div>
        </div>
        {heroImage ? (
          <div className="hero__visual">
            <img src={heroImage} alt="" />
          </div>
        ) : null}
      </section>

      <div className="layout">
        <TableOfContents
          items={toc}
          activeId={activeId}
          open={tocOpen}
          onOpenChange={setTocOpen}
        />
        <main className="content">{children}</main>
      </div>
    </div>
  )
}

export function Figure({
  src,
  alt,
  caption,
}: {
  src: string
  alt: string
  caption?: string
}) {
  return (
    <figure className="figure">
      <img src={src} alt={alt} loading="lazy" />
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  )
}
