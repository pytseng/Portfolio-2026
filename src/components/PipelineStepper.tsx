import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import styles from './PipelineStepper.module.css'

const IMAGE_MS = 5000

export type Step = {
  id: string
  num: string
  title: string
  description: string
  kind: 'image' | 'video'
  src: string
  alt: string
  plays: number
  objectPosition: string
  poster?: string
}

type Props = {
  editorSrc?: string
  cloudSrc?: string
  storeSrc?: string
  steps?: Step[]
  idPrefix?: string
  label?: string
}

function usePrefersReducedMotion() {
  const [reduce, setReduce] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReduce(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return reduce
}

export function PipelineStepper({
  editorSrc = '',
  cloudSrc = '',
  storeSrc = '',
  steps: customSteps,
  idPrefix = 'pipeline',
  label = 'From the editor to a live storefront',
}: Props) {
  const pipelineSteps: Step[] = useMemo(
    () => [
      {
        id: 'editor',
        num: '01',
        title: 'Forma Editor: Build the model once',
        description:
          'Set up variants and rules, then upload to Unity Cloud in one click.',
        kind: 'image',
        src: editorSrc,
        alt: 'Forma Editor after a model is uploaded to Forma Cloud, with a magic link',
        plays: 1,
        objectPosition: 'center',
      },
      {
        id: 'cloud',
        num: '02',
        title: 'Forma Cloud: Manage it as a product',
        description:
          'The model and every creation become one catalogue product, with analytics on how it performs.',
        kind: 'video',
        src: cloudSrc,
        alt: 'Forma Cloud walkthrough of managing a catalogue product',
        plays: 1,
        objectPosition: 'center',
      },
      {
        id: 'store',
        num: '03',
        title: 'Ecommerce: Sell it live',
        description:
          'The 3D configurator runs on the storefront, and approved changes reach every endpoint.',
        kind: 'video',
        src: storeSrc,
        alt: 'A live storefront playing the 3D configurator',
        plays: 2,
        objectPosition: 'top center',
      },
    ],
    [editorSrc, cloudSrc, storeSrc],
  )
  const steps = customSteps ?? pipelineSteps

  const reduce = usePrefersReducedMotion()
  const [index, setIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [inView, setInView] = useState(false)
  const [run, setRun] = useState(0)

  const rootRef = useRef<HTMLDivElement>(null)
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([])
  const indexRef = useRef(0)
  const inViewRef = useRef(false)
  const reduceRef = useRef(reduce)
  const playsDone = useRef(0)
  const imageElapsed = useRef(0)
  const advanced = useRef(false)

  indexRef.current = index
  inViewRef.current = inView
  reduceRef.current = reduce

  const go = (next: number, focus = false) => {
    const i = (next + steps.length) % steps.length
    const same = i === indexRef.current
    playsDone.current = 0
    imageElapsed.current = 0
    advanced.current = false
    setProgress(0)
    const video = videoRefs.current[i]
    if (video) video.currentTime = 0
    indexRef.current = i
    if (same) setRun((n) => n + 1)
    else setIndex(i)
    if (focus) tabRefs.current[i]?.focus()
    const tab = tabRefs.current[i]
    const row = tab?.parentElement
    if (tab && row && row.scrollWidth > row.clientWidth + 4) {
      row.scrollTo({
        left: tab.offsetLeft - row.offsetLeft - 8,
        behavior: 'auto',
      })
    }
  }

  useEffect(() => {
    const node = rootRef.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.4 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const videos = videoRefs.current
    const active = videos[index]

    if (reduce || !inView) {
      videos.forEach((video) => video?.pause())
      return
    }

    videos.forEach((video, i) => {
      if (video && i !== index) video.pause()
    })

    if (active && steps[index].kind === 'video') {
      void active.play().catch(() => {})
    }

    let frame = 0
    const imageStart = performance.now() - imageElapsed.current

    const tick = (now: number) => {
      const step = steps[index]
      if (step.kind === 'image') {
        const elapsed = now - imageStart
        imageElapsed.current = elapsed
        const next = elapsed / IMAGE_MS
        if (next >= 1) {
          setProgress(1)
          if (!advanced.current) {
            advanced.current = true
            go(indexRef.current + 1)
          }
          return
        }
        setProgress(next)
      } else if (active?.duration) {
        const total = active.duration * step.plays
        const current = playsDone.current * active.duration + active.currentTime
        setProgress(Math.min(1, current / total))
      }
      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(frame)
      videos.forEach((video) => video?.pause())
    }
  }, [index, inView, reduce, run, steps])

  const onEnded = (i: number) => {
    if (i !== indexRef.current) return
    if (reduceRef.current || !inViewRef.current) return
    const step = steps[i]
    playsDone.current += 1
    if (playsDone.current < step.plays) {
      const video = videoRefs.current[i]
      if (!video) return
      video.currentTime = 0
      void video.play().catch(() => {})
      return
    }
    go(i + 1)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const last = steps.length - 1
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      go(index + 1, true)
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      go(index - 1, true)
    } else if (event.key === 'Home') {
      event.preventDefault()
      go(0, true)
    } else if (event.key === 'End') {
      event.preventDefault()
      go(last, true)
    }
  }

  const active = steps[index]

  return (
    <div ref={rootRef}>
      <div
        className={styles.steps}
        style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}
        role="tablist"
        aria-label={label}
        onKeyDown={onKeyDown}
      >
        {steps.map((step, i) => {
          const selected = i === index
          return (
            <button
              key={step.id}
              ref={(node) => {
                tabRefs.current[i] = node
              }}
              type="button"
              role="tab"
              id={`${idPrefix}-tab-${step.id}`}
              className={styles.step}
              aria-selected={selected}
              aria-controls={`${idPrefix}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => go(i)}
            >
              <span className={styles.bar} aria-hidden="true">
                <span
                  className={styles.fill}
                  style={{ width: selected ? `${progress * 100}%` : '0%' }}
                />
              </span>
              <span className={styles.num}>{step.num}</span>
              <span className={styles.title}>{step.title}</span>
              <span className={styles.desc}>{step.description}</span>
            </button>
          )
        })}
      </div>
      <div
        className={styles.frame}
        role="tabpanel"
        id={`${idPrefix}-panel`}
        aria-labelledby={`${idPrefix}-tab-${active.id}`}
      >
        {steps.map((step, i) => {
          const on = i === index
          const position = { objectPosition: step.objectPosition }
          return (
            <div
              key={step.id}
              className={on ? `${styles.layer} ${styles.layerOn}` : styles.layer}
              aria-hidden={!on}
            >
              {step.kind === 'image' ? (
                <img
                  className={styles.media}
                  src={step.src}
                  alt={on ? step.alt : ''}
                  style={{
                    ...position,
                    transform:
                      on && !reduce
                        ? `scale(${1 + 0.06 * progress})`
                        : undefined,
                  }}
                />
              ) : (
                <video
                  ref={(node) => {
                    videoRefs.current[i] = node
                  }}
                  className={styles.media}
                  style={position}
                  src={step.src}
                  poster={step.poster}
                  muted
                  autoPlay={!reduce && on}
                  playsInline
                  preload="metadata"
                  controls={reduce}
                  aria-label={step.alt}
                  onEnded={() => onEnded(i)}
                  onLoadedMetadata={(event) => {
                    if (!reduceRef.current) return
                    const video = event.currentTarget
                    video.pause()
                    if (video.currentTime === 0) video.currentTime = 0.01
                  }}
                />
              )}
            </div>
          )
        })}
      </div>
      <p className={styles.under}>{active.description}</p>
    </div>
  )
}
