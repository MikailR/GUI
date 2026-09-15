import { HACKATHONS } from "../data/content";

export function Hackathons() {
  return (
    <div className="app-hacks">
      <header className="app-lead">
        <p className="eyebrow">Field notes</p>
        <h1>Weekends, rooms, prizes.</h1>
        <p>A short history of staying up too late in someone else's office.</p>
      </header>
      <ol className="timeline">
        {HACKATHONS.map((h) => (
          <li key={h.id}>
            <div className="tl-year">{h.year}</div>
            <article className="hack-card">
              <div className="hack-top">
                <span className="award">{h.award}</span>
                <span className="muted">
                  {h.event} · {h.city} · {h.date}
                </span>
              </div>
              <h2>{h.project}</h2>
              <p>{h.blurb}</p>
              <div className="chips dense">
                {h.stack.map((s) => (
                  <span key={s}>{s}</span>
                ))}
              </div>
            </article>
          </li>
        ))}
      </ol>
    </div>
  );
}
