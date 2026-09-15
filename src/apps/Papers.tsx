import { useEffect, useRef, useState } from 'react';
import { papers, profile, type Paper } from '../content';
import { Glyph } from '../os/icons';
import { useOS } from '../os/store';
import { usePayload } from './shared';

export function Papers() {
  const os = useOS();
  const [id, setId] = useState(papers[0].id);
  const [zoom, setZoom] = useState(1);
  const [page, setPage] = useState(1);
  const [sidebar, setSidebar] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const paper = papers.find((p) => p.id === id)!;

  usePayload((p) => papers.some((x) => x.id === p) && setId(p));

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
    setPage(1);
    const root = scrollRef.current!;
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (vis) setPage(Number((vis.target as HTMLElement).dataset.page));
      },
      { root, threshold: [0.25, 0.5, 0.75] },
    );
    root.querySelectorAll('.page').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [id]);

  return (
    <div className={`preview ${sidebar ? '' : 'no-sidebar'}`}>
      <div className="toolbar">
        <button className={`icon-btn ${sidebar ? 'is-on' : ''}`} onClick={() => setSidebar((s) => !s)} aria-label="Toggle sidebar">
          <Glyph.sidebar />
        </button>
        <div className="toolbar__doc">
          <strong>{paper.title}</strong>
          <span className="mono">
            page {page} of {paper.pages}
          </span>
        </div>
        <div className="toolbar__spacer" />
        <div className="zoom">
          <button className="icon-btn" onClick={() => setZoom((z) => Math.max(0.6, +(z - 0.1).toFixed(2)))} aria-label="Zoom out">
            <Glyph.zoomOut />
          </button>
          <button className="zoom__value mono" onClick={() => setZoom(1)}>
            {Math.round(zoom * 100)}%
          </button>
          <button className="icon-btn" onClick={() => setZoom((z) => Math.min(1.6, +(z + 0.1).toFixed(2)))} aria-label="Zoom in">
            <Glyph.zoomIn />
          </button>
        </div>
        <button className="btn btn--ghost" onClick={() => os.notify({ title: 'Download started', body: `${paper.id}.pdf — just kidding, it’s a prototype.`, app: 'papers' })}>
          PDF
        </button>
      </div>

      <aside className="preview__side">
        {papers.map((p) => (
          <button key={p.id} className={`thumb ${p.id === id ? 'is-on' : ''}`} onClick={() => setId(p.id)}>
            <span className="thumb__page">
              <i className="thumb__title" />
              <i />
              <i />
              <i className="thumb__fig" />
              <i />
            </span>
            <span className="thumb__label">
              <strong>{p.title}</strong>
              <small>
                {p.kind} · {p.date}
              </small>
            </span>
          </button>
        ))}
      </aside>

      <div className="preview__scroll" ref={scrollRef}>
        <div className="preview__pages" style={{ '--zoom': zoom } as React.CSSProperties} key={paper.id}>
          <Pages paper={paper} />
        </div>
      </div>
    </div>
  );
}

function Pages({ paper }: { paper: Paper }) {
  const [s1, s2, s3] = paper.sections;
  return (
    <>
      <section className="page" data-page="1">
        <p className="page__kind">
          {paper.kind} · {paper.date}
        </p>
        <h1>{paper.title}</h1>
        <p className="page__authors">
          {profile.name} <sup>1</sup> · with colleagues at Framecut <sup>2</sup>
        </p>
        <div className="page__abstract">
          <strong>Abstract</strong>
          <p>{paper.abstract}</p>
        </div>
        <div className="page__cols">
          <h2>{s1.h}</h2>
          <p>{s1.p}</p>
          <p>
            All analysis code is reproducible from a pinned lockfile. Figures were rendered from the same data files that ship with the repository, so every number in this document can be regenerated.
          </p>
        </div>
        <span className="page__num">1</span>
      </section>
      <section className="page" data-page="2">
        <figure className="page__figure">
          <Chart fig={paper.figure} />
          <figcaption>{paper.figure.caption}</figcaption>
        </figure>
        <div className="page__cols">
          <h2>{s2.h}</h2>
          <p>{s2.p}</p>
        </div>
        <span className="page__num">2</span>
      </section>
      <section className="page" data-page="3">
        <div className="page__cols">
          <h2>{s3.h}</h2>
          <p>{s3.p}</p>
          <h2>References</h2>
          <ol className="page__refs">
            <li>W3C Web Performance WG. Long Animation Frames API. 2025.</li>
            <li>Lewis, P. &amp; Ivanov, G. FLIP Your Animations. 2015.</li>
            <li>Mikail. “Sixteen milliseconds is a design material.” mikail.os/writing, 2026.</li>
          </ol>
        </div>
        <span className="page__num">3</span>
      </section>
    </>
  );
}

/** Single-series chart: one hue, recessive grid, direct label on the peak, hover tooltip. */
function Chart({ fig }: { fig: Paper['figure'] }) {
  const [hover, setHover] = useState<number | null>(null);
  const W = 520;
  const H = 220;
  const pad = { l: 36, r: 12, t: 16, b: 30 };
  const max = Math.ceil(Math.max(...fig.data.map((d) => d.value)) / 10) * 10 + 10;
  const iw = W - pad.l - pad.r;
  const ih = H - pad.t - pad.b;
  const y = (v: number) => pad.t + ih - (v / max) * ih;
  const ticks = [0, max / 2, max];
  const peak = fig.data.reduce((a, b, i) => (b.value > fig.data[a].value ? i : a), 0);
  const band = iw / fig.data.length;

  return (
    <div className="chart">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={fig.caption}>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={pad.l} x2={W - pad.r} y1={y(t)} y2={y(t)} className="chart__grid" />
            <text x={pad.l - 8} y={y(t) + 4} textAnchor="end" className="chart__tick">
              {t}
            </text>
          </g>
        ))}
        {fig.kind === 'bar' &&
          fig.data.map((d, i) => {
            const bw = Math.min(56, band * 0.56);
            const x = pad.l + band * i + (band - bw) / 2;
            const top = y(d.value);
            const h = pad.t + ih - top;
            const r = Math.min(4, h);
            return (
              <g key={d.label} onPointerEnter={() => setHover(i)} onPointerLeave={() => setHover(null)}>
                <rect x={pad.l + band * i} y={pad.t} width={band} height={ih} fill="transparent" />
                <path
                  d={`M${x} ${pad.t + ih}V${top + r}q0 -${r} ${r} -${r}h${bw - 2 * r}q${r} 0 ${r} ${r}V${pad.t + ih}Z`}
                  className={`chart__bar ${hover !== null && hover !== i ? 'is-dim' : ''}`}
                />
                <text x={x + bw / 2} y={H - 10} textAnchor="middle" className="chart__tick">
                  {d.label}
                </text>
                {i === peak && hover === null && (
                  <text x={x + bw / 2} y={top - 6} textAnchor="middle" className="chart__label">
                    {d.value}
                    {fig.unit}
                  </text>
                )}
              </g>
            );
          })}
        {fig.kind === 'line' && (
          <>
            <polyline
              className="chart__line"
              points={fig.data.map((d, i) => `${pad.l + band * i + band / 2},${y(d.value)}`).join(' ')}
            />
            {fig.data.map((d, i) => {
              const cx = pad.l + band * i + band / 2;
              return (
                <g key={d.label} onPointerEnter={() => setHover(i)} onPointerLeave={() => setHover(null)}>
                  <rect x={pad.l + band * i} y={pad.t} width={band} height={ih} fill="transparent" />
                  {hover === i && <line x1={cx} x2={cx} y1={pad.t} y2={pad.t + ih} className="chart__cross" />}
                  <circle cx={cx} cy={y(d.value)} r={hover === i ? 5 : 4} className="chart__dot" />
                  <text x={cx} y={H - 10} textAnchor="middle" className="chart__tick">
                    {d.label}
                  </text>
                  {i === peak && hover === null && (
                    <text x={cx} y={y(d.value) - 10} textAnchor="middle" className="chart__label">
                      {d.value} {fig.unit}
                    </text>
                  )}
                </g>
              );
            })}
          </>
        )}
      </svg>
      {hover !== null && (
        <div
          className="chart__tip"
          style={{ left: `${((pad.l + band * hover + band / 2) / W) * 100}%`, top: `${(y(fig.data[hover].value) / H) * 100}%` }}
        >
          <span>{fig.data[hover].label}</span>
          <b>
            {fig.data[hover].value}
            {fig.unit === '%' ? '%' : ` ${fig.unit}`}
          </b>
        </div>
      )}
    </div>
  );
}
