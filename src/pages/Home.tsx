import { lazy, Suspense } from 'react'
import { Link } from 'react-router-dom'
import { projects } from '../data/projects'

const FogRevealHero = lazy(() =>
  import('../components/home/FogRevealHero').then((m) => ({
    default: m.FogRevealHero,
  })),
)

export function Home() {
  return (
    <div className="home">
      <section className="bio-hero" aria-label="Bio">
        <div className="bio-hero__stage">
          <Suspense fallback={<div className="fog-hero fog-hero--fallback" />}>
            <FogRevealHero />
          </Suspense>
        </div>

        <div className="bio-hero__content">
          <p className="bio-hero__eyebrow">Portfolio 2026</p>
          <h1 className="bio-hero__name">Po Yen Tseng</h1>
          <p className="bio-hero__tagline">I Design, I Code, I Full-Stack.</p>
          <p className="bio-hero__hint">Move or tap to clear the fog</p>
          <a className="bio-hero__cta" href="#works">
            Explore works
            <span aria-hidden="true">↓</span>
          </a>
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
                  <h3>{project.title}</h3>
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
