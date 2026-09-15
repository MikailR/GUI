import { useEffect, useMemo, useRef, useState } from 'react'
import { HACKATHONS, type Hackathon } from '../content/data'
import { fmtDate } from '../os/hooks'

type Filter = 'all' | 'wins' | 'podium' | 'solo'
const MEDAL: Record<Hackathon['place'], string> = { Winner: '🥇', 'Runner-up': '🥈', Finalist: '🎯', 'Best UI': '🎨', 'Crowd favourite': '❤️' }

export default function Hackathons({ payload }: { payload?: unknown }) {
  const [filter, setFilter] = useState<Filter>('all')
  const hl = (payload as { hackId?: string } | undefined)?.hackId
  const refs = useRef(new Map<string, HTMLDivElement>())

  const list = useMemo(() => {
    const sorted = [...HACKATHONS].sort((a, b) => b.date.localeCompare(a.date))
    if (filter === 'wins') return sorted.filter((h) => h.place === 'Winner')
    if (filter === 'podium') return sorted.filter((h) => h.place === 'Winner' || h.place === 'Runner-up' || h.place === 'Best UI')
    if (filter === 'solo') return sorted.filter((h) => h.team === 1)
    return sorted
  }, [filter])

  useEffect(() => {
    if (!hl) return
    setFilter('all')
    const t = window.setTimeout(() => refs.current.get(hl)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50)
    return () => window.clearTimeout(t)
  }, [hl])

  const wins = HACKATHONS.filter((h) => h.place === 'Winner').length
  const hours = HACKATHONS.reduce((a, h) => a + h.hours, 0)

  return (
    <div className="app">
      <div className="app-side">
        <div className="sec">Show</div>
        {([['all', 'All events'], ['wins', 'Wins'], ['podium', 'Podium'], ['solo', 'Solo']] as [Filter, string][]).map(([k, l]) => (
          <button key={k} className={`side-item ${filter === k ? 'active' : ''}`} onClick={() => setFilter(k)}>
            {l}
          </button>
        ))}
        <div className="sec">Totals</div>
        <div className="side-item"><span>Events</span><span className="cnt stat">{HACKATHONS.length}</span></div>
        <div className="side-item"><span>Wins</span><span className="cnt stat">{wins}</span></div>
        <div className="side-item"><span>Hours awake</span><span className="cnt stat">{hours}</span></div>
      </div>
      <div className="app-main scroll">
        <div className="pad" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {list.map((h) => (
            <div
              key={h.id}
              ref={(el) => { if (el) refs.current.set(h.id, el) }}
              className="card hover"
              style={{ outline: hl === h.id ? '2px solid var(--accent)' : undefined, outlineOffset: 2 }}
            >
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 18 }}>{MEDAL[h.place]}</span>
                <h3 style={{ fontSize: 16, fontWeight: 650, letterSpacing: '-0.01em' }}>{h.project}</h3>
                <span className="chip accent">{h.place}</span>
                <span className="meta" style={{ marginLeft: 'auto' }}>{h.event} · {fmtDate(h.date)}</span>
              </div>
              <p style={{ margin: '8px 0 10px', color: 'var(--text-2)', fontSize: 13.5, lineHeight: 1.55 }}>{h.blurb}</p>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                {h.stack.map((s) => <span key={s} className="chip">{s}</span>)}
                <span className="meta" style={{ marginLeft: 'auto' }}>{h.hours}h · {h.team === 1 ? 'solo' : `team of ${h.team}`}</span>
              </div>
            </div>
          ))}
          {list.length === 0 && <div className="empty">Nothing here with that filter.</div>}
        </div>
      </div>
    </div>
  )
}
