import { useState } from 'react';
import { hackathons, posts, profile } from '../content';
import { Glyph } from '../os/icons';
import { useOS } from '../os/store';
import { Segmented } from './shared';

type Tab = 'overview' | 'now' | 'path';

export function About() {
  const os = useOS();
  const [tab, setTab] = useState<Tab>('overview');
  const wins = hackathons.filter((h) => h.placement === '1st').length;

  return (
    <div className="about">
      <aside className="about__card">
        <Portrait />
        <h1 className="about__name">{profile.name}</h1>
        <p className="about__role">{profile.role}</p>
        <p className="about__loc">
          <Glyph.mapPin /> {profile.location}
        </p>
        <div className="about__stats">
          <button onClick={() => os.open('hackathons')}>
            <b>{hackathons.length}</b>
            <span>hackathons</span>
          </button>
          <button onClick={() => os.open('hackathons', { payload: hackathons.find((h) => h.placement === '1st')!.id })}>
            <b>{wins}</b>
            <span>wins</span>
          </button>
          <button onClick={() => os.open('writing')}>
            <b>{posts.length}</b>
            <span>essays</span>
          </button>
        </div>
        <ul className="about__links">
          {profile.links.map((l) => (
            <li key={l.label}>
              <a href={l.href} onClick={(e) => (e.preventDefault(), os.notify({ title: l.label, body: `${l.value} — placeholder link in this prototype.`, app: 'about' }))}>
                <span>{l.label}</span>
                <span className="about__link-v">{l.value}</span>
                <Glyph.external />
              </a>
            </li>
          ))}
        </ul>
      </aside>

      <div className="about__main">
        <div className="about__tabs">
          <Segmented
            label="About sections"
            value={tab}
            onChange={setTab}
            options={[
              { value: 'overview', label: 'Overview' },
              { value: 'now', label: 'Now' },
              { value: 'path', label: 'Path' },
            ]}
          />
        </div>

        {tab === 'overview' && (
          <div className="about__pane" key="o">
            <p className="about__tagline">{profile.tagline}</p>
            {profile.bio.map((p) => (
              <p key={p.slice(0, 12)}>{p}</p>
            ))}
            <dl className="specs">
              {profile.specs.map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        {tab === 'now' && (
          <div className="about__pane" key="n">
            <p className="about__muted">A /now page, updated whenever something changes. Last edit: September 2026.</p>
            <div className="now-grid">
              {profile.now.map((n, i) => (
                <div className="now-tile" key={n.k} style={{ '--i': i } as React.CSSProperties}>
                  <span>{n.k}</span>
                  <p>{n.v}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'path' && (
          <ol className="about__pane path" key="p">
            {profile.timeline.map((t, i) => (
              <li key={t.org} style={{ '--i': i } as React.CSSProperties}>
                <span className="path__year">{t.year}</span>
                <div>
                  <h3>
                    {t.title} <em>· {t.org}</em>
                  </h3>
                  <p>{t.note}</p>
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}

function Portrait() {
  return (
    <div className="portrait">
      <svg viewBox="0 0 120 120" aria-hidden>
        <defs>
          <radialGradient id="pg" cx=".35" cy=".3" r=".9">
            <stop offset="0" stopColor="var(--accent)" />
            <stop offset="1" stopColor="#2a1633" />
          </radialGradient>
          <clipPath id="pc">
            <circle cx="60" cy="60" r="58" />
          </clipPath>
        </defs>
        <circle cx="60" cy="60" r="58" fill="url(#pg)" />
        <g clipPath="url(#pc)" fill="none" stroke="#fff">
          {Array.from({ length: 9 }, (_, i) => (
            <path
              key={i}
              d={`M${-10} ${30 + i * 11} C 30 ${14 + i * 11 + (i % 2) * 8}, 70 ${46 + i * 11}, 130 ${22 + i * 11}`}
              strokeOpacity={i % 4 === 2 ? 0.5 : 0.18}
              strokeWidth={i % 4 === 2 ? 1.4 : 0.8}
            />
          ))}
        </g>
        <path d="M38 80V42l22 22 22-22v38" fill="none" stroke="#fff" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="portrait__status" title="Open to interesting problems" />
    </div>
  );
}
