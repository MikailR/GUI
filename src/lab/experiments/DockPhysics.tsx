import { useCallback, useMemo, useRef, useState, type CSSProperties, type PointerEvent } from 'react'
import { AppIcon } from '../../icons/AppIcon'
import { APP_IDS } from '../../os/types'
import { ControlStrip, Param } from '../LabControls'
import type { ExperimentProps } from '../registry'

const ICON = 44
const GAP = 6

export default function DockPhysics({ compact }: ExperimentProps) {
  const [sigma, setSigma] = useState(1.35)
  const [peak, setPeak] = useState(0.62)
  const [pointer, setPointer] = useState<number | null>(null)
  const rowRef = useRef<HTMLDivElement | null>(null)

  const icons = compact ? APP_IDS.slice(0, 6) : APP_IDS

  const scaleAt = useCallback(
    (d: number) => 1 + peak * Math.exp(-(d * d) / (2 * sigma * sigma)),
    [peak, sigma],
  )

  const onMove = (event: PointerEvent<HTMLDivElement>) => {
    const row = rowRef.current
    if (!row) return
    const rect = row.getBoundingClientRect()
    setPointer(event.clientX - rect.left)
  }

  const plot = useMemo(() => {
    const w = 320
    const h = 90
    const pts: string[] = []
    for (let i = 0; i <= 80; i += 1) {
      const d = (i / 80) * 8 - 4
      const s = scaleAt(d)
      const x = (i / 80) * w
      const y = h - ((s - 1) / 1) * (h - 10) - 5
      pts.push(`${x.toFixed(1)},${y.toFixed(1)}`)
    }
    return { w, h, points: pts.join(' ') }
  }, [scaleAt])

  const step = ICON + GAP

  return (
    <div className="lab-experiment dock-physics" data-compact={compact || undefined}>
      <div className="dock-physics-stage">
        <div
          ref={rowRef}
          className="dock-physics-row glass"
          onPointerMove={onMove}
          onPointerLeave={() => setPointer(null)}
          style={{ '--rim-angle': '160deg' } as CSSProperties}
        >
          {icons.map((appId, index) => {
            const centre = 10 + index * step + ICON / 2
            const d = pointer === null ? 99 : (pointer - centre) / step
            const s = scaleAt(d)
            return (
              <span key={appId} className="dock-physics-item" style={{ width: ICON * s, '--s': s } as CSSProperties}>
                <AppIcon appId={appId} size={ICON} variant="mac" style={{ transform: `scale(${s})` }} />
              </span>
            )
          })}
        </div>
      </div>

      <ControlStrip>
        <Param label="σ (icons)" value={sigma} min={0.4} max={3} step={0.05} onChange={setSigma} format={(v) => v.toFixed(2)} />
        <Param label="Peak" value={peak} min={0} max={1.4} step={0.02} onChange={setPeak} format={(v) => `+${Math.round(v * 100)}%`} />
      </ControlStrip>

      <div className="dock-physics-plot">
        <svg viewBox={`0 0 ${plot.w} ${plot.h}`} role="img" aria-label="Magnification curve">
          <line x1="0" y1={plot.h - 5} x2={plot.w} y2={plot.h - 5} stroke="currentColor" strokeOpacity="0.2" />
          {[-3, -2, -1, 0, 1, 2, 3].map((d) => (
            <line
              key={d}
              x1={((d + 4) / 8) * plot.w}
              y1={plot.h - 5}
              x2={((d + 4) / 8) * plot.w}
              y2={plot.h - 1}
              stroke="currentColor"
              strokeOpacity="0.35"
            />
          ))}
          <polyline points={plot.points} fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
        </svg>
        <p className="lab-note">
          scale(d) = 1 + {peak.toFixed(2)} · e<sup>−d² / (2 · {sigma.toFixed(2)}²)</sup> — d in icon widths. Wider σ means more neighbours
          join in; higher peak makes the hovered icon the star.
        </p>
      </div>
    </div>
  )
}
