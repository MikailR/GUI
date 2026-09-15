import { useState } from 'react'
import { papers } from '../data/content'

export function Papers() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <div className="app papers">
      <header className="app-head">
        <div>
          <p className="eyebrow">{papers.length} documents</p>
          <h1 className="display sm">
            Analyses, reading notes, <em>one talk.</em>
          </h1>
        </div>
      </header>
      <ul className="plain paper-list">
        {papers.map((p, i) => (
          <li key={p.title} className={`paper ${open === i ? 'open' : ''}`}>
            <button className="paper-row" onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i}>
              <div className="paper-thumb" aria-hidden="true">
                <span className="mono">pdf</span>
              </div>
              <div className="paper-main">
                <div className="card-top">
                  <span className="tag">{p.kind}</span>
                  <span className="mono dim">{p.year}</span>
                </div>
                <h3>{p.title}</h3>
                <p className="event">{p.venue}</p>
              </div>
            </button>
            {open === i && (
              <div className="paper-body">
                <p>{p.abstract}</p>
                <div className="chips">
                  {p.tags.map((t) => (
                    <span key={t} className="chip">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
