import { useEffect, useRef, useState } from 'react'
import { Slider } from '../../components/controls'
import { useAnimationFrame, useReducedMotion, usePointerDrag } from '../../os/hooks'
import { LabFrame, Readout } from '../LabFrame'
import { useElementSize } from '../useElementSize'

const TRACE_SECONDS = 3

/**
 * A damped spring you can throw. Position + velocity integrate with a semi-implicit Euler step;
 * the trace canvas plots horizontal displacement over the last few seconds.
 */
export default function SpringToy() {
  const stageRef = useRef<HTMLDivElement | null>(null)
  const orbRef = useRef<HTMLDivElement | null>(null)
  const tetherRef = useRef<SVGLineElement | null>(null)
  const traceRef = useRef<HTMLCanvasElement | null>(null)
  const { width, height } = useElementSize(stageRef)
  const reducedMotion = useReducedMotion()

  const [stiffness, setStiffness] = useState(180)
  const [damping, setDamping] = useState(12)
  const [mass] = useState(1)

  // Simulation state lives in refs so the loop never re-renders React.
  const sim = useRef({ x: 0, y: 0, vx: 0, vy: 0, dragging: false, lastX: 0, lastY: 0, lastT: 0 })
  const trace = useRef<{ t: number; x: number }[]>([])
  const [settled, setSettled] = useState(true)

  const cx = width / 2
  const cy = height / 2

  const paint = () => {
    const orb = orbRef.current
    const s = sim.current
    if (orb) orb.style.transform = `translate3d(${cx + s.x - 32}px, ${cy + s.y - 32}px, 0)`
    const tether = tetherRef.current
    if (tether) {
      tether.setAttribute('x2', String(cx + s.x))
      tether.setAttribute('y2', String(cy + s.y))
    }
    const canvas = traceRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      if (ctx) {
        const w = canvas.width
        const h = canvas.height
        ctx.clearRect(0, 0, w, h)
        ctx.strokeStyle = 'rgba(255,255,255,0.18)'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(0, h / 2)
        ctx.lineTo(w, h / 2)
        ctx.stroke()
        const now = performance.now() / 1000
        const pts = trace.current
        ctx.strokeStyle = 'rgba(255,255,255,0.9)'
        ctx.lineWidth = 2
        ctx.lineJoin = 'round'
        ctx.beginPath()
        let first = true
        for (const p of pts) {
          const px = w - ((now - p.t) / TRACE_SECONDS) * w
          const py = h / 2 - (p.x / Math.max(1, width / 2)) * (h / 2 - 6)
          if (first) {
            ctx.moveTo(px, py)
            first = false
          } else ctx.lineTo(px, py)
        }
        ctx.stroke()
      }
    }
  }

  useAnimationFrame(!settled, (dt) => {
    const s = sim.current
    const now = performance.now() / 1000
    if (!s.dragging) {
      // Semi-implicit Euler with substeps for stability at high stiffness.
      const steps = 4
      const h = dt / steps
      for (let i = 0; i < steps; i++) {
        const ax = (-stiffness * s.x - damping * s.vx) / mass
        const ay = (-stiffness * s.y - damping * s.vy) / mass
        s.vx += ax * h
        s.vy += ay * h
        s.x += s.vx * h
        s.y += s.vy * h
      }
      const energy = Math.hypot(s.x, s.y) + Math.hypot(s.vx, s.vy)
      if (energy < 0.4) {
        s.x = 0
        s.y = 0
        s.vx = 0
        s.vy = 0
        setSettled(true)
      }
    }
    trace.current.push({ t: now, x: s.x })
    while (trace.current.length && now - trace.current[0].t > TRACE_SECONDS) trace.current.shift()
    paint()
  })

  // Re-centre the resting orb when the stage is resized.
  const paintRef = useRef(paint)
  paintRef.current = paint
  useEffect(() => {
    paintRef.current()
  }, [width, height])

  const drag = usePointerDrag({
    threshold: 0,
    onStart: (ev) => {
      const s = sim.current
      s.dragging = true
      s.vx = 0
      s.vy = 0
      s.lastX = ev.clientX
      s.lastY = ev.clientY
      s.lastT = performance.now()
      setSettled(false)
    },
    onMove: (_dx, _dy, ev) => {
      const stage = stageRef.current
      if (!stage) return
      const rect = stage.getBoundingClientRect()
      const s = sim.current
      const now = performance.now()
      const dt = Math.max(1, now - s.lastT) / 1000
      const nx = ev.clientX - rect.left - cx
      const ny = ev.clientY - rect.top - cy
      // Track velocity for the throw.
      s.vx = (ev.clientX - s.lastX) / dt
      s.vy = (ev.clientY - s.lastY) / dt
      s.lastX = ev.clientX
      s.lastY = ev.clientY
      s.lastT = now
      s.x = Math.max(-cx + 32, Math.min(cx - 32, nx))
      s.y = Math.max(-cy + 32, Math.min(cy - 32, ny))
      paint()
    },
    onEnd: () => {
      const s = sim.current
      s.dragging = false
      if (reducedMotion) {
        s.x = 0
        s.y = 0
        s.vx = 0
        s.vy = 0
        paint()
        setSettled(true)
      } else {
        // Cap the throw so it stays on stage.
        const speed = Math.hypot(s.vx, s.vy)
        const max = 1800
        if (speed > max) {
          s.vx = (s.vx / speed) * max
          s.vy = (s.vy / speed) * max
        }
      }
    },
  })

  const ratio = damping / (2 * Math.sqrt(stiffness * mass))

  return (
    <LabFrame
      hint="Drag the orb and let go. Throw it."
      stage={
        <div className="spring-stage" ref={stageRef}>
          <svg className="spring-svg" width={width} height={height} aria-hidden="true">
            <circle cx={cx} cy={cy} r="5" className="spring-anchor" />
            <line ref={tetherRef} x1={cx} y1={cy} x2={cx} y2={cy} className="spring-tether" />
          </svg>
          <div
            ref={orbRef}
            className="glass spring-orb"
            role="slider"
            aria-label="Spring orb"
            aria-valuenow={0}
            tabIndex={0}
            onPointerDown={drag.onPointerDown}
          />
          <canvas ref={traceRef} className="spring-trace" width={260} height={64} aria-hidden="true" />
        </div>
      }
      controls={
        <>
          <Slider label="Stiffness" value={stiffness} min={40} max={600} step={10} onChange={setStiffness} />
          <Slider label="Damping" value={damping} min={1} max={40} step={1} onChange={setDamping} />
          <div className="readouts">
            <Readout label="ζ" value={ratio.toFixed(2)} />
            <Readout label="regime" value={ratio < 0.98 ? 'underdamped' : ratio < 1.02 ? 'critical' : 'overdamped'} />
            <Readout label="ω₀" value={`${Math.sqrt(stiffness / mass).toFixed(1)} rad/s`} />
          </div>
        </>
      }
    />
  )
}
