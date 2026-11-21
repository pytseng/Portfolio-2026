import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'
import { MediaPlaceholder } from './MediaPlaceholder'
import { PipelineStepper, type Step } from './PipelineStepper'
import styles from './FormaAiSection.module.css'

type Still = {
  id: string
  label: string
  alt: string
  src: string | null
  placeholder: string
}

type Clip = Still & {
  poster: string | null
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

function RoleDiagram() {
  return (
    <div className={styles.diagram}>
      <figure className={styles.panel}>
        <figcaption className={styles.panelName}>Zapier Copilot</figcaption>
        <div className={styles.stage}>
          <div className={styles.graph} aria-hidden="true">
            <svg className={styles.wires} viewBox="0 0 200 160" preserveAspectRatio="none">
              <path
                d="M48 36 H108 M128 36 H150 V78 H128 M48 78 H90 M110 78 H150 M70 120 H128"
                fill="none"
                stroke="#c4c2bc"
                strokeWidth="1.5"
              />
            </svg>
            <span className={styles.node} style={{ top: '8%', left: '8%' }} />
            <span className={styles.node} style={{ top: '8%', left: '54%' }} />
            <span className={styles.node} style={{ top: '40%', left: '30%' }} />
            <span className={styles.node} style={{ top: '68%', left: '52%' }} />
          </div>
          <div className={styles.dock} aria-hidden="true">
            <span className={styles.bar} style={{ width: '72%' }} />
            <span className={styles.bar} style={{ width: '90%' }} />
            <span className={styles.bar} style={{ width: '54%' }} />
            <span className={styles.bubble} />
          </div>
        </div>
        <p className={styles.panelCaption}>AI helps you run the builder.</p>
      </figure>
      <figure className={styles.panel}>
        <figcaption className={styles.panelName}>Forma AI</figcaption>
        <div className={styles.stage}>
          <div className={styles.catalogue} aria-hidden="true">
            <span className={styles.card} />
            <span className={styles.card} />
            <span className={styles.card} />
            <span className={styles.card} />
            <span className={styles.card} />
            <span className={styles.card} />
          </div>
          <div className={`${styles.dock} ${styles.dockOn}`} aria-hidden="true">
            <span className={styles.bar} style={{ width: '80%' }} />
            <span className={styles.bar} style={{ width: '62%' }} />
            <span className={styles.bar} style={{ width: '88%' }} />
            <span className={styles.bubble} />
          </div>
        </div>
        <p className={styles.panelCaption}>AI is how the work gets done.</p>
      </figure>
    </div>
  )
}

function Pair({
  label,
  items,
}: {
  label: string
  items: Array<Still | Clip>
}) {
  const [index, setIndex] = useState(0)
  const reduce = usePrefersReducedMotion()
  const frameRef = useRef<HTMLDivElement>(null)
  const uid = useId()

  useEffect(() => {
    const root = frameRef.current
    if (!root) return
    root.querySelectorAll('video').forEach((video) => {
      if (video.dataset.on === 'true' && !reduce) {
        void video.play().catch(() => {})
      } else {
        video.pause()
      }
    })
  }, [index, reduce])

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      setIndex((index + 1) % items.length)
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      setIndex((index - 1 + items.length) % items.length)
    }
  }

  return (
    <div>
      <div className={styles.tabs} role="tablist" aria-label={label} onKeyDown={onKeyDown}>
        {items.map((item, i) => (
          <button
            key={item.id}
            id={`${uid}-${item.id}`}
            type="button"
            role="tab"
            className={styles.tab}
            aria-selected={i === index}
            aria-controls={`${uid}-panel`}
            tabIndex={i === index ? 0 : -1}
            onClick={() => setIndex(i)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div
        ref={frameRef}
        className={styles.frame}
        role="tabpanel"
        id={`${uid}-panel`}
        aria-labelledby={`${uid}-${items[index].id}`}
      >
        {items.map((item, i) => {
          const on = i === index
          return (
            <div
              key={item.id}
              className={on ? `${styles.layer} ${styles.layerOn}` : styles.layer}
              aria-hidden={!on}
            >
              {item.src ? (
                'poster' in item ? (
                  <video
                    data-on={on ? 'true' : 'false'}
                    muted
                    loop
                    playsInline
                    preload="auto"
                    poster={item.poster ?? undefined}
                    controls={reduce}
                    tabIndex={on && reduce ? 0 : -1}
                    aria-label={item.alt}
                  >
                    <source src={item.src} type="video/mp4" />
                  </video>
                ) : (
                  <img src={item.src} alt={on ? item.alt : ''} />
                )
              ) : (
                <MediaPlaceholder id={item.placeholder} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

type Props = {
  chips: string | null
  offtopic: string | null
  offtopicPoster: string | null
  reasoning: string | null
  reasoningPoster: string | null
  hover: string | null
  steps: Step[]
}

export function FormaAiSection({
  chips,
  offtopic,
  offtopicPoster,
  reasoning,
  reasoningPoster,
  hover,
  steps,
}: Props) {
  return (
    <section id="ai" className="section">
      <p className="section__label">AI design</p>
      <h2>Designing Forma AI</h2>
      <p>Forma AI is the part I spent the most time on. Four decisions shaped it.</p>

      <div className={styles.decision}>
        <p className={styles.num}>01</p>
        <h3>Decide the role first</h3>
        <p>
          Before designing anything, I asked what role the AI plays. Zapier had a
          full automation builder before AI, so its Copilot is an assistant. It
          helps you run the builder, so the builder has to stay next to the chat.
        </p>
        <p>
          Forma AI is different. It's the main way to get the job done. You
          describe a rule in one sentence, and it turns that into an agent. The
          flow is simple enough that a full builder would only add back and forth
          between layers. So I kept Forma AI in a side panel, with no node graph
          and no full-page builder. If agents grew more complex, I'd design it
          differently.
        </p>
        <RoleDiagram />
      </div>

      <div className={styles.decision}>
        <div className={styles.split}>
          <div>
            <p className={styles.num}>02</p>
            <h3>Keep it on the job</h3>
            <p>
              Forma AI only does Forma Cloud work, and you can tell before you
              type. The starter chips show what it's good at. Ask something
              unrelated, like a FIFA score, and it says so and points you back.
              Off-topic questions never reach the model. Ask for something it can
              do, like automating publishing, and it does the work.
            </p>
          </div>
          <div className={styles.media}>
            <Pair
              label="Forma AI stays on Forma Cloud work"
              items={[
                {
                  id: 'chips',
                  label: 'Starter chips',
                  alt: 'Forma AI open beside the catalogue, with starter chips for publishing, endpoints, activity, and review',
                  src: chips,
                  placeholder: 'MEDIA::forma-cloud::ai-chips',
                },
                {
                  id: 'offtopic',
                  label: 'Off topic',
                  alt: 'Forma AI refusing a sports-score question and pointing back to Forma Cloud',
                  src: offtopic,
                  poster: offtopicPoster,
                  placeholder: 'MEDIA::forma-cloud::ai-offtopic',
                },
              ]}
            />
          </div>
        </div>
      </div>

      <div className={styles.decision}>
        <div className={`${styles.split} ${styles.splitFlip}`}>
          <div className={styles.media}>
            <Pair
              label="How Forma AI shows its work"
              items={[
                {
                  id: 'reasoning',
                  label: 'A question',
                  alt: 'Forma AI showing each reasoning step, then an answer about which storefronts are behind',
                  src: reasoning,
                  poster: reasoningPoster,
                  placeholder: 'MEDIA::forma-cloud::ai-reasoning',
                },
                {
                  id: 'hover',
                  label: 'A rule',
                  alt: 'The agent setup card with a row hovered, showing the words the rule came from',
                  src: hover,
                  placeholder: 'MEDIA::forma-cloud::ai-rule-hover',
                },
              ]}
            />
          </div>
          <div>
            <p className={styles.num}>03</p>
            <h3>Show how it gets there</h3>
            <p>
              For a question, it shows each step: reading the question, checking
              the workspace, matching records, then writing the answer. For a
              rule, every line on the setup card traces back to your own words.
              Hover a row and it shows what you said, like "ask Sofia before
              Salesforce."
            </p>
          </div>
        </div>
      </div>

      <div className={styles.decision}>
        <p className={styles.num}>04</p>
        <h3>Create an agent in four steps</h3>
        <p>
          Describe the rule in one sentence. Review the setup card. Run a test
          on a real sample update to see exactly what would happen. Save it, and
          the agent lives in the Agents tab, where you can see its rule, pause
          it, or delete it.
        </p>
        <PipelineStepper
          steps={steps}
          idPrefix="ai-agent"
          label="Create an agent in four steps"
        />
      </div>
    </section>
  )
}
