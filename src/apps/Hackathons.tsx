import { hackathons } from '../data/content'

function fmt(d: string) {
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function Hackathons() {
  const wins = hackathons.filter((h) => /1st|2nd|Best/.test(h.place)).length
  return (
    <div className="app hack">
      <header className="app-head">
        <div>
          <p className="eyebrow">{hackathons.length} entries · {wins} podiums</p>
          <h1 className="display sm">
            Thirty-six hours at a time, <em>on purpose.</em>
          </h1>
        </div>
      </header>
      <ol className="timeline">
        {hackathons.map((h) => (
          <li key={h.name} className="tl-item">
            <div className="tl-rail">
              <span className="tl-dot" data-win={/1st/.test(h.place) || undefined} />
            </div>
            <article className="card">
              <div className="card-top">
                <span className={`tag ${/1st/.test(h.place) ? 'gold' : ''}`}>{h.place}</span>
                <time className="mono dim">{fmt(h.date)}</time>
              </div>
              <h3>{h.name}</h3>
              <p className="event">{h.event} · team of {h.team}</p>
              <p>{h.blurb}</p>
              <div className="chips">
                {h.stack.map((s) => (
                  <span key={s} className="chip">
                    {s}
                  </span>
                ))}
              </div>
            </article>
          </li>
        ))}
      </ol>
    </div>
  )
}
