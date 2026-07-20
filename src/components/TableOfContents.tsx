import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'
import type { TocItem } from '../data/formaCaseStudy'

type Props = {
  items: TocItem[]
  activeId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TableOfContents({
  items,
  activeId,
  open,
  onOpenChange,
}: Props) {
  const activeLabel =
    items.find((item) => item.id === activeId)?.label ?? 'Contents'

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    onOpenChange(false)
    requestAnimationFrame(() => {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  return (
    <>
      <aside className="toc-rail" aria-label="Table of contents">
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
      </aside>

      <div className="toc-mobile">
        <button
          type="button"
          className="toc-mobile__trigger"
          aria-expanded={open}
          aria-controls="toc-sheet"
          onClick={() => onOpenChange(true)}
        >
          <span className="toc-mobile__meta">
            <span className="toc-mobile__label">Contents</span>
            <span className="toc-mobile__current">{activeLabel}</span>
          </span>
          <span className="toc-mobile__icon" aria-hidden="true">
            <span />
            <span />
            <span />
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
