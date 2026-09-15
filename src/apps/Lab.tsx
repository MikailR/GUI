import { useEffect, useRef, useState } from 'react'
import { EXPERIMENTS, type Experiment } from '../content/data'

/* ───────── shared: run a draw loop only while the element is on screen ───────── */
function useLoop(ref: React.RefObject<HTMLCanvasElement | null>, draw: (ctx: CanvasRenderingContext2D, t: number, w: number, h: number) => void, fps = 30) {
  useEffect(() => {
    const c = ref.current
    if (!c) return
    const ctx = c.getContext('2d')!
    let raf = 0
    let last = 0
    let visible = true
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame)
      if (!visible || now - last < 1000 / fps) return
      last = now
      draw(ctx, now / 1000, c.width, c.height)
    }
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting }, { threshold: 0.05 })
    io.observe(c)
    raf = requestAnimationFrame(frame)
    return () => { cancelAnimationFrame(raf); io.disconnect() }
  }, [ref, draw, fps])
}

/* ───────── 1. Spring toy ───────── */
function Springs() {
  const box = useRef<HTMLDivElement>(null)
  const ball = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = box.current!, b = ball.current!
    let x = 0, y = 0, vx = 0, vy = 0, held = false, lx = 0, ly = 0, lt = 0
    let raf = 0
    const K = 120, D = 8 // stiffness, damping (underdamped)
    let prev = performance.now()
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick)
      const dt = Math.min(0.033, (now - prev) / 1000)
      prev = now
      if (!held) {
        const ax = -K * x - D * vx, ay = -K * y - D * vy
        vx += ax * dt; vy += ay * dt
        x += vx * dt; y += vy * dt
      }
      b.style.transform = `translate(${x}px, ${y}px) scale(${held ? 1.15 : 1})`
    }
    raf = requestAnimationFrame(tick)
    const down = (e: PointerEvent) => {
      held = true
      b.setPointerCapture(e.pointerId)
      const r = el.getBoundingClientRect()
      const ox = e.clientX - (r.left + r.width / 2) - x, oy = e.clientY - (r.top + r.height / 2) - y
      lx = e.clientX; ly = e.clientY; lt = performance.now()
      const move = (ev: PointerEvent) => {
        const nx = ev.clientX - (r.left + r.width / 2) - ox, ny = ev.clientY - (r.top + r.height / 2) - oy
        const t = performance.now(), dt = Math.max(1, t - lt) / 1000
        vx = (ev.clientX - lx) / dt * 0.6; vy = (ev.clientY - ly) / dt * 0.6
        lx = ev.clientX; ly = ev.clientY; lt = t
        x = nx; y = ny
      }
      const up = () => {
        held = false
        b.removeEventListener('pointermove', move)
        b.removeEventListener('pointerup', up)
        b.removeEventListener('pointercancel', up)
      }
      b.addEventListener('pointermove', move)
      b.addEventListener('pointerup', up)
      b.addEventListener('pointercancel', up)
    }
    b.addEventListener('pointerdown', down)
    return () => { cancelAnimationFrame(raf); b.removeEventListener('pointerdown', down) }
  }, [])
  return (
    <div ref={box} style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', width: 8, height: 8, borderRadius: 4, border: '1px solid var(--text-3)' }} />
      <div ref={ball} style={{ width: 44, height: 44, borderRadius: 22, background: 'radial-gradient(circle at 35% 30%, #ffd08a, #ff6f91 60%, #5b3bff)', boxShadow: '0 10px 24px rgba(0,0,0,.4)', cursor: 'grab', touchAction: 'none', willChange: 'transform' }} />
    </div>
  )
}

/* ───────── 2. Metaballs ───────── */
function Metaballs() {
  const ref = useRef<HTMLCanvasElement>(null)
  const balls = useRef(Array.from({ length: 5 }, (_, i) => ({ px: 0.3 + i * 0.1, py: 0.5, fx: 0.4 + i * 0.13, fy: 0.5 + i * 0.09, r: 0.09 + (i % 3) * 0.03 })))
  useLoop(ref, (ctx, t, W, H) => {
    const img = ctx.createImageData(W, H)
    const d = img.data
    const bs = balls.current.map((b) => ({ x: W * (0.5 + 0.35 * Math.sin(t * b.fx + b.px * 7)), y: H * (0.5 + 0.35 * Math.cos(t * b.fy + b.py * 5)), r2: (b.r * W) ** 2 }))
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      let f = 0
      for (const b of bs) { const dx = x - b.x, dy = y - b.y; f += b.r2 / (dx * dx + dy * dy + 1) }
      const i = (y * W + x) * 4
      const v = Math.min(1, Math.max(0, (f - 0.7) * 3))
      d[i] = 255 * v ** 0.6; d[i + 1] = 170 * v ** 1.4; d[i + 2] = 80 + 175 * (1 - v) * v; d[i + 3] = 255 * Math.min(1, v * 4)
    }
    ctx.putImageData(img, 0, 0)
  })
  return <canvas ref={ref} width={112} height={72} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', imageRendering: 'auto' }} />
}

/* ───────── 3. Text scramble ───────── */
const CHARS = '!<>-_\\/[]{}—=+*^?#________'
function Scramble() {
  const phrases = ['Hover to decode', 'Interfaces that feel like software', 'Motion that explains', 'Four milliseconds matter']
  const [i, setI] = useState(0)
  const [text, setText] = useState(phrases[0])
  const running = useRef(false)
  const go = () => {
    if (running.current) return
    running.current = true
    const next = phrases[(i + 1) % phrases.length]
    setI((v) => (v + 1) % phrases.length)
    const from = text, to = next, len = Math.max(from.length, to.length)
    const q = Array.from({ length: len }, (_, k) => ({ from: from[k] ?? '', to: to[k] ?? '', start: Math.random() * 20, end: 20 + Math.random() * 20 }))
    let frame = 0
    const tick = () => {
      let out = '', done = 0
      for (const c of q) {
        if (frame >= c.end) { done++; out += c.to }
        else if (frame >= c.start) out += CHARS[Math.floor(Math.random() * CHARS.length)]
        else out += c.from
      }
      setText(out)
      frame++
      if (done < q.length) requestAnimationFrame(tick)
      else running.current = false
    }
    tick()
  }
  return (
    <div onPointerEnter={go} onClick={go} style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', padding: 16, textAlign: 'center', fontFamily: 'var(--mono)', fontSize: 17, fontWeight: 600, letterSpacing: '-0.01em', cursor: 'pointer' }}>
      <span style={{ color: 'var(--accent-2)' }}>{text}</span>
    </div>
  )
}

/* ───────── 4. Ordered dither ───────── */
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5]
function Dither() {
  const ref = useRef<HTMLCanvasElement>(null)
  useLoop(ref, (ctx, t, W, H) => {
    const img = ctx.createImageData(W, H)
    const d = img.data
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const nx = x / W, ny = y / H
      const v = 0.5 + 0.5 * Math.sin(nx * 4 + t * 0.8) * Math.cos(ny * 3 - t * 0.6) * Math.sin((nx + ny) * 3 + t * 0.3)
      const th = (BAYER[(y % 4) * 4 + (x % 4)] + 0.5) / 16
      const on = v > th
      const i = (y * W + x) * 4
      d[i] = on ? 245 : 20; d[i + 1] = on ? 240 : 22; d[i + 2] = on ? 230 : 30; d[i + 3] = 255
    }
    ctx.putImageData(img, 0, 0)
  }, 20)
  return <canvas ref={ref} width={128} height={80} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', imageRendering: 'pixelated' }} />
}

/* ───────── 5. Boids ───────── */
function Boids() {
  const ref = useRef<HTMLCanvasElement>(null)
  const boids = useRef(Array.from({ length: 60 }, () => ({ x: Math.random() * 300, y: Math.random() * 180, vx: Math.random() - 0.5, vy: Math.random() - 0.5 })))
  const scatter = useRef(0)
  useLoop(ref, (ctx, _t, W, H) => {
    const bs = boids.current
    const sc = scatter.current > 0 ? -1 : 1
    scatter.current = Math.max(0, scatter.current - 1)
    for (const b of bs) {
      let cx = 0, cy = 0, ax = 0, ay = 0, sx = 0, sy = 0, n = 0
      for (const o of bs) {
        if (o === b) continue
        const dx = o.x - b.x, dy = o.y - b.y, d2 = dx * dx + dy * dy
        if (d2 < 900) { cx += o.x; cy += o.y; ax += o.vx; ay += o.vy; n++; if (d2 < 120) { sx -= dx; sy -= dy } }
      }
      if (n) { b.vx += ((cx / n - b.x) * 0.002 + (ax / n - b.vx) * 0.05) * sc; b.vy += ((cy / n - b.y) * 0.002 + (ay / n - b.vy) * 0.05) * sc }
      b.vx += sx * 0.02; b.vy += sy * 0.02
      const sp = Math.hypot(b.vx, b.vy) || 1, max = 1.8
      if (sp > max) { b.vx = b.vx / sp * max; b.vy = b.vy / sp * max }
      b.x = (b.x + b.vx + W) % W; b.y = (b.y + b.vy + H) % H
    }
    ctx.fillStyle = 'rgba(8,8,14,0.35)'
    ctx.fillRect(0, 0, W, H)
    ctx.fillStyle = '#7ee0ff'
    for (const b of bs) {
      const a = Math.atan2(b.vy, b.vx)
      ctx.save(); ctx.translate(b.x, b.y); ctx.rotate(a)
      ctx.beginPath(); ctx.moveTo(5, 0); ctx.lineTo(-4, 3); ctx.lineTo(-4, -3); ctx.closePath(); ctx.fill()
      ctx.restore()
    }
  }, 60)
  return <canvas ref={ref} width={300} height={180} onPointerDown={() => (scatter.current = 25)} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', background: '#08080e', cursor: 'pointer' }} />
}

const DEMO: Record<Experiment['kind'], () => React.JSX.Element> = { springs: Springs, metaballs: Metaballs, scramble: Scramble, dither: Dither, boids: Boids }

export default function Lab({ payload }: { payload?: unknown }) {
  const hl = (payload as { expId?: string } | undefined)?.expId
  const refs = useRef(new Map<string, HTMLDivElement>())
  useEffect(() => {
    if (!hl) return
    const t = window.setTimeout(() => refs.current.get(hl)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50)
    return () => window.clearTimeout(t)
  }, [hl])
  return (
    <div className="app" style={{ flexDirection: 'column' }}>
      <div className="toolbar">
        <span>{EXPERIMENTS.length} experiments · all live, no libraries</span>
        <span className="grow" />
        <span>Loops pause off-screen</span>
      </div>
      <div className="app-main scroll">
        <div className="pad grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}>
          {EXPERIMENTS.map((e) => {
            const Demo = DEMO[e.kind]
            return (
              <div key={e.id} ref={(el) => { if (el) refs.current.set(e.id, el) }} className="card" style={{ padding: 0, overflow: 'hidden', outline: hl === e.id ? '2px solid var(--accent)' : undefined, outlineOffset: 2 }}>
                <div style={{ position: 'relative', height: 170, background: 'rgba(0,0,0,0.25)', borderBottom: '1px solid var(--hairline)', touchAction: 'none' }}>
                  <Demo />
                </div>
                <div style={{ padding: '12px 14px' }}>
                  <h3 style={{ fontSize: 14, fontWeight: 650 }}>{e.title}</h3>
                  <p style={{ fontSize: 12.5, color: 'var(--text-2)', margin: '4px 0 8px', lineHeight: 1.5 }}>{e.blurb}</p>
                  <div style={{ display: 'flex', gap: 5 }}>{e.tags.map((t) => <span key={t} className="chip">{t}</span>)}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
