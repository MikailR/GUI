import { useEffect, useRef, useState } from 'react'
import { Slider } from '../../components/controls'
import { useAnimationFrame, useReducedMotion } from '../../os/hooks'
import { LabFrame } from '../LabFrame'
import { useElementSize } from '../useElementSize'

interface Ripple {
  x: number
  y: number
  t0: number
}

const LIFE = 2.8 // seconds
const RINGS = 3

/**
 * Tap to disturb a still glass surface. Each ripple is a few expanding rings with a bright
 * leading edge and a darker trailing edge, so they read as a raised wave rather than a circle.
 */
export default function Ripples() {
  const stageRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const { width, height } = useElementSize(stageRef)
  const reducedMotion = useReducedMotion()
  const ripples = useRef<Ripple[]>([])
  const idleSince = useRef(performance.now() / 1000)
  const [speed, setSpeed] = useState(140)
  const [spacing, setSpacing] = useState(26)
  const [active, setActive] = useState(true)

  const add = (x: number, y: number) => {
    ripples.current.push({ x, y, t0: performance.now() / 1000 })
    idleSince.current = performance.now() / 1000
    setActive(true)
  }

  const onPointerDown = (e: React.PointerEvent) => {
    const rect = stageRef.current?.getBoundingClientRect()
    if (!rect) return
    add(e.clientX - rect.left, e.clientY - rect.top)
  }

  const draw = (now: number) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, width, height)

    ripples.current = ripples.current.filter((r) => now - r.t0 < LIFE)
    for (const r of ripples.current) {
      const age = now - r.t0
      const life = age / LIFE
      const fade = (1 - life) ** 1.6
      for (let k = 0; k < RINGS; k++) {
        const radius = (reducedMotion ? LIFE * 0.45 : age) * speed - k * spacing
        if (radius <= 0) continue
        const ringFade = fade * (1 - k / (RINGS + 1))
        // bright crest
        ctx.beginPath()
        ctx.arc(r.x, r.y, radius, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(255,255,255,${(0.75 * ringFade).toFixed(3)})`
        ctx.lineWidth = Math.max(0.8, 5 * fade)
        ctx.stroke()
        // dark trough just inside the crest
        ctx.beginPath()
        ctx.arc(r.x, r.y, Math.max(0, radius - 4 * fade - 1), 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(10,20,40,${(0.35 * ringFade).toFixed(3)})`
        ctx.lineWidth = Math.max(0.8, 4 * fade)
        ctx.stroke()
        // specular highlight on the upper-left of the crest
        ctx.beginPath()
        ctx.arc(r.x, r.y, radius, Math.PI * 1.05, Math.PI * 1.55)
        ctx.strokeStyle = `rgba(255,255,255,${(0.9 * ringFade).toFixed(3)})`
        ctx.lineWidth = Math.max(0.6, 2.2 * fade)
        ctx.stroke()
      }
    }
  }

  useAnimationFrame(active, (_dt, _t) => {
    const now = performance.now() / 1000
    // Ambient drops when idle keep the surface alive.
    if (!reducedMotion && now - idleSince.current > 3.2 && width > 0) {
      add(width * (0.2 + Math.random() * 0.6), height * (0.2 + Math.random() * 0.6))
    }
    draw(now)
    if (ripples.current.length === 0 && reducedMotion) setActive(false)
  })

  // Redraw on resize so nothing is left stale.
  const drawRef = useRef(draw)
  drawRef.current = draw
  useEffect(() => {
    drawRef.current(performance.now() / 1000)
  }, [width, height])

  return (
    <LabFrame
      hint="Tap or click anywhere."
      stage={
        <div className="ripples" ref={stageRef} onPointerDown={onPointerDown} role="img" aria-label="Ripple surface">
          <canvas ref={canvasRef} className="ripples__canvas" />
        </div>
      }
      controls={
        <>
          <Slider label="Wave speed" value={speed} min={60} max={320} step={10} onChange={setSpeed} format={(v) => `${v}px/s`} />
          <Slider label="Ring spacing" value={spacing} min={10} max={60} step={2} onChange={setSpacing} format={(v) => `${v}px`} />
        </>
      }
    />
  )
}
