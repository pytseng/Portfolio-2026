import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import type { TocItem } from '../data/formaCaseStudy'

const DESKTOP_MQ = '(min-width: 1024px)'
const HEADING_OFFSET = 24

type NextStudy = {
  title: string
  path: string
}

type Props = {
  items: TocItem[]
  activeId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  next: NextStudy | null
}

function headingTop(section: HTMLElement) {
  const heading =
    section.querySelector<HTMLElement>(
      ':scope > .section__label, :scope > h2, :scope > h3',
    ) ?? section
  return heading.getBoundingClientRect().top + window.scrollY
}

export function TableOfContents({
  items,
  activeId,
  open,
  onOpenChange,
  next,
}: Props) {
  const activeLabel =
    items.find((item) => item.id === activeId)?.label ?? 'Contents'

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    const desktop = window.matchMedia(DESKTOP_MQ)
    const onChange = () => {
      if (desktop.matches) onOpenChange(false)
    }
    desktop.addEventListener('change', onChange)
    return () => desktop.removeEventListener('change', onChange)
  }, [onOpenChange])

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    onOpenChange(false)
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const top = headingTop(el) - HEADING_OFFSET
    requestAnimationFrame(() => {
      window.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' })
    })
  }

  return (
    <>
      <aside className="toc-rail" aria-label="Table of contents">
        <Link className="toc-rail__home" to="/#works">
          <img className="toc-rail__mark" src="/mark-header.svg" alt="" />
          <span>All work</span>
        </Link>
        <p className="toc-rail__eyebrow">Contents</p>
        <ol className="toc-rail__list">
          {items.map((item, index) => (
            <li key={item.id}>
              <button
                type="button"
                className={
                  item.id === activeId
                    ? 'toc-rail__link is-active'
                    : 'toc-rail__link'
                }
                onClick={() => scrollTo(item.id)}
              >
                <span className="toc-rail__index">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ol>
        {next ? (
          <Link className="toc-rail__next" to={next.path}>
            Next: {next.title} →
          </Link>
        ) : null}
      </aside>

      <div className="toc-mobile">
        <button
          type="button"
          className="toc-mobile__trigger"
          aria-expanded={open}
          aria-controls="toc-sheet"
          onClick={() => onOpenChange(true)}
        >
          <span className="toc-mobile__line">
            Contents
            <span aria-hidden="true"> · </span>
            <span className="toc-mobile__current">{activeLabel}</span>
          </span>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="toc-sheet"
            id="toc-sheet"
            role="dialog"
            aria-modal="true"
            aria-label="Table of contents"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <button
              type="button"
              className="toc-sheet__backdrop"
              aria-label="Close contents"
              onClick={() => onOpenChange(false)}
            />
            <motion.div
              className="toc-sheet__panel"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            >
              <div className="toc-sheet__handle" aria-hidden="true" />
              <div className="toc-sheet__header">
                <p className="toc-sheet__title">Jump to section</p>
                <button
                  type="button"
                  className="toc-sheet__close"
                  onClick={() => onOpenChange(false)}
                >
                  Close
                </button>
              </div>
              <ol className="toc-sheet__list">
                {items.map((item, index) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      className={
                        item.id === activeId
                          ? 'toc-sheet__link is-active'
                          : 'toc-sheet__link'
                      }
                      onClick={() => scrollTo(item.id)}
                    >
                      <span className="toc-sheet__index">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span>{item.label}</span>
                    </button>
                  </li>
                ))}
              </ol>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
