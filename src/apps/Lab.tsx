import { Suspense, type CSSProperties } from 'react'
import { Glyph } from '../icons/Glyph'
import { experimentById, LAB_EXPERIMENTS, type ExperimentMeta } from '../lab/meta'
import { EXPERIMENT_COMPONENTS } from '../lab/registry'
import type { AppScreenProps } from '../os/types'
import { AppLoading } from './index'
import { AppPage, BackButton } from './shared'

export default function Lab({ shell, route, onRoute }: AppScreenProps) {
  const current = experimentById(route)

  if (current) {
    const Experiment = EXPERIMENT_COMPONENTS[current.id]
    const index = LAB_EXPERIMENTS.findIndex((e) => e.id === current.id)
    const next = LAB_EXPERIMENTS[(index + 1) % LAB_EXPERIMENTS.length]
    const prev = LAB_EXPERIMENTS[(index - 1 + LAB_EXPERIMENTS.length) % LAB_EXPERIMENTS.length]
    const nav = (
      <div className="lab-nav">
        <button type="button" className="glass-btn glass-btn--icon" aria-label={`Previous: ${prev.title}`} onClick={() => onRoute(prev.id)}>
          <Glyph name="chevron-left" size={16} />
        </button>
        <span className="lab-nav__count">
          {index + 1} / {LAB_EXPERIMENTS.length}
        </span>
        <button type="button" className="glass-btn glass-btn--icon" aria-label={`Next: ${next.title}`} onClick={() => onRoute(next.id)}>
          <Glyph name="chevron-right" size={16} />
        </button>
      </div>
    )
    return (
      <AppPage
        shell={shell}
        title={current.title}
        eyebrow={shell === 'desktop' ? <BackButton label="Lab" onClick={() => onRoute(null)} /> : current.tags.join(' · ')}
        toolbar={nav}
      >
        <div className="experiment" style={{ '--hue': current.hue } as CSSProperties}>
          <p className="experiment__blurb">{current.blurb}</p>
          <Suspense fallback={<AppLoading />}>
            <Experiment key={current.id} />
          </Suspense>
        </div>
      </AppPage>
    )
  }

  return (
    <AppPage shell={shell} title="Lab" eyebrow={`${LAB_EXPERIMENTS.length} playable experiments`}>
      <div className="shelf">
        {LAB_EXPERIMENTS.map((exp, i) => (
          <ShelfTile key={exp.id} exp={exp} index={i} onOpen={() => onRoute(exp.id)} />
        ))}
      </div>
    </AppPage>
  )
}

function ShelfTile({ exp, index, onOpen }: { exp: ExperimentMeta; index: number; onOpen: () => void }) {
  return (
    <button type="button" className="tile" style={{ '--hue': exp.hue, '--i': index } as CSSProperties} onClick={onOpen}>
      <span className="tile__art" aria-hidden="true">
        <TilePreview id={exp.id} />
      </span>
      <span className="tile__text">
        <span className="tile__title">{exp.title}</span>
        <span className="tile__blurb">{exp.blurb}</span>
      </span>
      <span className="tile__tags">
        {exp.tags.map((t) => (
          <span key={t} className="chip">
            {t}
          </span>
        ))}
      </span>
    </button>
  )
}

/** Tiny CSS-only vignette per experiment so the shelf reads as a set of objects, not a list. */
function TilePreview({ id }: { id: ExperimentMeta['id'] }) {
  switch (id) {
    case 'spring':
      return (
        <span className="pv pv-spring">
          <span className="pv-spring__line" />
          <span className="pv-spring__orb" />
        </span>
      )
    case 'glass':
      return (
        <span className="pv pv-glass">
          <span className="pv-glass__blob" />
          <span className="pv-glass__pane" />
        </span>
      )
    case 'lens':
      return (
        <span className="pv pv-lens">
          <span className="pv-lens__lines" />
          <span className="pv-lens__lens" />
        </span>
      )
    case 'type':
      return <span className="pv pv-type">Aa</span>
    case 'curves':
      return (
        <svg className="pv pv-curves" viewBox="0 0 100 100" aria-hidden="true">
          <path d="M10 90 C 30 90, 30 10, 90 10" />
          <circle cx="30" cy="90" r="4" />
          <circle cx="30" cy="10" r="4" />
        </svg>
      )
    case 'ripples':
      return (
        <span className="pv pv-ripples">
          <span />
          <span />
          <span />
        </span>
      )
    case 'concentric':
      return (
        <span className="pv pv-conc">
          <span>
            <span />
          </span>
        </span>
      )
    case 'dock':
      return (
        <span className="pv pv-dock">
          <span />
          <span />
          <span />
          <span />
          <span />
        </span>
      )
    default: {
      const exhaustive: never = id
      return exhaustive
    }
  }
}
