import { useEffect, useMemo, useRef, useState, type PointerEvent } from 'react'
import { Button } from '../../components/controls'
import { CodeBlock, ControlStrip, CopyButton, Param } from '../LabControls'
import { useElementSize } from '../useElementSize'
import type { ExperimentProps } from '../registry'

interface SpringParams {
  stiffness: number
  damping: number
  mass: number
}

const PRESETS: { name: string; params: SpringParams }[] = [
  { name: 'Window', params: { stiffness: 260, damping: 28, mass: 1 } },
  { name: 'Sheet', params: { stiffness: 180, damping: 22, mass: 1 } },
  { name: 'Bouncy', params: { stiffness: 320, damping: 12, mass: 1 } },
  { name: 'Molasses', params: { stiffness: 60, damping: 20, mass: 1.6 } },
]

/** Bakes the 1D spring step response into a CSS linear() easing. */
function bakeLinear({ stiffness, damping, mass }: SpringParams): { css: string; duration: number } {
  const dt = 1 / 120
  let x = 0
  let v = 0
  const samples: number[] = []
  let settled = 0
  let t = 0
  while (t < 4 && settled < 24) {
    const a = (-stiffness * (x - 1) - damping * v) / mass
    v += a * dt
    x += v * dt
    samples.push(x)
    t += dt
    settled = Math.abs(x - 1) < 0.001 && Math.abs(v) < 0.01 ? settled + 1 : 0
  }
  const duration = Math.round(t * 1000)
  const count = 28
  const stops: string[] = []
  for (let i = 0; i <= count; i += 1) {
    const index = Math.min(samples.length - 1, Math.round((i / count) * (samples.length - 1)))
    const value = i === count ? 1 : samples[index]
    stops.push(i === 0 || i === count ? value.toFixed(3) : `${value.toFixed(3)} ${((i / count) * 100).toFixed(1)}%`)
  }
  return { css: `linear(${stops.join(', ')})`, duration }
}

export default function SpringLab({ compact }: ExperimentProps) {
  const [params, setParams] = useState<SpringParams>(PRESETS[0].params)
  const stageRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const size = useElementSize(stageRef)
  const sim = useRef({ x: 0, y: 0, vx: 0, vy: 0, dragging: false, trail: [] as [number, number][] })
  const paramsRef = useRef(params)
  paramsRef.current = params

  const zeta = params.damping / (2 * Math.sqrt(params.stiffness * params.mass))
  const baked = useMemo(() => bakeLinear(params), [params])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || size.width === 0) return
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    canvas.width = size.width * dpr
    canvas.height = size.height * dpr
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.scale(dpr, dpr)

    let frame = 0
    let last = performance.now()
    const loop = (now: number) => {
      const dt = Math.min(0.032, (now - last) / 1000)
      last = now
      const s = sim.current
      const { stiffness, damping, mass } = paramsRef.current
      if (!s.dragging) {
        // Semi-implicit Euler toward the origin (stage centre).
        const ax = (-stiffness * s.x - damping * s.vx) / mass
        const ay = (-stiffness * s.y - damping * s.vy) / mass
        s.vx += ax * dt
        s.vy += ay * dt
        s.x += s.vx * dt
        s.y += s.vy * dt
      }
      s.trail.push([s.x, s.y])
      if (s.trail.length > 90) s.trail.shift()

      const cx = size.width / 2
      const cy = size.height / 2
      ctx.clearRect(0, 0, size.width, size.height)

      // rest marker
      ctx.beginPath()
      ctx.arc(cx, cy, 6, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(255,255,255,0.5)'
      ctx.lineWidth = 1.5
      ctx.stroke()

      // trail
      ctx.beginPath()
      s.trail.forEach(([tx, ty], i) => {
        const px = cx + tx
        const py = cy + ty
        if (i === 0) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
      })
      ctx.strokeStyle = 'rgba(255,255,255,0.45)'
      ctx.lineWidth = 2
      ctx.stroke()

      // tether
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.lineTo(cx + s.x, cy + s.y)
      ctx.strokeStyle = 'rgba(255,255,255,0.25)'
      ctx.setLineDash([4, 6])
      ctx.stroke()
      ctx.setLineDash([])

      // orb
      const ox = cx + s.x
      const oy = cy + s.y
      const r = 30
      const grad = ctx.createRadialGradient(ox - r * 0.4, oy - r * 0.5, r * 0.1, ox, oy, r)
      grad.addColorStop(0, 'rgba(255,255,255,0.95)')
      grad.addColorStop(0.35, 'rgba(255,255,255,0.55)')
      grad.addColorStop(1, 'rgba(255,255,255,0.18)')
      ctx.beginPath()
      ctx.arc(ox, oy, r, 0, Math.PI * 2)
      ctx.fillStyle = grad
      ctx.fill()
      ctx.strokeStyle = 'rgba(255,255,255,0.85)'
      ctx.lineWidth = 1.5
      ctx.stroke()
      ctx.beginPath()
      ctx.ellipse(ox - r * 0.3, oy - r * 0.45, r * 0.32, r * 0.16, -0.6, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(255,255,255,0.75)'
      ctx.fill()

      frame = requestAnimationFrame(loop)
    }
    frame = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(frame)
  }, [size.width, size.height])

  const pointer = useRef<{ lastX: number; lastY: number; lastT: number } | null>(null)
  const onDown = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const s = sim.current
    s.dragging = true
    s.x = event.clientX - rect.left - rect.width / 2
    s.y = event.clientY - rect.top - rect.height / 2
    s.vx = 0
    s.vy = 0
    pointer.current = { lastX: event.clientX, lastY: event.clientY, lastT: performance.now() }
    event.currentTarget.setPointerCapture(event.pointerId)
  }
  const onMove = (event: PointerEvent<HTMLDivElement>) => {
    const s = sim.current
    if (!s.dragging || !pointer.current) return
    const rect = event.currentTarget.getBoundingClientRect()
    const now = performance.now()
    const dt = Math.max(1, now - pointer.current.lastT) / 1000
    s.vx = (event.clientX - pointer.current.lastX) / dt
    s.vy = (event.clientY - pointer.current.lastY) / dt
    s.x = event.clientX - rect.left - rect.width / 2
    s.y = event.clientY - rect.top - rect.height / 2
    pointer.current = { lastX: event.clientX, lastY: event.clientY, lastT: now }
  }
  const onUp = () => {
    const s = sim.current
    s.dragging = false
    s.vx *= 0.9
    s.vy *= 0.9
    pointer.current = null
  }

  const set = <K extends keyof SpringParams>(key: K) => (value: number) => setParams((p) => ({ ...p, [key]: value }))

  return (
    <div className="lab-experiment spring-lab" data-compact={compact || undefined}>
      <div
        ref={stageRef}
        className="spring-stage"
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        role="img"
        aria-label="Spring simulation: drag and throw the orb"
      >
        <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
        <div className="spring-readout glass glass-thin">
          <span>
            ζ <strong>{zeta.toFixed(2)}</strong>
          </span>
          <span>{zeta < 1 ? 'underdamped' : zeta === 1 ? 'critical' : 'overdamped'}</span>
          <span>
            settles in <strong>{baked.duration}ms</strong>
          </span>
        </div>
      </div>

      <ControlStrip>
        <Param label="Stiffness" value={params.stiffness} min={20} max={600} step={5} onChange={set('stiffness')} />
        <Param label="Damping" value={params.damping} min={2} max={60} step={1} onChange={set('damping')} />
        <Param label="Mass" value={params.mass} min={0.4} max={3} step={0.1} onChange={set('mass')} format={(v) => v.toFixed(1)} />
        <div className="lab-param lab-presets">
          <span className="lab-param-label">Presets</span>
          <div className="lab-preset-row">
            {PRESETS.map((preset) => (
              <Button key={preset.name} size="small" variant="tinted" onClick={() => setParams(preset.params)}>
                {preset.name}
              </Button>
            ))}
          </div>
        </div>
      </ControlStrip>

      <div className="lab-output">
        <div className="lab-output-head">
          <span>Baked easing</span>
          <CopyButton text={`transition: transform ${baked.duration}ms ${baked.css};`} />
        </div>
        <CodeBlock code={`transition: transform ${baked.duration}ms\n  ${baked.css};`} />
      </div>
    </div>
  )
}
