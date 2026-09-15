import { useEffect, useMemo, useRef, useState } from 'react'
import { useOS } from '../os/store'
import { APPS } from '../os/apps'
import type { AppId } from '../os/types'
import { EXPERIMENTS, HACKATHONS, PAPERS, POSTS } from '../content/data'
import { AppIcon, Ico } from './Icons'

interface Hit { key: string; title: string; sub: string; kind: string; app: AppId; payload?: unknown }

const INDEX: Hit[] = [
  ...(['about', 'writing', 'hackathons', 'lab', 'papers', 'terminal', 'settings', 'trash', 'readme', 'sysinfo'] as AppId[]).map((id) => ({
    key: `app-${id}`, title: APPS[id].title, sub: 'Application', kind: 'app', app: id,
  })),
  ...POSTS.map((p) => ({ key: `post-${p.id}`, title: p.title, sub: p.summary, kind: 'essay', app: 'writing' as AppId, payload: { postId: p.id } })),
  ...EXPERIMENTS.map((e) => ({ key: `exp-${e.id}`, title: e.title, sub: e.blurb, kind: 'lab', app: 'lab' as AppId, payload: { expId: e.id } })),
  ...HACKATHONS.map((h) => ({ key: `hack-${h.id}`, title: `${h.project} — ${h.event}`, sub: `${h.place} · ${h.date.slice(0, 4)}`, kind: 'hackathon', app: 'hackathons' as AppId, payload: { hackId: h.id } })),
  ...PAPERS.map((p) => ({ key: `paper-${p.id}`, title: p.title, sub: `${p.venue} · ${p.year}`, kind: 'paper', app: 'papers' as AppId, payload: { paperId: p.id } })),
]

function score(q: string, h: Hit): number {
  const t = h.title.toLowerCase(), s = h.sub.toLowerCase()
  if (t.startsWith(q)) return 100
  if (t.includes(q)) return 60
  // subsequence
  let i = 0
  for (const ch of t) if (ch === q[i]) i++
  if (i === q.length) return 30
  if (s.includes(q)) return 20
  return 0
}

export function Spotlight() {
  const os = useOS()
  const [q, setQ] = useState('')
  const [i, setI] = useState(0)
  const input = useRef<HTMLInputElement>(null)
  useEffect(() => input.current?.focus(), [])

  const hits = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return INDEX.filter((h) => h.kind === 'app').slice(0, 8)
    return INDEX.map((h) => ({ h, sc: score(s, h) })).filter((x) => x.sc > 0).sort((a, b) => b.sc - a.sc).map((x) => x.h).slice(0, 9)
  }, [q])
  useEffect(() => setI(0), [q])

  const go = (h: Hit) => {
    os.open(h.app, h.payload)
    os.setSpotlight(false)
  }

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setI((v) => Math.min(hits.length - 1, v + 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setI((v) => Math.max(0, v - 1)) }
    else if (e.key === 'Enter' && hits[i]) go(hits[i])
    else if (e.key === 'Escape') { e.stopPropagation(); os.setSpotlight(false) }
  }

  return (
    <div className="spot-overlay" onPointerDown={(e) => e.target === e.currentTarget && os.setSpotlight(false)}>
      <div className="spot" role="dialog" aria-label="Search">
        <div className="spot-input">
          <Ico.Search size={22} />
          <input ref={input} value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={onKey} placeholder="Search apps, essays, experiments…" spellCheck={false} />
          <kbd>esc</kbd>
        </div>
        <div className="spot-list scroll">
          {hits.length === 0 && <div className="spot-empty">Nothing for “{q}”. Try “dock”, “spring”, or “junction”.</div>}
          {hits.map((h, k) => (
            <button key={h.key} className={`spot-row ${k === i ? 'active' : ''}`} onMouseEnter={() => setI(k)} onClick={() => go(h)}>
              <AppIcon id={h.app} size={30} />
              <span style={{ minWidth: 0 }}>
                <div className="t" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{h.title}</div>
                <div className="s" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{h.sub}</div>
              </span>
              <span className="kind">{h.kind}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
