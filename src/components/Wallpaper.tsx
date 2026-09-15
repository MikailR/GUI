import { useEffect, useMemo, useRef } from 'react'
import type { Theme, WallpaperKind } from '../os/types'

/* Generative wallpaper. Rendered at a fraction of the viewport resolution and
   upscaled by the browser, which gives free, smooth blur for the aurora blobs. */

type Blob = { c: [number, number, number]; a: number; r: number; fx: number; fy: number; px: number; py: number }

const DUSK: Blob[] = [
  { c: [255, 140, 60], a: 0.55, r: 0.55, fx: 0.11, fy: 0.07, px: 0.2, py: 1.1 },
  { c: [255, 70, 120], a: 0.45, r: 0.5, fx: 0.08, fy: 0.13, px: 2.0, py: 0.4 },
  { c: [60, 200, 210], a: 0.5, r: 0.6, fx: 0.06, fy: 0.09, px: 3.1, py: 2.2 },
  { c: [90, 70, 230], a: 0.55, r: 0.7, fx: 0.09, fy: 0.05, px: 4.2, py: 3.3 },
  { c: [255, 200, 90], a: 0.3, r: 0.35, fx: 0.14, fy: 0.11, px: 5.0, py: 0.9 },
]
const DAWN: Blob[] = [
  { c: [255, 170, 120], a: 0.7, r: 0.6, fx: 0.1, fy: 0.07, px: 0.2, py: 1.1 },
  { c: [255, 120, 150], a: 0.45, r: 0.5, fx: 0.08, fy: 0.12, px: 2.0, py: 0.4 },
  { c: [140, 200, 255], a: 0.6, r: 0.65, fx: 0.06, fy: 0.09, px: 3.1, py: 2.2 },
  { c: [190, 170, 255], a: 0.5, r: 0.6, fx: 0.09, fy: 0.05, px: 4.2, py: 3.3 },
  { c: [255, 235, 160], a: 0.5, r: 0.4, fx: 0.13, fy: 0.1, px: 5.0, py: 0.9 },
]

function makeGrain(): string {
  const c = document.createElement('canvas')
  c.width = c.height = 160
  const ctx = c.getContext('2d')!
  const img = ctx.createImageData(160, 160)
  for (let i = 0; i < img.data.length; i += 4) {
    const v = 90 + Math.random() * 110
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v
    img.data[i + 3] = 255
  }
  ctx.putImageData(img, 0, 0)
  return c.toDataURL()
}

export function Wallpaper({ kind, theme, animate }: { kind: WallpaperKind; theme: Theme; animate: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const grain = useMemo(makeGrain, [])

  useEffect(() => {
    const canvas = ref.current!
    const ctx = canvas.getContext('2d')!
    let raf = 0
    let last = 0
    let W = 0
    let H = 0
    const SCALE = kind === 'horizon' ? 0.5 : 1 / 7

    const resize = () => {
      W = Math.max(64, Math.round(window.innerWidth * SCALE))
      H = Math.max(64, Math.round(window.innerHeight * SCALE))
      canvas.width = W
      canvas.height = H
    }

    const drawAurora = (t: number) => {
      const dark = theme === 'dusk'
      const bg = ctx.createLinearGradient(0, 0, 0, H)
      if (dark) {
        bg.addColorStop(0, '#0a0a14')
        bg.addColorStop(1, '#16112b')
      } else {
        bg.addColorStop(0, '#f7f3ec')
        bg.addColorStop(1, '#efe6dc')
      }
      ctx.globalCompositeOperation = 'source-over'
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, W, H)
      ctx.globalCompositeOperation = dark ? 'screen' : 'multiply'
      const blobs = dark ? DUSK : DAWN
      const R = Math.max(W, H)
      for (const b of blobs) {
        const x = W * (0.5 + 0.42 * Math.sin(t * b.fx + b.px))
        const y = H * (0.5 + 0.42 * Math.cos(t * b.fy + b.py))
        const r = R * b.r
        const g = ctx.createRadialGradient(x, y, 0, x, y, r)
        g.addColorStop(0, `rgba(${b.c[0]},${b.c[1]},${b.c[2]},${b.a})`)
        g.addColorStop(1, `rgba(${b.c[0]},${b.c[1]},${b.c[2]},0)`)
        ctx.fillStyle = g
        ctx.fillRect(0, 0, W, H)
      }
      // vignette
      ctx.globalCompositeOperation = 'source-over'
      const v = ctx.createRadialGradient(W / 2, H / 2, R * 0.25, W / 2, H / 2, R * 0.8)
      v.addColorStop(0, 'rgba(0,0,0,0)')
      v.addColorStop(1, dark ? 'rgba(0,0,0,0.55)' : 'rgba(80,60,40,0.18)')
      ctx.fillStyle = v
      ctx.fillRect(0, 0, W, H)
    }

    const drawHorizon = (t: number) => {
      const dark = theme === 'dusk'
      const horizon = H * 0.58
      const sky = ctx.createLinearGradient(0, 0, 0, horizon)
      if (dark) {
        sky.addColorStop(0, '#07070f')
        sky.addColorStop(0.7, '#2a1440')
        sky.addColorStop(1, '#b5433c')
      } else {
        sky.addColorStop(0, '#dfe9f6')
        sky.addColorStop(0.7, '#f6d9c3')
        sky.addColorStop(1, '#ffb27a')
      }
      ctx.globalCompositeOperation = 'source-over'
      ctx.fillStyle = sky
      ctx.fillRect(0, 0, W, horizon)
      // sun
      const sx = W * 0.5
      const sy = horizon - H * 0.08 + Math.sin(t * 0.2) * 2
      const sr = Math.min(W, H) * 0.16
      const sg = ctx.createRadialGradient(sx, sy, 0, sx, sy, sr * 1.8)
      sg.addColorStop(0, dark ? 'rgba(255,190,100,0.9)' : 'rgba(255,240,200,1)')
      sg.addColorStop(0.5, dark ? 'rgba(255,120,90,0.35)' : 'rgba(255,200,150,0.5)')
      sg.addColorStop(1, 'rgba(255,120,90,0)')
      ctx.fillStyle = sg
      ctx.fillRect(0, 0, W, horizon)
      ctx.fillStyle = dark ? '#ffcf8a' : '#fff4dc'
      ctx.beginPath()
      ctx.arc(sx, sy, sr, 0, Math.PI * 2)
      ctx.fill()
      // sun stripes
      ctx.fillStyle = dark ? 'rgba(181,67,60,1)' : 'rgba(255,178,122,1)'
      for (let i = 0; i < 6; i++) {
        const y = sy + sr * (0.15 + i * 0.16)
        ctx.fillRect(sx - sr, y, sr * 2, (i + 1) * 1.1)
      }
      // ground
      const gnd = ctx.createLinearGradient(0, horizon, 0, H)
      gnd.addColorStop(0, dark ? '#120a1c' : '#c9b8a8')
      gnd.addColorStop(1, dark ? '#05050a' : '#8f7f72')
      ctx.fillStyle = gnd
      ctx.fillRect(0, horizon, W, H - horizon)
      // perspective grid
      ctx.strokeStyle = dark ? 'rgba(255,150,120,0.28)' : 'rgba(255,255,255,0.45)'
      ctx.lineWidth = 1
      ctx.beginPath()
      const cols = 24
      for (let i = -cols; i <= cols; i++) {
        const x0 = W / 2 + (i / cols) * W * 0.5
        const x1 = W / 2 + (i / cols) * W * 3
        ctx.moveTo(x0, horizon)
        ctx.lineTo(x1, H)
      }
      const rows = 14
      const off = (t * 0.25) % 1
      for (let j = 0; j < rows; j++) {
        const p = (j + off) / rows
        const y = horizon + (H - horizon) * p * p
        ctx.moveTo(0, y)
        ctx.lineTo(W, y)
      }
      ctx.stroke()
      // haze at horizon
      const hz = ctx.createLinearGradient(0, horizon - H * 0.05, 0, horizon + H * 0.06)
      hz.addColorStop(0, 'rgba(255,255,255,0)')
      hz.addColorStop(0.5, dark ? 'rgba(255,160,120,0.35)' : 'rgba(255,255,255,0.6)')
      hz.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.fillStyle = hz
      ctx.fillRect(0, horizon - H * 0.05, W, H * 0.11)
    }

    const drawMono = () => {
      const dark = theme === 'dusk'
      const g = ctx.createLinearGradient(0, 0, W, H)
      g.addColorStop(0, dark ? '#1a1c26' : '#f1ede6')
      g.addColorStop(1, dark ? '#0a0a0f' : '#d9d2c8')
      ctx.globalCompositeOperation = 'source-over'
      ctx.fillStyle = g
      ctx.fillRect(0, 0, W, H)
      const v = ctx.createRadialGradient(W * 0.3, H * 0.2, 0, W * 0.3, H * 0.2, Math.max(W, H))
      v.addColorStop(0, dark ? 'rgba(255,180,84,0.14)' : 'rgba(217,72,15,0.12)')
      v.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = v
      ctx.fillRect(0, 0, W, H)
    }

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame)
      if (now - last < 1000 / 30) return
      last = now
      const t = now / 1000
      if (kind === 'aurora') drawAurora(t)
      else if (kind === 'horizon') drawHorizon(t)
      else drawMono()
      if (!animate || kind === 'mono') cancelAnimationFrame(raf)
    }

    resize()
    const onResize = () => {
      resize()
      if (!animate || kind === 'mono') frame(performance.now() + 1000)
    }
    window.addEventListener('resize', onResize)
    const onVis = () => {
      cancelAnimationFrame(raf)
      if (!document.hidden) raf = requestAnimationFrame(frame)
    }
    document.addEventListener('visibilitychange', onVis)
    raf = requestAnimationFrame(frame)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [kind, theme, animate])

  return (
    <div className="wallpaper" aria-hidden="true">
      <canvas ref={ref} />
      <div className="grain" style={{ backgroundImage: `url(${grain})` }} />
    </div>
  )
}
