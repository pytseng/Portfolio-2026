import { useEffect, useRef, useState, type ReactNode } from 'react'
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

const HERO_ZOOM_MAX = 1.25

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
  const heroRef = useRef<HTMLElement>(null)
  const zoomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const hero = heroRef.current
    const zoom = zoomRef.current
    if (!hero || !zoom || !heroImage) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (reduceMotion.matches) return

    let raf = 0
    const update = () => {
      const rect = hero.getBoundingClientRect()
      const travel = Math.max(rect.height * 0.85, 1)
      const progress = Math.min(1, Math.max(0, -rect.top / travel))
      const scale = 1 + progress * (HERO_ZOOM_MAX - 1)
      zoom.style.transform = `scale(${scale})`
    }

    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [heroImage])

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

      <section className="hero hero--case" id="top" ref={heroRef}>
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
            <div className="hero__visual-zoom" ref={zoomRef}>
              <img src={heroImage} alt="" />
            </div>
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
  className,
}: {
  src: string
  alt: string
  caption?: string
  className?: string
}) {
  return (
    <figure className={['figure', className].filter(Boolean).join(' ')}>
      <img src={src} alt={alt} loading="lazy" />
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  )
}
