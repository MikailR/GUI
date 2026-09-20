import type { WallpaperId } from '../os/types'

export interface WallpaperBlob {
  /** Colour as [h, s%, l%]. */
  hsl: [number, number, number]
  alpha: number
  /** Centre and drift amplitude in unit space (0..1 of canvas size). */
  cx: number
  cy: number
  ax: number
  ay: number
  /** Radius in unit space (relative to the canvas diagonal). */
  r: number
  /** Angular speed multipliers (very slow: radians per second). */
  sx: number
  sy: number
  phase: number
}

export interface WallpaperRibbon {
  hsl: [number, number, number]
  alpha: number
  width: number
  /** Control points in unit space; animated with a gentle vertical sway. */
  points: [number, number][]
  sway: number
  speed: number
}

export interface WallpaperSpec {
  id: WallpaperId
  name: string
  description: string
  /** Vertical base gradient for dark / light appearance. */
  base: { dark: [string, string]; light: [string, string] }
  blobs: WallpaperBlob[]
  ribbons: WallpaperRibbon[]
  /** Compositing mode for blobs; 'screen' reads as light, 'lighter' as neon. */
  blend: GlobalCompositeOperation
  /** Reduce blob alpha in light appearance so chrome stays legible. */
  lightAlpha: number
}

export const WALLPAPERS: Record<WallpaperId, WallpaperSpec> = {
  tahoe: {
    id: 'tahoe',
    name: 'Tahoe',
    description: 'Deep navy with glass ribbons of azure, violet and coral.',
    base: { dark: ['#070b1a', '#141c3d'], light: ['#7f9dd9', '#dbe4f7'] },
    blend: 'screen',
    lightAlpha: 0.7,
    blobs: [
      { hsl: [222, 95, 62], alpha: 0.75, cx: 0.22, cy: 0.35, ax: 0.08, ay: 0.06, r: 0.34, sx: 0.05, sy: 0.04, phase: 0 },
      { hsl: [262, 90, 62], alpha: 0.6, cx: 0.55, cy: 0.6, ax: 0.1, ay: 0.08, r: 0.36, sx: 0.04, sy: 0.06, phase: 1.7 },
      { hsl: [330, 92, 66], alpha: 0.45, cx: 0.78, cy: 0.3, ax: 0.07, ay: 0.09, r: 0.28, sx: 0.06, sy: 0.05, phase: 3.1 },
      { hsl: [18, 100, 64], alpha: 0.42, cx: 0.85, cy: 0.78, ax: 0.06, ay: 0.05, r: 0.26, sx: 0.045, sy: 0.07, phase: 4.6 },
      { hsl: [190, 95, 60], alpha: 0.3, cx: 0.4, cy: 0.9, ax: 0.1, ay: 0.04, r: 0.3, sx: 0.035, sy: 0.05, phase: 2.3 },
    ],
    ribbons: [
      { hsl: [210, 100, 88], alpha: 0.28, width: 0.05, points: [[-0.1, 0.72], [0.25, 0.42], [0.55, 0.78], [1.1, 0.35]], sway: 0.05, speed: 0.06 },
      { hsl: [300, 100, 86], alpha: 0.2, width: 0.035, points: [[-0.1, 0.3], [0.3, 0.6], [0.7, 0.2], [1.1, 0.6]], sway: 0.06, speed: 0.045 },
      { hsl: [30, 100, 85], alpha: 0.14, width: 0.02, points: [[-0.1, 0.9], [0.4, 0.7], [0.75, 0.95], [1.1, 0.7]], sway: 0.04, speed: 0.07 },
    ],
  },
  dawn: {
    id: 'dawn',
    name: 'Dawn',
    description: 'Pale sky, peach and lavender light. Made for light appearance.',
    base: { dark: ['#1c1b33', '#3a2f4d'], light: ['#cfe0ff', '#fde9d9'] },
    blend: 'screen',
    lightAlpha: 0.55,
    blobs: [
      { hsl: [28, 100, 74], alpha: 0.7, cx: 0.7, cy: 0.72, ax: 0.08, ay: 0.06, r: 0.38, sx: 0.04, sy: 0.05, phase: 0.4 },
      { hsl: [268, 80, 76], alpha: 0.55, cx: 0.25, cy: 0.3, ax: 0.09, ay: 0.07, r: 0.36, sx: 0.05, sy: 0.04, phase: 2.2 },
      { hsl: [200, 95, 74], alpha: 0.5, cx: 0.5, cy: 0.05, ax: 0.1, ay: 0.05, r: 0.34, sx: 0.045, sy: 0.06, phase: 3.9 },
      { hsl: [345, 90, 76], alpha: 0.4, cx: 0.15, cy: 0.9, ax: 0.07, ay: 0.06, r: 0.3, sx: 0.06, sy: 0.05, phase: 5.2 },
    ],
    ribbons: [
      { hsl: [40, 100, 92], alpha: 0.34, width: 0.06, points: [[-0.1, 0.55], [0.3, 0.8], [0.65, 0.45], [1.1, 0.7]], sway: 0.05, speed: 0.05 },
      { hsl: [280, 100, 92], alpha: 0.22, width: 0.03, points: [[-0.1, 0.25], [0.35, 0.15], [0.7, 0.45], [1.1, 0.2]], sway: 0.05, speed: 0.06 },
    ],
  },
  graphite: {
    id: 'graphite',
    name: 'Graphite',
    description: 'Monochrome smoke with a whisper of blue. Lets the glass do the talking.',
    base: { dark: ['#0a0b0f', '#1e2129'], light: ['#b9bec8', '#eef0f4'] },
    blend: 'screen',
    lightAlpha: 0.5,
    blobs: [
      { hsl: [220, 20, 55], alpha: 0.55, cx: 0.3, cy: 0.4, ax: 0.1, ay: 0.08, r: 0.4, sx: 0.04, sy: 0.05, phase: 0 },
      { hsl: [215, 30, 70], alpha: 0.35, cx: 0.75, cy: 0.7, ax: 0.08, ay: 0.06, r: 0.34, sx: 0.05, sy: 0.04, phase: 2 },
      { hsl: [200, 25, 45], alpha: 0.4, cx: 0.6, cy: 0.15, ax: 0.09, ay: 0.05, r: 0.3, sx: 0.045, sy: 0.06, phase: 4 },
    ],
    ribbons: [
      { hsl: [210, 30, 95], alpha: 0.22, width: 0.05, points: [[-0.1, 0.65], [0.3, 0.35], [0.6, 0.75], [1.1, 0.4]], sway: 0.05, speed: 0.05 },
      { hsl: [210, 20, 90], alpha: 0.12, width: 0.02, points: [[-0.1, 0.2], [0.4, 0.5], [0.8, 0.15], [1.1, 0.5]], sway: 0.05, speed: 0.06 },
    ],
  },
  solar: {
    id: 'solar',
    name: 'Solar',
    description: 'Ember, amber and rose. Warm light through thick glass.',
    base: { dark: ['#180a0f', '#3a1420'], light: ['#f5b58a', '#fde3cf'] },
    blend: 'screen',
    lightAlpha: 0.65,
    blobs: [
      { hsl: [14, 100, 58], alpha: 0.7, cx: 0.3, cy: 0.65, ax: 0.09, ay: 0.06, r: 0.38, sx: 0.045, sy: 0.05, phase: 0.8 },
      { hsl: [40, 100, 60], alpha: 0.55, cx: 0.72, cy: 0.35, ax: 0.08, ay: 0.08, r: 0.34, sx: 0.05, sy: 0.04, phase: 2.5 },
      { hsl: [340, 90, 60], alpha: 0.45, cx: 0.85, cy: 0.85, ax: 0.06, ay: 0.06, r: 0.3, sx: 0.06, sy: 0.055, phase: 4.1 },
      { hsl: [280, 70, 55], alpha: 0.3, cx: 0.1, cy: 0.15, ax: 0.07, ay: 0.06, r: 0.3, sx: 0.04, sy: 0.06, phase: 5.5 },
    ],
    ribbons: [
      { hsl: [40, 100, 90], alpha: 0.3, width: 0.05, points: [[-0.1, 0.4], [0.3, 0.7], [0.65, 0.3], [1.1, 0.6]], sway: 0.05, speed: 0.05 },
      { hsl: [350, 100, 90], alpha: 0.18, width: 0.03, points: [[-0.1, 0.8], [0.35, 0.55], [0.7, 0.85], [1.1, 0.5]], sway: 0.06, speed: 0.065 },
    ],
  },
}

export const WALLPAPER_LIST = Object.values(WALLPAPERS)

/**
 * Paint one frame of a wallpaper into a 2D context. Runs at low resolution;
 * CSS upscaling supplies the blur for free.
 */
export function paintWallpaper(
  ctx: CanvasRenderingContext2D,
  spec: WallpaperSpec,
  appearance: 'light' | 'dark',
  t: number,
) {
  const { width, height } = ctx.canvas
  const diag = Math.hypot(width, height)
  const alphaScale = appearance === 'light' ? spec.lightAlpha : 1

  ctx.globalCompositeOperation = 'source-over'
  const base = spec.base[appearance]
  const grad = ctx.createLinearGradient(0, 0, 0, height)
  grad.addColorStop(0, base[0])
  grad.addColorStop(1, base[1])
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, width, height)

  ctx.globalCompositeOperation = spec.blend
  for (const blob of spec.blobs) {
    const x = (blob.cx + blob.ax * Math.sin(t * blob.sx + blob.phase)) * width
    const y = (blob.cy + blob.ay * Math.cos(t * blob.sy + blob.phase)) * height
    const r = blob.r * diag
    const [h, s, l] = blob.hsl
    const radial = ctx.createRadialGradient(x, y, 0, x, y, r)
    radial.addColorStop(0, `hsla(${h} ${s}% ${l}% / ${blob.alpha * alphaScale})`)
    radial.addColorStop(0.45, `hsla(${h} ${s}% ${l}% / ${blob.alpha * alphaScale * 0.45})`)
    radial.addColorStop(1, `hsla(${h} ${s}% ${l}% / 0)`)
    ctx.fillStyle = radial
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
  }

  // Ribbons: wide translucent strokes with a bright thin core, like a glass edge catching light.
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  for (const ribbon of spec.ribbons) {
    const pts = ribbon.points.map(([px, py], i) => {
      const sway = Math.sin(t * ribbon.speed + i * 1.3) * ribbon.sway
      return [px * width, (py + sway) * height] as const
    })
    const [h, s, l] = ribbon.hsl
    const path = new Path2D()
    path.moveTo(pts[0][0], pts[0][1])
    for (let i = 1; i < pts.length - 1; i++) {
      const midX = (pts[i][0] + pts[i + 1][0]) / 2
      const midY = (pts[i][1] + pts[i + 1][1]) / 2
      path.quadraticCurveTo(pts[i][0], pts[i][1], midX, midY)
    }
    const last = pts[pts.length - 1]
    path.lineTo(last[0], last[1])

    ctx.strokeStyle = `hsla(${h} ${s}% ${l}% / ${ribbon.alpha * 0.5 * alphaScale})`
    ctx.lineWidth = ribbon.width * diag
    ctx.stroke(path)
    ctx.strokeStyle = `hsla(${h} ${s}% ${l}% / ${ribbon.alpha * alphaScale})`
    ctx.lineWidth = ribbon.width * diag * 0.18
    ctx.stroke(path)
  }

  // Vignette to add depth at the edges.
  ctx.globalCompositeOperation = 'source-over'
  const vignette = ctx.createRadialGradient(width / 2, height / 2, diag * 0.25, width / 2, height / 2, diag * 0.62)
  vignette.addColorStop(0, 'rgba(0,0,0,0)')
  vignette.addColorStop(1, appearance === 'dark' ? 'rgba(0,0,0,0.45)' : 'rgba(20,20,40,0.18)')
  ctx.fillStyle = vignette
  ctx.fillRect(0, 0, width, height)
}
