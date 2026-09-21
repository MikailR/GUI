import { useEffect, useRef, useState, type PointerEvent } from 'react'
import { Switch } from '../../components/controls'
import { ControlStrip, Param } from '../LabControls'
import { useElementSize } from '../useElementSize'
import type { ExperimentProps } from '../registry'

interface Ripple {
  x: number
  y: number
  born: number
  strength: number
}

export default function Ripples({ compact }: ExperimentProps) {
  const stageRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const size = useElementSize(stageRef)
  const ripples = useRef<Ripple[]>([])
  const [speed, setSpeed] = useState(140)
  const [life, setLife] = useState(2.6)
  const [ambient, setAmbient] = useState(true)
  const settings = useRef({ speed, life, ambient })
  settings.current = { speed, life, ambient }

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
    let lastAmbient = performance.now()
    const loop = (now: number) => {
      const { speed: v, life: ttl, ambient: drops } = settings.current
      if (drops && now - lastAmbient > 1800 && ripples.current.length < 6) {
        lastAmbient = now
        ripples.current.push({
          x: Math.random() * size.width,
          y: Math.random() * size.height,
          born: now,
          strength: 0.45,
        })
      }
      ripples.current = ripples.current.filter((r) => now - r.born < ttl * 1000)

      ctx.clearRect(0, 0, size.width, size.height)
      ripples.current.forEach((ripple) => {
        const age = (now - ripple.born) / 1000
        const fade = Math.max(0, 1 - age / ttl) * ripple.strength
        for (let ring = 0; ring < 3; ring += 1) {
          const radius = age * v - ring * 22
          if (radius <= 0) continue
          const width = 10 + ring * 4
          // trough
          ctx.beginPath()
          ctx.arc(ripple.x, ripple.y, radius, 0, Math.PI * 2)
          ctx.strokeStyle = `rgba(20, 30, 60, ${(fade * 0.35) / (ring + 1)})`
          ctx.lineWidth = width
          ctx.stroke()
          // crest
          ctx.beginPath()
          ctx.arc(ripple.x, ripple.y, radius + width * 0.45, 0, Math.PI * 2)
          ctx.strokeStyle = `rgba(255, 255, 255, ${(fade * 0.8) / (ring + 1)})`
          ctx.lineWidth = Math.max(1, width * 0.28)
          ctx.stroke()
          // specular arc (upper-left)
          ctx.beginPath()
          ctx.arc(ripple.x, ripple.y, radius + width * 0.45, Math.PI * 1.05, Math.PI * 1.6)
          ctx.strokeStyle = `rgba(255, 255, 255, ${fade / (ring + 1)})`
          ctx.lineWidth = Math.max(1.5, width * 0.4)
          ctx.stroke()
        }
      })
      frame = requestAnimationFrame(loop)
    }
    frame = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(frame)
  }, [size.width, size.height])

  const onDown = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    ripples.current.push({ x: event.clientX - rect.left, y: event.clientY - rect.top, born: performance.now(), strength: 1 })
  }

  return (
    <div className="lab-experiment ripples-lab" data-compact={compact || undefined}>
      <div ref={stageRef} className="ripples-stage" onPointerDown={onDown} role="img" aria-label="Tap to create ripples">
        <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
        <div className="ripples-label glass glass-thin">Tap the water</div>
      </div>
      <ControlStrip>
        <Param label="Wave speed" value={speed} min={40} max={320} onChange={setSpeed} format={(v) => `${v}px/s`} />
        <Param label="Lifetime" value={life} min={0.8} max={5} step={0.1} onChange={setLife} format={(v) => `${v.toFixed(1)}s`} />
        <label className="lab-toggle">
          <span>Ambient drops</span>
          <Switch checked={ambient} onChange={setAmbient} label="Ambient drops" />
        </label>
      </ControlStrip>
    </div>
  )
}
