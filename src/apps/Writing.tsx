import { useState } from "react";
import { ESSAYS } from "../data/content";

export function Writing() {
  const [slug, setSlug] = useState<string | null>(null);
  const essay = ESSAYS.find((e) => e.slug === slug);

  if (essay) {
    return (
      <article className="essay">
        <button type="button" className="back" onClick={() => setSlug(null)}>
          ← Index
        </button>
        <p className="eyebrow">
          {essay.date} · {essay.minutes} min
        </p>
        <h1>{essay.title}</h1>
        <p className="dek">{essay.dek}</p>
        {essay.body.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </article>
    );
  }

  return (
    <div className="app-writing">
      <header className="app-lead">
        <p className="eyebrow">Writing</p>
        <h1>Notes from a machine.</h1>
      </header>
      <ul className="essay-index">
        {ESSAYS.map((e) => (
          <li key={e.slug}>
            <button type="button" onClick={() => setSlug(e.slug)}>
              <span className="muted">
                {e.date} · {e.minutes} min
              </span>
              <strong>{e.title}</strong>
              <em>{e.dek}</em>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
