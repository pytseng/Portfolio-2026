import { useEffect, useState } from 'react'
import type { TocItem } from '../data/formaCaseStudy'

const ROOT_MARGIN = '-30% 0px -60% 0px'

function sectionHeading(section: HTMLElement) {
  return (
    section.querySelector<HTMLElement>(
      ':scope > .section__label, :scope > h2, :scope > h3',
    ) ?? section
  )
}

/** Last section whose heading has reached ~30% from the top of the viewport. */
function activeSectionId(elements: HTMLElement[]) {
  const line = window.innerHeight * 0.3
  let current = elements[0]?.id ?? ''
  for (const el of elements) {
    if (sectionHeading(el).getBoundingClientRect().top <= line) current = el.id
  }
  return current
}

export function useActiveSection(items: TocItem[]) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? '')

  useEffect(() => {
    const elements = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => Boolean(el))

    if (elements.length === 0) return

    const pick = () => {
      const next = activeSectionId(elements)
      setActiveId((current) => (current === next ? current : next))
    }

    const observer = new IntersectionObserver(pick, {
      rootMargin: ROOT_MARGIN,
      threshold: [0, 0.01, 1],
    })

    elements.forEach((el) => observer.observe(el))

    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(pick)
    }

    pick()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [items])

  return activeId
}
