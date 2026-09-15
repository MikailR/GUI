import { useEffect, useRef, useState } from 'react'
import { useOS } from '../os/store'
import { APPS, DOCK_ORDER } from '../os/apps'
import type { AppId } from '../os/types'
import { AppIcon } from './Icons'

const BASE = 48
const MAX = 0.6
const SIGMA = 1.6 * (BASE + 6)

export function Dock() {
  const os = useOS()
  const ref = useRef<HTMLDivElement>(null)
  const [scales, setScales] = useState<Record<string, number>>({})
  const [bouncing, setBouncing] = useState<AppId | null>(null)
  const coarse = useRef(window.matchMedia('(pointer: coarse)').matches)

  const items: AppId[] = [...DOCK_ORDER, 'trash']
  const running = new Set(os.state.windows.map((w) => w.app))

  const onMove = (e: React.PointerEvent) => {
    if (coarse.current) return
    const dock = ref.current!
    const next: Record<string, number> = {}
    dock.querySelectorAll<HTMLElement>('[data-dock]').forEach((el) => {
      const r = el.getBoundingClientRect()
      const d = e.clientX - (r.left + r.width / 2)
      next[el.dataset.dock!] = 1 + MAX * Math.exp(-(d * d) / (2 * SIGMA * SIGMA))
    })
    setScales(next)
  }

  const launch = (id: AppId) => {
    const wins = os.state.windows.filter((w) => w.app === id)
    if (!wins.length) {
      setBouncing(id)
      os.open(id)
    } else {
      const w = wins[0]
      if (w.minimized) os.restore(w.id)
      else if (os.focused?.id === w.id) os.minimize(w.id)
      else os.focus(w.id)
    }
  }
  useEffect(() => {
    if (!bouncing) return
    const t = window.setTimeout(() => setBouncing(null), 1100)
    return () => window.clearTimeout(t)
  }, [bouncing])

  return (
    <div className="dock-wrap">
      <div className="dock" ref={ref} onPointerMove={onMove} onPointerLeave={() => setScales({})} role="toolbar" aria-label="Dock">
        {items.map((id, i) => {
          const s = scales[id] ?? 1
          const def = APPS[id]
          const tip = id === 'trash' ? `Trash${os.state.trash.length ? ` (${os.state.trash.length})` : ''}` : def.title
          return (
            <span key={id} style={{ display: 'contents' }}>
              {id === 'trash' && <div className="dock-sep" />}
              <button
                data-dock={id}
                className={`dock-item ${running.has(id) ? 'running' : ''} ${bouncing === id ? 'bounce' : ''}`}
                style={{ transform: `scale(${s})`, width: BASE * s + 4, height: BASE + 4 }}
                onClick={() => launch(id)}
                aria-label={tip}
              >
                <AppIcon id={id} size={BASE} className="glyph" />
                <span className="tip">{tip}{i < 9 && id !== 'trash' ? '' : ''}</span>
                <span className="dot" />
              </button>
            </span>
          )
        })}
      </div>
    </div>
  )
}
