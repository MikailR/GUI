import { useEffect, useMemo, useRef, useState } from 'react';
import { posts, type Block } from '../content';
import { Glyph } from '../os/icons';
import { formatDate, usePayload } from './shared';

const allTags = [...new Set(posts.flatMap((p) => p.tags))];

export function Writing() {
  const [activeId, setActiveId] = useState<string>(posts[0].id);
  const [reading, setReading] = useState(false); // narrow layouts: list ↔ reader
  const [tag, setTag] = useState<string | null>(null);
  const [q, setQ] = useState('');
  const [size, setSize] = useState(1);
  const [progress, setProgress] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  usePayload((p) => {
    if (posts.some((x) => x.id === p)) {
      setActiveId(p);
      setReading(true);
    }
  });

  const list = useMemo(
    () => posts.filter((p) => (!tag || p.tags.includes(tag)) && (!q || `${p.title} ${p.dek}`.toLowerCase().includes(q.toLowerCase()))),
    [tag, q],
  );
  const post = posts.find((p) => p.id === activeId)!;

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
    setProgress(0);
  }, [activeId]);

  const onScroll = () => {
    const el = scrollRef.current!;
    const max = el.scrollHeight - el.clientHeight;
    setProgress(max > 0 ? el.scrollTop / max : 1);
  };

  return (
    <div className={`writing ${reading ? 'is-reading' : ''}`}>
      <aside className="writing__list">
        <label className="search-field search-field--block">
          <Glyph.search />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search essays" aria-label="Search essays" />
        </label>
        <div className="chips chips--scroll">
          <button className={`chip ${!tag ? 'is-on' : ''}`} onClick={() => setTag(null)}>
            all
          </button>
          {allTags.map((t) => (
            <button key={t} className={`chip ${tag === t ? 'is-on' : ''}`} onClick={() => setTag(tag === t ? null : t)}>
              {t}
            </button>
          ))}
        </div>
        <ul>
          {list.map((p) => (
            <li key={p.id}>
              <button
                className={`post-row ${p.id === activeId ? 'is-on' : ''}`}
                onClick={() => {
                  setActiveId(p.id);
                  setReading(true);
                }}
              >
                <span className="post-row__date">{formatDate(p.date)}</span>
                <strong>{p.title}</strong>
                <span className="post-row__dek">{p.dek}</span>
                <span className="post-row__meta">
                  {p.minutes} min · {p.tags.join(' / ')}
                </span>
              </button>
            </li>
          ))}
          {!list.length && <li className="empty">No essays match.</li>}
        </ul>
      </aside>

      <article className="reader">
        <div className="reader__bar">
          <button className="icon-btn reader__back" onClick={() => setReading(false)} aria-label="Back to list">
            <Glyph.chevronLeft />
          </button>
          <span className="reader__crumb">{post.tags[0]}</span>
          <div className="toolbar__spacer" />
          <button className="icon-btn" onClick={() => setSize((s) => Math.max(0.85, s - 0.075))} aria-label="Smaller text">
            A<small>−</small>
          </button>
          <button className="icon-btn" onClick={() => setSize((s) => Math.min(1.3, s + 0.075))} aria-label="Larger text">
            A<small>+</small>
          </button>
          <i className="reader__progress" style={{ transform: `scaleX(${progress})` }} />
        </div>
        <div className="reader__scroll" ref={scrollRef} onScroll={onScroll}>
          <div className="reader__page" style={{ '--reader-size': size } as React.CSSProperties} key={post.id}>
            <p className="reader__kicker">
              {formatDate(post.date, { day: 'numeric', month: 'long', year: 'numeric' })} · {post.minutes} min read
            </p>
            <h1>{post.title}</h1>
            <p className="reader__dek">{post.dek}</p>
            <hr />
            {post.body.map((b, i) => (
              <BlockView key={i} b={b} first={i === 0} />
            ))}
            <footer className="reader__end">
              <span>∎</span>
              {(() => {
                const idx = posts.findIndex((p) => p.id === post.id);
                const next = posts[(idx + 1) % posts.length];
                return (
                  <button className="reader__next" onClick={() => setActiveId(next.id)}>
                    <small>Next essay</small>
                    {next.title} <Glyph.chevronRight />
                  </button>
                );
              })()}
            </footer>
          </div>
        </div>
      </article>
    </div>
  );
}

function highlight(code: string) {
  const re = /(\/\/.*$)|('.*?'|`.*?`|".*?")|\b(const|let|return|function|if|new|await|async|of|for)\b|\b(\d+(?:\.\d+)?)\b|([A-Za-z_]\w*)(?=\()/gm;
  const out: React.ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(code))) {
    if (m.index > last) out.push(code.slice(last, m.index));
    const cls = m[1] ? 'c' : m[2] ? 's' : m[3] ? 'k' : m[4] ? 'n' : 'f';
    out.push(
      <span key={m.index} className={`tok-${cls}`}>
        {m[0]}
      </span>,
    );
    last = m.index + m[0].length;
  }
  out.push(code.slice(last));
  return out;
}

function BlockView({ b, first }: { b: Block; first: boolean }) {
  switch (b.t) {
    case 'p':
      return <p className={first ? 'has-dropcap' : undefined}>{renderInline(b.text)}</p>;
    case 'h':
      return <h2>{b.text}</h2>;
    case 'quote':
      return <blockquote>{b.text}</blockquote>;
    case 'list':
      return (
        <ul>
          {b.items.map((it) => (
            <li key={it}>{renderInline(it)}</li>
          ))}
        </ul>
      );
    case 'code':
      return (
        <pre className="code">
          <span className="code__lang">{b.lang}</span>
          <code>{highlight(b.text)}</code>
        </pre>
      );
  }
}

function renderInline(text: string) {
  return text.split(/(`[^`]+`)/g).map((part, i) => (part.startsWith('`') ? <code key={i}>{part.slice(1, -1)}</code> : part));
}
