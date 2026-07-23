import { lazy, Suspense, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { LockIcon } from '../components/PasswordGate'
import { HeroGrid } from '../components/home/HeroGrid'
import { projects } from '../data/projects'

const FogRevealHero = lazy(() =>
  import('../components/home/FogRevealHero').then((m) => ({
    default: m.FogRevealHero,
  })),
)

export function Home({ live = true }: { live?: boolean }) {
  const [worldBroken, setWorldBroken] = useState(false)
  const stitchApi = useRef<(() => void) | null>(null)

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
          <h2>Selected projects</h2>
        </header>
        <ul className="works__list">
          {projects.map((project, index) => (
            <li key={project.slug}>
              <Link className="work-card" to={project.path}>
                <div className="work-card__media">
                  <img src={project.thumbnail} alt="" loading="lazy" />
                </div>
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
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
