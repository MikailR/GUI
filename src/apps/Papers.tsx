import { PAPERS } from "../data/content";

export function Papers() {
  return (
    <div className="app-papers">
      <header className="app-lead">
        <p className="eyebrow">Papers / analyses</p>
        <h1>Working notes, not journals.</h1>
      </header>
      <div className="paper-list">
        {PAPERS.map((p) => (
          <article key={p.id} className="paper-card">
            <div className="paper-meta">
              <span>{p.venue}</span>
              <span>{p.year}</span>
            </div>
            <h2>{p.title}</h2>
            <p>{p.abstract}</p>
            <div className="chips dense">
              {p.tags.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
