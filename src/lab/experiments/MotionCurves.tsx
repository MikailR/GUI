import { useMemo, useRef, useState, type CSSProperties } from 'react'
import { Segmented, Slider } from '../../components/controls'
import { usePointerDrag } from '../../os/hooks'
import { CopyButton, LabFrame, Readout } from '../LabFrame'

type Mode = 'bezier' | 'spring'

const PRESETS: { name: string; p: [number, number, number, number] }[] = [
  { name: 'ease', p: [0.25, 0.1, 0.25, 1] },
  { name: 'in-out', p: [0.65, 0, 0.35, 1] },
  { name: 'out', p: [0.2, 0.8, 0.2, 1] },
  { name: 'overshoot', p: [0.34, 1.56, 0.64, 1] },
  { name: 'anticipate', p: [0.68, -0.4, 0.32, 1.4] },
]

const SIZE = 260
const PAD = 30

/** Sample a damped spring and bake it into a CSS linear() easing string. */
export function springToLinear(stiffness: number, damping: number, mass: number, samples = 48): { stops: string; points: number[] } {
  const w0 = Math.sqrt(stiffness / mass)
  const zeta = damping / (2 * Math.sqrt(stiffness * mass))
  // Duration until the spring settles within 0.1%.
  const settle = zeta < 1 ? Math.min(4, -Math.log(0.001) / (zeta * w0)) : Math.min(4, 6 / w0)
  const points: number[] = []
  for (let i = 0; i <= samples; i++) {
    const t = (i / samples) * settle
    let x: number
    if (zeta < 1) {
      const wd = w0 * Math.sqrt(1 - zeta * zeta)
      x = 1 - Math.exp(-zeta * w0 * t) * (Math.cos(wd * t) + ((zeta * w0) / wd) * Math.sin(wd * t))
    } else {
      x = 1 - Math.exp(-w0 * t) * (1 + w0 * t)
    }
    points.push(x)
  }
  points[points.length - 1] = 1
  const stops = points.map((p, i) => (i % 8 === 0 || i === points.length - 1 ? `${p.toFixed(3)} ${((i / samples) * 100).toFixed(1)}%` : p.toFixed(3))).join(', ')
  return { stops: `linear(${stops})`, points }
}

/**
 * Cubic-bezier editor with draggable handles, presets and a play button; or a spring → linear()
 * baker with exposed stiffness/damping/mass. Both drive the same glass puck.
 */
export default function MotionCurves() {
  const [mode, setMode] = useState<Mode>('bezier')
  const [p, setP] = useState<[number, number, number, number]>([0.2, 0.8, 0.2, 1])
  const [stiffness, setStiffness] = useState(170)
  const [damping, setDamping] = useState(14)
  const [mass, setMass] = useState(1)
  const [playing, setPlaying] = useState(false)
  const [atEnd, setAtEnd] = useState(false)
  const svgRef = useRef<SVGSVGElement | null>(null)

  const spring = useMemo(() => springToLinear(stiffness, damping, mass), [stiffness, damping, mass])
  const easing = mode === 'bezier' ? `cubic-bezier(${p.map((v) => +v.toFixed(2)).join(', ')})` : spring.stops
  const duration = mode === 'bezier' ? 900 : 1100

  const toSvg = (x: number, y: number) => ({ x: PAD + x * (SIZE - PAD * 2), y: SIZE - PAD - y * (SIZE - PAD * 2) })
  const fromSvg = (sx: number, sy: number) => ({
    x: Math.max(0, Math.min(1, (sx - PAD) / (SIZE - PAD * 2))),
    y: Math.max(-0.6, Math.min(1.6, (SIZE - PAD - sy) / (SIZE - PAD * 2))),
  })

  const handleIndex = useRef<0 | 1>(0)
  const drag = usePointerDrag({
    threshold: 0,
    onMove: (_dx, _dy, ev) => {
      const svg = svgRef.current
      if (!svg) return
      const r = svg.getBoundingClientRect()
      const scale = SIZE / r.width
      const pt = fromSvg((ev.clientX - r.left) * scale, (ev.clientY - r.top) * scale)
      setP((prev) => {
        const next: [number, number, number, number] = [...prev]
        if (handleIndex.current === 0) {
          next[0] = pt.x
          next[1] = pt.y
        } else {
          next[2] = pt.x
          next[3] = pt.y
        }
        return next
      })
    },
  })

  const a = toSvg(0, 0)
  const b = toSvg(1, 1)
  const h1 = toSvg(p[0], p[1])
  const h2 = toSvg(p[2], p[3])

  const springPath = useMemo(() => {
    const pts = spring.points
    return pts
      .map((v, i) => {
        const s = toSvg(i / (pts.length - 1), v)
        return `${i === 0 ? 'M' : 'L'}${s.x.toFixed(1)},${s.y.toFixed(1)}`
      })
      .join(' ')
  }, [spring])

  const play = () => {
    setPlaying(true)
    setAtEnd((v) => !v)
    window.setTimeout(() => setPlaying(false), duration + 50)
  }

  const puckStyle = {
    '--easing': easing,
    '--duration': `${duration}ms`,
  } as CSSProperties

  return (
    <LabFrame
      hint={mode === 'bezier' ? 'Drag the two handles, then press play.' : 'Tune the spring; the curve is baked into linear().'}
      stageClassName="lab-stage--curves"
      stage={
        <div className="curves">
          <svg ref={svgRef} className="curves__svg" viewBox={`0 0 ${SIZE} ${SIZE}`} aria-label="Easing curve editor">
            <rect x={PAD} y={PAD} width={SIZE - PAD * 2} height={SIZE - PAD * 2} className="curves__box" />
            {mode === 'bezier' ? (
              <>
                <line x1={a.x} y1={a.y} x2={h1.x} y2={h1.y} className="curves__arm" />
                <line x1={b.x} y1={b.y} x2={h2.x} y2={h2.y} className="curves__arm" />
                <path d={`M${a.x},${a.y} C${h1.x},${h1.y} ${h2.x},${h2.y} ${b.x},${b.y}`} className="curves__path" />
                <circle
                  cx={h1.x}
                  cy={h1.y}
                  r="11"
                  className="curves__handle"
                  onPointerDown={(e) => {
                    handleIndex.current = 0
                    drag.onPointerDown(e)
                  }}
                />
                <circle
                  cx={h2.x}
                  cy={h2.y}
                  r="11"
                  className="curves__handle"
                  onPointerDown={(e) => {
                    handleIndex.current = 1
                    drag.onPointerDown(e)
                  }}
                />
              </>
            ) : (
              <path d={springPath} className="curves__path" />
            )}
            <line x1={PAD} y1={b.y} x2={SIZE - PAD} y2={b.y} className="curves__guide" />
          </svg>

          <div className="curves__track">
            <div className={`glass curves__puck ${atEnd ? 'is-end' : ''}`} style={puckStyle} />
          </div>
        </div>
      }
      controls={
        <>
          <Segmented<Mode>
            ariaLabel="Mode"
            value={mode}
            onChange={setMode}
            options={[
              { value: 'bezier', label: 'cubic-bezier()' },
              { value: 'spring', label: 'spring → linear()' },
            ]}
          />
          {mode === 'bezier' ? (
            <div className="presets">
              {PRESETS.map((preset) => (
                <button key={preset.name} type="button" className="glass-btn" onClick={() => setP(preset.p)}>
                  {preset.name}
                </button>
              ))}
            </div>
          ) : (
            <>
              <Slider label="Stiffness" value={stiffness} min={40} max={500} step={10} onChange={setStiffness} />
              <Slider label="Damping" value={damping} min={2} max={40} onChange={setDamping} />
              <Slider label="Mass" value={mass} min={0.5} max={3} step={0.1} onChange={setMass} format={(v) => v.toFixed(1)} />
            </>
          )}
          <div className="readouts">
            <button type="button" className="glass-btn" onClick={play} disabled={playing}>
              Play
            </button>
            <Readout label="duration" value={`${duration}ms`} />
          </div>
        </>
      }
      footer={
        <div className="css-out">
          <pre>
            <code>{`transition-timing-function: ${easing};`}</code>
          </pre>
          <CopyButton text={`transition-timing-function: ${easing};`} />
        </div>
      }
    />
  )
}
