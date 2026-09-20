import { useRef, useState } from 'react'
import { Slider } from '../../components/controls'
import { useReducedMotion } from '../../os/hooks'
import { LabFrame, Readout } from '../LabFrame'

const COUNT = 9
const BASE = 44

/** The Gaussian behind the Dock: scale = 1 + peak · e^(−d² / 2σ²), σ in icon widths. */
export default function DockCurve() {
  const [sigma, setSigma] = useState(1.6)
  const [peak, setPeak] = useState(0.5)
  const [pointer, setPointer] = useState<number | null>(null) // in icon widths from row start
  const rowRef = useRef<HTMLDivElement | null>(null)
  const reducedMotion = useReducedMotion()

  const onMove = (e: React.PointerEvent) => {
    const r = rowRef.current?.getBoundingClientRect()
    if (!r) return
    setPointer(((e.clientX - r.left) / r.width) * COUNT)
  }

  const scaleAt = (i: number) => {
    if (pointer === null || reducedMotion) return 1
    const d = pointer - (i + 0.5)
    return 1 + peak * Math.exp(-(d * d) / (2 * sigma * sigma))
  }

  // Curve for the graph: x in icon widths across the row.
  const W = 300
  const H = 90
  const path = Array.from({ length: 61 }, (_, k) => {
    const x = (k / 60) * COUNT
    const d = pointer === null ? x - COUNT / 2 : x - pointer
    const s = 1 + peak * Math.exp(-(d * d) / (2 * sigma * sigma))
    const px = (k / 60) * W
    const py = H - 8 - ((s - 1) / 1) * (H - 16)
    return `${k === 0 ? 'M' : 'L'}${px.toFixed(1)},${py.toFixed(1)}`
  }).join(' ')

  return (
    <LabFrame
      hint="Move along the row of pills."
      stage={
        <div className="dockcurve">
          <div className="dockcurve__row" ref={rowRef} onPointerMove={onMove} onPointerLeave={() => setPointer(null)}>
            {Array.from({ length: COUNT }, (_, i) => {
              const s = scaleAt(i)
              return (
                <span
                  key={i}
                  className="glass glass--thin dockcurve__pill"
                  style={{ width: BASE * s, height: BASE * s }}
                  aria-hidden="true"
                />
              )
            })}
          </div>
          <svg className="dockcurve__graph" viewBox={`0 0 ${W} ${H}`} aria-label="Magnification curve">
            <line x1="0" y1={H - 8} x2={W} y2={H - 8} className="curves__guide" />
            <path d={path} className="curves__path" />
            {pointer !== null ? <line x1={(pointer / COUNT) * W} y1="0" x2={(pointer / COUNT) * W} y2={H} className="curves__arm" /> : null}
          </svg>
        </div>
      }
      controls={
        <>
          <Slider label="σ (icon widths)" value={sigma} min={0.4} max={3.5} step={0.1} onChange={setSigma} format={(v) => v.toFixed(1)} />
          <Slider label="Peak" value={peak} min={0} max={1.2} step={0.05} onChange={setPeak} format={(v) => `+${Math.round(v * 100)}%`} />
          <div className="readouts">
            <Readout label="scale(d)" value={`1 + ${peak.toFixed(2)}·e^(−d²/${(2 * sigma * sigma).toFixed(2)})`} />
          </div>
        </>
      }
    />
  )
}
