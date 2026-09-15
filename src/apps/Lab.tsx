import { experiments, type Experiment } from '../data/content'

function Demo({ kind }: { kind: Experiment['demo'] }) {
  switch (kind) {
    case 'orbit':
      return (
        <div className="d-orbit">
          <i />
          <i />
          <i />
        </div>
      )
    case 'wave':
      return (
        <div className="d-wave">
          {Array.from({ length: 12 }, (_, i) => (
            <i key={i} />
          ))}
        </div>
      )
    case 'conic':
      return <div className="d-conic" />
    case 'grid':
      return (
        <div className="d-grid">
          {Array.from({ length: 36 }, (_, i) => (
            <i key={i} style={{ '--i': (i % 6) + Math.floor(i / 6) } as React.CSSProperties} />
          ))}
        </div>
      )
    case 'cursor':
      return (
        <div className="d-cursor">
          <span>hello, window.</span>
        </div>
      )
    case 'spring':
      return (
        <div className="d-spring">
          <i />
        </div>
      )
  }
}

export function Lab() {
  return (
    <div className="app lab">
      <header className="app-head">
        <div>
          <p className="eyebrow">{experiments.length} experiments · all CSS, no canvas</p>
          <h1 className="display sm">
            Things that <em>move</em> for no good reason.
          </h1>
        </div>
      </header>
      <div className="lab-grid">
        {experiments.map((e) => (
          <article key={e.id} className="lab-card">
            <div className="lab-stage">
              <Demo kind={e.demo} />
            </div>
            <div className="lab-meta">
              <div className="card-top">
                <h3>{e.title}</h3>
                <span className="mono dim">{e.year}</span>
              </div>
              <p>{e.note}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
