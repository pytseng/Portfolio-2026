import { CaseStudyLayout } from '../components/CaseStudyLayout'
import type { TocItem } from '../data/formaCaseStudy'

const toc: TocItem[] = [
  { id: 'summary', label: 'Summary' },
  { id: 'try', label: 'Live demo' },
  { id: 'role', label: 'Role' },
  { id: 'challenges', label: 'Design challenges' },
]

const LIVE_URL = 'https://chat-ai-ux.vercel.app'

export function SecretStashPage() {
  return (
    <CaseStudyLayout
      brand="SecretStash"
      title="SecretStash"
      toc={toc}
      lede="An AI packing companion for international travelers planning outdoor adventures."
    >
      <section id="summary" className="section">
        <p className="section__label">Summary</p>
        <p>
          SecretStash helps international travelers prepare for outdoor
          adventures before they leave. Packing for hiking, camping, or
          multi-climate trips is hard when weather shifts by region and altitude,
          and when you already own half of what a generic list suggests.
        </p>
        <p>
          The product is a chat that turns trip context into a packing plan,
          then into shoppable suggestion cards grounded in live conditions and
          preferences. Travelers can mark what they already own, stash what to
          buy later, and keep past trips without starting from zero.
        </p>
        <p>
          <strong>Challenge:</strong> design an AI chat that stays on-scope,
          respects real weather and owned gear, and remains trustworthy when
          models and tools fail.
        </p>
      </section>

      <section id="try" className="section">
        <p className="section__label">Live demo</p>
        <p>
          Try the live app{' '}
          <a href={LIVE_URL} target="_blank" rel="noreferrer">
            here
          </a>{' '}
          or on your phone.
        </p>
        <div className="live-embed">
          <div className="clay-phone">
            <div className="clay-phone__shell">
              <div className="clay-phone__screen">
                <iframe
                  title="SecretStash live prototype"
                  src={LIVE_URL}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allow="clipboard-write"
                />
              </div>
            </div>
          </div>
        </div>
        <p className="live-embed__link">
          <a href={LIVE_URL} target="_blank" rel="noreferrer">
            Open live app ↗
          </a>
        </p>
      </section>

      <section id="role" className="section">
        <p className="section__label">Role</p>
        <p>
          Solo founder build: I designed, developed, and tested the entire app
          end-to-end as a startup idea: product framing, conversation UX,
          systems behavior, and the shipped web prototype.
        </p>
      </section>

      <section id="challenges" className="section section--last">
        <p className="section__label">Design challenges</p>
        <ul>
          <li>
            Grounding packing advice in reliable live weather and commerce data
            when default scraping fails
          </li>
          <li>
            Scoping the AI interaction: layered subject control, off-topic
            rejection, and redirect tone
          </li>
          <li>
            Making wait states legible: reasoning progress, pause controls, and
            calm stop messaging
          </li>
          <li>
            Suggestion cards with live image search, owned/revisit loops, and
            stash as durable memory
          </li>
          <li>
            Multi-turn memory under context limits: summarization, past chat,
            and new chat resets
          </li>
          <li>
            Expressing confidence without false certainty; designing for tool
            and LLM failure
          </li>
          <li>
            Practical retrieval (RAG) for categories, preferences, and product
            grounding
          </li>
          <li>
            Visual system: liquid motion background, glass UI, and artwork
            derived from the product collection
          </li>
        </ul>
        <p>
          This case study is still in progress. I’ll add more process detail
          soon.
        </p>
      </section>
    </CaseStudyLayout>
  )
}
