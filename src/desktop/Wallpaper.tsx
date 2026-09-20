import { useEffect, useRef } from 'react'
import { useReducedMotion } from '../os/hooks'
import { useOs, useResolvedAppearance } from '../os/store'
import { paintWallpaper, WALLPAPERS } from './wallpapers'

/** Low internal resolution; the browser upscales with bilinear filtering = free blur. */
const INTERNAL_WIDTH = 360

interface WallpaperProps {
  /** Phone shell passes false so the home screen stays still and cheap. */
  animate?: boolean
  className?: string
}

/**
 * Generative liquid wallpaper. Renders on a small canvas and drifts very slowly.
 * Pauses when the tab is hidden, when reduced motion is requested, or when
 * the "live wallpaper" setting is off (paints a single frame in that case).
 */
export function Wallpaper({ animate = true, className }: WallpaperProps) {
  const { state } = useOs()
  const appearance = useResolvedAppearance()
  const reducedMotion = useReducedMotion()
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const spec = WALLPAPERS[state.settings.wallpaper]
  const live = animate && state.settings.liveWallpaper && !reducedMotion

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      const aspect = window.innerHeight / Math.max(1, window.innerWidth)
      canvas.width = INTERNAL_WIDTH
      canvas.height = Math.max(120, Math.round(INTERNAL_WIDTH * aspect))
    }
    resize()

    let frame = 0
    let running = live
    const start = performance.now()
    // Offset the clock so the first frame is already "in motion" rather than the symmetric t=0 pose.
    const timeOffset = 37

    const draw = (now: number) => {
      paintWallpaper(ctx, spec, appearance, timeOffset + (now - start) / 1000)
    }

    const loop = (now: number) => {
      if (!running) return
      draw(now)
      frame = requestAnimationFrame(loop)
    }

    draw(start)
    if (live) frame = requestAnimationFrame(loop)

    const onVisibility = () => {
      if (!live) return
      if (document.hidden) {
        running = false
        cancelAnimationFrame(frame)
      } else if (!running) {
        running = true
        frame = requestAnimationFrame(loop)
      }
    }
    const onResize = () => {
      resize()
      draw(performance.now())
    }
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('resize', onResize)
    return () => {
      running = false
      cancelAnimationFrame(frame)
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('resize', onResize)
    }
  }, [spec, appearance, live])

  return (
    <div className={`wallpaper ${className ?? ''}`} aria-hidden="true">
      <canvas ref={canvasRef} className="wallpaper__canvas" />
      <div className="grain" />
    </div>
  )
}
