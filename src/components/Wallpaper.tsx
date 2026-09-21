import { useEffect, useRef } from 'react'
import { useSettings } from '../os/store'
import { useMediaQuery, useResolvedAppearance } from '../os/hooks'
import { wallpaperPalette, type WallpaperPalette } from '../os/wallpapers'

/**
 * Generative wallpaper painted on a low-resolution canvas and upscaled by CSS.
 * The upscale is the blur: soft colour fields, glassy ribbons, gentle drift.
 * Pauses when the tab is hidden, when motion is reduced, or when live wallpaper is off.
 */

const PAINT_WIDTH = 420

interface WallpaperProps {
  className?: string
}

export function Wallpaper({ className }: WallpaperProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const settings = useSettings()
  const appearance = useResolvedAppearance()
  const systemReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const animate = settings.liveWallpaper && !settings.reduceMotion && !systemReducedMotion
  const palette = wallpaperPalette(settings.wallpaper, appearance)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let frame = 0
    let start = performance.now()
    let aspect = 1

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      aspect = rect.height > 0 ? rect.width / rect.height : 16 / 9
      canvas.width = PAINT_WIDTH
      canvas.height = Math.max(120, Math.round(PAINT_WIDTH / aspect))
      paint(ctx, palette, (performance.now() - start) / 1000)
    }

    const loop = (now: number) => {
      paint(ctx, palette, (now - start) / 1000)
      frame = requestAnimationFrame(loop)
    }

    const startLoop = () => {
      cancelAnimationFrame(frame)
      if (animate && document.visibilityState === 'visible') frame = requestAnimationFrame(loop)
    }

    const onVisibility = () => startLoop()

    const observer = new ResizeObserver(resize)
    observer.observe(canvas)
    resize()
    start = performance.now() - Math.random() * 60_000
    startLoop()
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [palette, animate])

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />
}

function paint(ctx: CanvasRenderingContext2D, palette: WallpaperPalette, time: number) {
  const { width, height } = ctx.canvas
  const size = Math.max(width, height)

  ctx.globalCompositeOperation = 'source-over'
  const base = ctx.createLinearGradient(0, 0, width, height)
  base.addColorStop(0, palette.base[0])
  base.addColorStop(0.55, palette.base[1])
  base.addColorStop(1, palette.base[2])
  ctx.fillStyle = base
  ctx.fillRect(0, 0, width, height)

  ctx.globalCompositeOperation = 'screen'
  palette.blobs.forEach((blob, index) => {
    const phase = time * 0.12 * blob.speed + index * 1.7
    const cx = (blob.x + Math.sin(phase) * blob.drift) * width
    const cy = (blob.y + Math.cos(phase * 0.8) * blob.drift) * height
    const radius = blob.r * size
    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius)
    gradient.addColorStop(0, blob.color)
    gradient.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)
  })

  ctx.globalCompositeOperation = 'soft-light'
  palette.ribbons.forEach((ribbon, index) => {
    const phase = time * 0.1 * ribbon.speed + index
    const pts = ribbon.points.map(([x, y], i) => [
      x * width,
      (y + Math.sin(phase + i * 1.3) * 0.06) * height,
    ])
    ctx.beginPath()
    ctx.moveTo(pts[0][0], pts[0][1])
    ctx.bezierCurveTo(pts[1][0], pts[1][1], pts[2][0], pts[2][1], pts[3][0], pts[3][1])
    ctx.lineWidth = ribbon.width * size
    ctx.lineCap = 'round'
    const stroke = ctx.createLinearGradient(0, 0, width, 0)
    stroke.addColorStop(0, 'rgba(255,255,255,0)')
    stroke.addColorStop(0.5, ribbon.color)
    stroke.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.strokeStyle = stroke
    ctx.stroke()
    // A thin bright crest on top of each ribbon reads as a glass edge.
    ctx.lineWidth = Math.max(1.5, ribbon.width * size * 0.06)
    ctx.strokeStyle = 'rgba(255,255,255,0.35)'
    ctx.globalCompositeOperation = 'overlay'
    ctx.stroke()
    ctx.globalCompositeOperation = 'soft-light'
  })

  ctx.globalCompositeOperation = 'multiply'
  const vignette = ctx.createRadialGradient(width / 2, height / 2, size * 0.25, width / 2, height / 2, size * 0.8)
  vignette.addColorStop(0, 'rgba(255,255,255,1)')
  vignette.addColorStop(1, `rgba(${Math.round(255 * (1 - palette.vignette))},${Math.round(
    255 * (1 - palette.vignette),
  )},${Math.round(255 * (1 - palette.vignette * 0.9))},1)`)
  ctx.fillStyle = vignette
  ctx.fillRect(0, 0, width, height)
  ctx.globalCompositeOperation = 'source-over'
}
