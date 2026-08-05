import { lazy, Suspense, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { LockIcon } from '../components/PasswordGate'
import { HeroGrid } from '../components/home/HeroGrid'
import {
  projects,
  workLanes,
  type ProjectLane,
} from '../data/projects'

const FogRevealHero = lazy(() =>
  import('../components/home/FogRevealHero').then((m) => ({
    default: m.FogRevealHero,
  })),
)

export function Home({ live = true }: { live?: boolean }) {
  const [worldBroken, setWorldBroken] = useState(false)
  const [lane, setLane] = useState<ProjectLane>('selected')
  const stitchApi = useRef<(() => void) | null>(null)
  const activeLane = workLanes.find((item) => item.id === lane) ?? workLanes[0]
  const visibleProjects = projects.filter((project) => project.lane === lane)

  return (
    <div className="home">
      <section className="bio-hero" aria-label="Bio">
        <HeroGrid active={live} />

        <div className="bio-hero__stage">
          <Suspense fallback={<div className="fog-hero fog-hero--fallback" />}>
            <FogRevealHero
              active={live}
              onBrokenChange={setWorldBroken}
              stitchApi={stitchApi}
            />
          </Suspense>
        </div>

        <div className="bio-hero__content">
          <h1 className="bio-hero__name">
            <span className="bio-hero__name-line">Po Yen</span>
            <span className="bio-hero__name-line">Tseng</span>
          </h1>

          <p className="bio-hero__tagline">
            <span className="hl hl--blue">
              Deconstruct, construct, and everything in between
            </span>
          </p>

          <div className="bio-hero__actions">
            <a className="bio-hero__cta" href="#works">
              Explore works
              <span className="bio-hero__cta-arrow" aria-hidden="true">
                ↓
              </span>
            </a>
            {worldBroken && (
              <button
                type="button"
                className="bio-hero__cta bio-hero__cta--stitch"
                onClick={() => {
                  stitchApi.current?.()
                  setWorldBroken(false)
                }}
              >
                Stitch the world back
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="works" id="works">
        <header className="works__header">
          <p className="works__eyebrow">Works</p>
          <div
            className="works__tabs"
            role="tablist"
            aria-label="Project lanes"
          >
            {workLanes.map((item) => {
              const selected = item.id === lane
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  id={`works-tab-${item.id}`}
                  aria-selected={selected}
                  aria-controls="works-panel"
                  className={[
                    'works__tab',
                    selected ? 'works__tab--active' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => setLane(item.id)}
                >
                  {item.label}
                </button>
              )
            })}
          </div>
          <h2>{activeLane.heading}</h2>
        </header>
        <div
          id="works-panel"
          role="tabpanel"
          aria-labelledby={`works-tab-${lane}`}
        >
          {visibleProjects.length === 0 ? (
            <p className="works__empty">{activeLane.empty}</p>
          ) : (
            <ul className="works__list">
              {visibleProjects.map((project, index) => {
                const media = (
                  <div className="work-card__media">
                    {project.thumbnail ? (
                      <img src={project.thumbnail} alt="" loading="lazy" />
                    ) : (
                      <span className="work-card__fallback" aria-hidden="true">
                        {project.title.slice(0, 1)}
                      </span>
                    )}
                  </div>
                )
                const meta = (
                  <div className="work-card__meta">
                    <span className="work-card__index">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <h3>
                      <span>{project.title}</span>
                      {project.locked ? (
                        <LockIcon className="work-card__lock" />
                      ) : null}
                    </h3>
                    <p>{project.blurb}</p>
                  </div>
                )

                return (
                  <li key={project.slug}>
                    {project.liveUrl ? (
                      <a
                        className="work-card"
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {media}
                        {meta}
                      </a>
                    ) : (
                      <Link className="work-card" to={project.path}>
                        {media}
                        {meta}
                      </Link>
                    )}
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </section>
    </div>
  )
}
