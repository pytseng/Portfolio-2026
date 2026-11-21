import { useEffect, useRef, useState, type ReactNode } from 'react'
import { ArrowDown } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import type { TocItem } from '../data/formaCaseStudy'
import { nextCaseStudy } from '../data/projects'
import { useActiveSection } from '../hooks/useActiveSection'
import { TableOfContents } from './TableOfContents'

type Props = {
  title: string
  brand?: string
  toc: TocItem[]
  children: ReactNode
  heroImage?: string
  heroAlt?: string
  /** Above-the-fold hero: eager load and high fetch priority. */
  heroPriority?: boolean
  lede?: string
  /** Short facts already in the case study data, in display order. */
  facts?: string[]
  /** Live demo or app. Renders "Try the live app" when set. */
  liveUrl?: string
}

const HERO_ZOOM_MAX = 1.25
const DESKTOP_MQ = '(min-width: 1024px)'
const SCROLL_DELTA = 6

export function CaseStudyLayout({
  title,
  brand,
  toc,
  children,
  heroImage,
  heroAlt = '',
  heroPriority = false,
  lede,
  facts,
  liveUrl,
}: Props) {
  const { pathname } = useLocation()
  const next = nextCaseStudy(pathname)
  const heading = brand || title
  const factLine = facts?.map((item) => item.trim()).filter(Boolean) ?? []
  const firstSection = toc[0]?.id
  const [tocOpen, setTocOpen] = useState(false)
  const [topbarHidden, setTopbarHidden] = useState(false)
  const [pillHidden, setPillHidden] = useState(false)
  const [pastHero, setPastHero] = useState(false)
  const activeId = useActiveSection(toc)
  const heroRef = useRef<HTMLElement>(null)
  const copyRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const zoomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const title = titleRef.current
    const container = copyRef.current
    if (!title || !container) return

    let frame = 0
    let cancelled = false

    const fit = () => {
      title.style.fontSize = ''
      const maxSize = parseFloat(getComputedStyle(title).fontSize)
      const available = title.clientWidth
      if (available <= 0 || !(maxSize > 0)) return
      if (title.scrollWidth <= available + 1) return

      let low = Math.min(12, maxSize)
      let high = maxSize
      for (let i = 0; i < 14; i += 1) {
        const mid = (low + high) / 2
        title.style.fontSize = `${mid}px`
        if (title.scrollWidth <= title.clientWidth + 0.5) low = mid
        else high = mid
      }
      title.style.fontSize = `${low}px`
    }

    const schedule = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(fit)
    }

    schedule()
    const observer = new ResizeObserver(schedule)
    observer.observe(container)
    document.fonts.ready.then(() => {
      if (!cancelled) schedule()
    })

    return () => {
      cancelled = true
      cancelAnimationFrame(frame)
      observer.disconnect()
      title.style.fontSize = ''
    }
  }, [heading])

  useEffect(() => {
    const desktop = window.matchMedia(DESKTOP_MQ)
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    let anchor = window.scrollY
    let hiddenTop = false
    let hiddenPill = false
    let passed = false
    let raf = 0

    const apply = () => {
      const y = window.scrollY
      const delta = y - anchor
      const hero = heroRef.current
      const heroPassed = hero ? hero.getBoundingClientRect().bottom <= 1 : false
      let nextTop = hiddenTop
      let nextPill = hiddenPill

      if (reduce.matches || desktop.matches) {
        nextTop = false
        nextPill = false
        anchor = y
      } else if (y < 12) {
        nextTop = false
        if (delta < -SCROLL_DELTA) nextPill = false
        anchor = y
      } else if (delta > SCROLL_DELTA) {
        nextTop = true
        nextPill = true
        anchor = y
      } else if (delta < -SCROLL_DELTA) {
        nextTop = false
        nextPill = false
        anchor = y
      }

      if (nextTop !== hiddenTop || nextPill !== hiddenPill || heroPassed !== passed) {
        hiddenTop = nextTop
        hiddenPill = nextPill
        passed = heroPassed
        setTopbarHidden(nextTop)
        setPillHidden(nextPill)
        setPastHero(heroPassed)
      }
    }

    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(apply)
    }

    apply()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    desktop.addEventListener('change', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      desktop.removeEventListener('change', onScroll)
    }
  }, [])

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
    <div
      className={[
        'page case-page',
        topbarHidden ? 'is-topbar-hidden' : '',
        pillHidden ? 'is-pill-hidden' : '',
        pastHero ? 'is-past-hero' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <header className="topbar">
        <div className="topbar__bar">
          <Link className="brand" to="/#works">
            <img className="brand__mark" src="/mark-header.svg" alt="" />
            <span>Po Yen Tseng</span>
          </Link>
        </div>
      </header>

      <section className="hero hero--case" id="top" ref={heroRef}>
        <div className="hero__copy" ref={copyRef}>
          <h1 className="hero__brand" ref={titleRef}>
            {heading}
          </h1>
          {factLine.length > 0 ? (
            <p className="hero__facts">{factLine.join(' · ')}</p>
          ) : null}
          {lede ? <p className="hero__lede">{lede}</p> : null}
          <div className="hero__actions">
            <a className="btn btn--primary" href={`#${firstSection ?? 'top'}`}>
              Start reading
              <ArrowDown className="btn__icon" aria-hidden="true" />
            </a>
            {liveUrl ? (
              <a
                className="btn btn--ghost"
                href={liveUrl}
                target="_blank"
                rel="noopener"
              >
                Try the live app
              </a>
            ) : null}
          </div>
        </div>
        {heroImage ? (
          <div className="hero__visual">
            <div className="hero__visual-zoom" ref={zoomRef}>
              <img
                src={heroImage}
                alt={heroAlt}
                fetchPriority={heroPriority ? 'high' : undefined}
                loading={heroPriority ? 'eager' : undefined}
              />
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
          next={next}
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
