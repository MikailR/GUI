import { useEffect, useState, type ReactNode } from 'react'
import { POSTS } from '../content/data'
import { fmtDate } from '../os/hooks'

function inline(s: string): ReactNode[] {
  return s.split(/(`[^`]+`)/g).map((part, i) => (part.startsWith('`') ? <code key={i}>{part.slice(1, -1)}</code> : part))
}

function Body({ paras }: { paras: string[] }) {
  return (
    <>
      {paras.map((p, i) => {
        if (p.startsWith('## ')) return <h2 key={i}>{p.slice(3)}</h2>
        if (p.startsWith('> ')) return <blockquote key={i}>{p.slice(2)}</blockquote>
        if (p.startsWith('```')) return <pre key={i}>{p.replace(/^```\n?/, '').replace(/\n?```$/, '')}</pre>
        return <p key={i} className={i === 0 ? 'lede' : ''}>{inline(p)}</p>
      })}
    </>
  )
}

export default function Writing({ payload }: { payload?: unknown }) {
  const want = (payload as { postId?: string } | undefined)?.postId
  const [id, setId] = useState<string | null>(want ?? null)
  useEffect(() => { if (want) setId(want) }, [want])
  const post = POSTS.find((p) => p.id === id)

  return (
    <div className="app">
      <div className="app-side wide">
        <div className="sec">Essays</div>
        {POSTS.map((p) => (
          <button key={p.id} className={`side-item ${p.id === id ? 'active' : ''}`} onClick={() => setId(p.id)} style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 1 }}>
            <span style={{ fontWeight: 600, lineHeight: 1.25 }}>{p.title}</span>
            <span style={{ fontSize: 11, opacity: 0.65 }}>{fmtDate(p.date)} · {p.readMins} min</span>
          </button>
        ))}
      </div>
      <div className="app-main scroll">
        {post ? (
          <article className="pad prose" key={post.id} style={{ animation: 'fade-in 0.25s' }}>
            <div className="meta" style={{ marginBottom: 10 }}>
              <span className="chip accent">{post.tag}</span>
              <span>{fmtDate(post.date)}</span>·<span>{post.readMins} min read</span>
            </div>
            <h1>{post.title}</h1>
            <p className="lede" style={{ marginTop: 6 }}>{post.summary}</p>
            <hr style={{ border: 0, borderTop: '1px solid var(--hairline)', margin: '18px 0' }} />
            <Body paras={post.body} />
            <p className="meta" style={{ marginTop: 24 }}>— M.</p>
          </article>
        ) : (
          <div className="pad" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>Writing</h1>
            <p style={{ color: 'var(--text-2)', marginBottom: 8 }}>Short essays on the craft: motion, performance, the odd bit of TypeScript.</p>
            {POSTS.map((p) => (
              <button key={p.id} className="card hover" onClick={() => setId(p.id)} style={{ textAlign: 'left' }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'baseline' }}>
                  <h3 style={{ fontSize: 15, fontWeight: 650 }}>{p.title}</h3>
                  <span className="meta" style={{ marginLeft: 'auto' }}>{fmtDate(p.date)}</span>
                </div>
                <p style={{ color: 'var(--text-2)', fontSize: 13, marginTop: 4 }}>{p.summary}</p>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
