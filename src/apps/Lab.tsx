import { Suspense, type CSSProperties } from 'react'
import { Symbol } from '../icons/Symbol'
import { EXPERIMENTS, experimentById, type Experiment } from '../lab/registry'
import { AppFrame } from './frame'
import type { AppProps } from './types'

export default function Lab({ shell, route, onRoute }: AppProps) {
  const selected = experimentById(route)
  const nested = shell === 'ios' && selected !== undefined

  const sidebar = (
    <div className="lab-list">
      {shell === 'mac' ? <div className="mac-sidebar-title">Experiments</div> : null}
      <div className="lab-grid" data-shell={shell}>
        {EXPERIMENTS.map((experiment) => (
          <button
            key={experiment.id}
            type="button"
            className="lab-tile"
            aria-current={selected?.id === experiment.id || undefined}
            onClick={() => onRoute(experiment.id)}
            style={{ '--hue': experiment.hue } as CSSProperties}
          >
            <span className="lab-tile-icon squircle">
              <Symbol name={experiment.symbol} size={shell === 'mac' ? 16 : 22} weight={2.2} />
            </span>
            <span className="lab-tile-text">
              <span className="lab-tile-name">{experiment.name}</span>
              <span className="lab-tile-tagline">{experiment.tagline}</span>
            </span>
            {shell === 'ios' ? <Symbol name="chevron.right" size={13} weight={2.6} className="ui-row-chevron" /> : null}
          </button>
        ))}
      </div>
    </div>
  )

  return (
    <AppFrame
      shell={shell}
      title="Lab"
      detailTitle={selected?.name}
      nested={nested}
      onBack={() => onRoute('')}
      sidebar={sidebar}
      sidebarWidth={260}
      flush
      plainHeader={nested}
    >
      {selected ? (
        <ExperimentView experiment={selected} compact={shell === 'ios'} />
      ) : (
        <LabIntro onPick={(id) => onRoute(id)} />
      )}
    </AppFrame>
  )
}

function LabIntro({ onPick }: { onPick: (id: string) => void }) {
  return (
    <div className="lab-intro">
      <div className="lab-intro-mark">
        <Symbol name="flask" size={40} weight={1.8} />
      </div>
      <h1>Pick an experiment</h1>
      <p>Seven small toys about the material this OS is made of: glass, squircles, springs and the Dock’s curve.</p>
      <button type="button" className="ui-button" data-variant="filled" onClick={() => onPick(EXPERIMENTS[0].id)}>
        Start with {EXPERIMENTS[0].name}
      </button>
    </div>
  )
}

function ExperimentView({ experiment, compact }: { experiment: Experiment; compact: boolean }) {
  const { Component } = experiment
  return (
    <div className="lab-stage" style={{ '--hue': experiment.hue } as CSSProperties}>
      <header className="lab-stage-head">
        <div>
          <h1>{experiment.name}</h1>
          <p>{experiment.description}</p>
        </div>
        <div className="lab-stage-tags">
          {experiment.tags.map((tag) => (
            <span key={tag} className="ui-chip">
              {tag}
            </span>
          ))}
        </div>
      </header>
      <Suspense fallback={<div className="app-loading">Loading experiment…</div>}>
        <Component compact={compact} />
      </Suspense>
    </div>
  )
}
