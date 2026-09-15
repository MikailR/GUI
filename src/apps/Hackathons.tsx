import { useMemo, useState } from 'react';
import { hackathons, type Hackathon, type Placement } from '../content';
import { Glyph } from '../os/icons';
import { ContourArt, formatDate, Segmented, usePayload } from './shared';

type Filter = 'all' | 'wins' | 'podium';
type View = 'grid' | 'list';

const years = [...new Set(hackathons.map((h) => h.date.slice(0, 4)))];

export function Medal({ placement, size = 34 }: { placement: Placement; size?: number }) {
  const tone = { '1st': 'gold', '2nd': 'silver', '3rd': 'bronze', Finalist: 'final', Special: 'special' }[placement];
  const text = placement === 'Finalist' ? 'F' : placement === 'Special' ? '★' : placement.replace(/\D/g, '');
  return (
    <span className={`medal medal--${tone}`} style={{ width: size, height: size }} title={placement}>
      <span>{text}</span>
    </span>
  );
}

export function Hackathons() {
  const [filter, setFilter] = useState<Filter>('all');
  const [view, setView] = useState<View>('grid');
  const [year, setYear] = useState<string | null>(null);
  const [q, setQ] = useState('');
  const [selected, setSelected] = useState<string | null>(null);

  usePayload((p) => {
    if (hackathons.some((h) => h.id === p)) {
      setFilter('all');
      setYear(null);
      setQ('');
      setSelected(p);
    }
  });

  const items = useMemo(
    () =>
      hackathons.filter((h) => {
        if (filter === 'wins' && h.placement !== '1st') return false;
        if (filter === 'podium' && !['1st', '2nd', '3rd'].includes(h.placement)) return false;
        if (year && !h.date.startsWith(year)) return false;
        if (q && !`${h.project} ${h.event} ${h.city} ${h.stack.join(' ')}`.toLowerCase().includes(q.toLowerCase())) return false;
        return true;
      }),
    [filter, year, q],
  );
  const sel = hackathons.find((h) => h.id === selected) ?? null;
  const totalHours = hackathons.reduce((s, h) => s + h.hours, 0);

  return (
    <div className={`finder ${sel ? 'has-inspector' : ''}`}>
      <aside className="finder__side">
        <div className="side__group">Library</div>
        <button className={`side__item ${!year ? 'is-on' : ''}`} onClick={() => setYear(null)}>
          <Glyph.grid /> All events <span>{hackathons.length}</span>
        </button>
        {years.map((y) => (
          <button key={y} className={`side__item ${year === y ? 'is-on' : ''}`} onClick={() => setYear(y)}>
            <Glyph.clock /> {y} <span>{hackathons.filter((h) => h.date.startsWith(y)).length}</span>
          </button>
        ))}
        <div className="side__group">Totals</div>
        <div className="side__stat">
          <b>{hackathons.filter((h) => h.placement === '1st').length}</b> first places
        </div>
        <div className="side__stat">
          <b>{totalHours}</b> hours awake
        </div>
        <div className="side__stat">
          <b>{new Set(hackathons.map((h) => h.city)).size}</b> cities
        </div>
      </aside>

      <div className="finder__main">
        <div className="toolbar">
          <Segmented
            label="Filter"
            value={filter}
            onChange={setFilter}
            options={[
              { value: 'all', label: 'All' },
              { value: 'podium', label: 'Podium' },
              { value: 'wins', label: 'Wins' },
            ]}
          />
          <div className="toolbar__spacer" />
          <label className="search-field">
            <Glyph.search />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search" aria-label="Search hackathons" />
          </label>
          <Segmented
            label="View"
            value={view}
            onChange={setView}
            options={[
              { value: 'grid', label: <Glyph.grid aria-label="Grid" /> },
              { value: 'list', label: <Glyph.list aria-label="List" /> },
            ]}
          />
        </div>

        {items.length === 0 && <div className="empty">Nothing matches. Maybe it’s time for another hackathon.</div>}

        {view === 'grid' ? (
          <div className="hk-grid">
            {items.map((h, i) => (
              <button key={h.id} className={`hk-card ${selected === h.id ? 'is-selected' : ''}`} style={{ '--i': i } as React.CSSProperties} onClick={() => setSelected(selected === h.id ? null : h.id)}>
                <div className="hk-card__cover">
                  <ContourArt seed={h.id} hue={h.hue} />
                  <Medal placement={h.placement} />
                  <span className="hk-card__date">{formatDate(h.date, { month: 'short', year: 'numeric' })}</span>
                </div>
                <div className="hk-card__body">
                  <strong>{h.project}</strong>
                  <span>{h.event}</span>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <table className="hk-table">
            <thead>
              <tr>
                <th>Project</th>
                <th>Event</th>
                <th>Result</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {items.map((h) => (
                <tr key={h.id} className={selected === h.id ? 'is-selected' : ''} onClick={() => setSelected(h.id)} tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && setSelected(h.id)}>
                  <td>
                    <strong>{h.project}</strong>
                  </td>
                  <td>{h.event}</td>
                  <td>
                    <span className="hk-place">
                      <Medal placement={h.placement} size={18} /> {h.placement}
                    </span>
                  </td>
                  <td className="mono">{h.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {sel && <Inspector h={sel} onClose={() => setSelected(null)} />}
    </div>
  );
}

function Inspector({ h, onClose }: { h: Hackathon; onClose: () => void }) {
  return (
    <aside className="inspector" key={h.id}>
      <button className="inspector__close" onClick={onClose} aria-label="Close inspector">
        <Glyph.close />
      </button>
      <div className="inspector__cover">
        <ContourArt seed={h.id} hue={h.hue} />
        <Medal placement={h.placement} size={48} />
      </div>
      <h2>{h.project}</h2>
      <p className="inspector__pitch">{h.pitch.replace(/\*/g, '')}</p>
      <dl className="inspector__meta">
        <div>
          <dt>Event</dt>
          <dd>{h.event}</dd>
        </div>
        <div>
          <dt>Result</dt>
          <dd>
            {h.placement}
            {h.prize ? ` · ${h.prize}` : ''}
          </dd>
        </div>
        <div>
          <dt>When</dt>
          <dd>{formatDate(h.date)}</dd>
        </div>
        <div>
          <dt>Where</dt>
          <dd>{h.city}</dd>
        </div>
        <div>
          <dt>Team</dt>
          <dd>
            {h.team === 1 ? 'Solo' : `${h.team} people`} · {h.hours}h
          </dd>
        </div>
      </dl>
      <p className="inspector__detail">{h.detail}</p>
      <div className="chips">
        {h.stack.map((s) => (
          <span key={s} className="chip">
            {s}
          </span>
        ))}
      </div>
    </aside>
  );
}
