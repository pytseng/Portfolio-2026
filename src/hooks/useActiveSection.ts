import { useEffect, useState } from 'react'
import type { TocItem } from '../data/formaCaseStudy'

export function useActiveSection(items: TocItem[]) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? '')

  useEffect(() => {
    const elements = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => Boolean(el))

    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0) ||
              a.boundingClientRect.top - b.boundingClientRect.top,
          )

        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id)
        }
      },
      {
        rootMargin: '-20% 0px -55% 0px',
        threshold: [0, 0.15, 0.4, 0.7],
      },
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [items])

  return activeId
}
