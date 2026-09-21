import type { ResolvedAppearance, WallpaperId } from './types'

export interface Blob {
  /** Normalised centre (0–1). */
  x: number
  y: number
  /** Radius as a fraction of the longer side. */
  r: number
  color: string
  /** Drift amplitude (fraction of size) and speed multiplier. */
  drift: number
  speed: number
}

export interface Ribbon {
  /** Control points, normalised. */
  points: [number, number][]
  width: number
  color: string
  speed: number
}

export interface WallpaperPalette {
  base: [string, string, string]
  blobs: Blob[]
  ribbons: Ribbon[]
  /** Vignette strength 0–1. */
  vignette: number
}

export interface WallpaperDef {
  id: WallpaperId
  name: string
  light: WallpaperPalette
  dark: WallpaperPalette
  /** Swatch gradient for pickers. */
  swatch: string
}

export const WALLPAPERS: readonly WallpaperDef[] = [
  {
    id: 'tahoe',
    name: 'Tahoe',
    swatch: 'linear-gradient(135deg, #1f4fd8, #6d3df0 55%, #ff7ac8)',
    light: {
      base: ['#7fb2ff', '#4f7dff', '#8a63ff'],
      blobs: [
        { x: 0.18, y: 0.28, r: 0.55, color: 'rgba(140, 210, 255, 0.95)', drift: 0.05, speed: 0.7 },
        { x: 0.78, y: 0.22, r: 0.5, color: 'rgba(160, 120, 255, 0.9)', drift: 0.06, speed: 0.55 },
        { x: 0.62, y: 0.8, r: 0.6, color: 'rgba(255, 130, 200, 0.75)', drift: 0.05, speed: 0.45 },
        { x: 0.12, y: 0.86, r: 0.45, color: 'rgba(80, 120, 255, 0.85)', drift: 0.04, speed: 0.6 },
        { x: 0.5, y: 0.5, r: 0.3, color: 'rgba(255, 255, 255, 0.35)', drift: 0.08, speed: 0.9 },
      ],
      ribbons: [
        { points: [[-0.1, 0.72], [0.3, 0.42], [0.7, 0.86], [1.1, 0.5]], width: 0.18, color: 'rgba(255,255,255,0.28)', speed: 0.5 },
        { points: [[-0.1, 0.35], [0.35, 0.62], [0.65, 0.2], [1.1, 0.45]], width: 0.1, color: 'rgba(255,255,255,0.18)', speed: 0.35 },
      ],
      vignette: 0.18,
    },
    dark: {
      base: ['#0c1a4a', '#1b2a80', '#3a1f7a'],
      blobs: [
        { x: 0.2, y: 0.3, r: 0.55, color: 'rgba(40, 110, 255, 0.85)', drift: 0.05, speed: 0.7 },
        { x: 0.8, y: 0.25, r: 0.5, color: 'rgba(120, 60, 255, 0.8)', drift: 0.06, speed: 0.55 },
        { x: 0.65, y: 0.82, r: 0.6, color: 'rgba(255, 80, 170, 0.5)', drift: 0.05, speed: 0.45 },
        { x: 0.1, y: 0.85, r: 0.45, color: 'rgba(20, 200, 255, 0.45)', drift: 0.04, speed: 0.6 },
      ],
      ribbons: [
        { points: [[-0.1, 0.7], [0.3, 0.4], [0.7, 0.85], [1.1, 0.5]], width: 0.18, color: 'rgba(160,190,255,0.22)', speed: 0.5 },
        { points: [[-0.1, 0.32], [0.35, 0.6], [0.65, 0.18], [1.1, 0.42]], width: 0.1, color: 'rgba(255,200,255,0.14)', speed: 0.35 },
      ],
      vignette: 0.45,
    },
  },
  {
    id: 'sequoia',
    name: 'Sequoia',
    swatch: 'linear-gradient(135deg, #ff9b3d, #ff4d8d 50%, #4d7cff)',
    light: {
      base: ['#ffb36a', '#ff6f9a', '#7a8cff'],
      blobs: [
        { x: 0.15, y: 0.25, r: 0.55, color: 'rgba(255, 210, 120, 0.95)', drift: 0.05, speed: 0.6 },
        { x: 0.8, y: 0.3, r: 0.5, color: 'rgba(255, 90, 150, 0.8)', drift: 0.06, speed: 0.5 },
        { x: 0.7, y: 0.85, r: 0.6, color: 'rgba(90, 120, 255, 0.85)', drift: 0.05, speed: 0.45 },
        { x: 0.2, y: 0.9, r: 0.45, color: 'rgba(255, 150, 90, 0.8)', drift: 0.04, speed: 0.55 },
      ],
      ribbons: [
        { points: [[-0.1, 0.6], [0.35, 0.3], [0.65, 0.75], [1.1, 0.4]], width: 0.2, color: 'rgba(255,255,255,0.26)', speed: 0.45 },
        { points: [[-0.1, 0.8], [0.3, 0.95], [0.7, 0.55], [1.1, 0.7]], width: 0.12, color: 'rgba(255,240,220,0.2)', speed: 0.3 },
      ],
      vignette: 0.15,
    },
    dark: {
      base: ['#3a0f2e', '#6a1f3f', '#1f2a6a'],
      blobs: [
        { x: 0.15, y: 0.25, r: 0.55, color: 'rgba(255, 140, 60, 0.7)', drift: 0.05, speed: 0.6 },
        { x: 0.8, y: 0.3, r: 0.5, color: 'rgba(255, 50, 120, 0.6)', drift: 0.06, speed: 0.5 },
        { x: 0.7, y: 0.85, r: 0.6, color: 'rgba(60, 90, 255, 0.7)', drift: 0.05, speed: 0.45 },
      ],
      ribbons: [
        { points: [[-0.1, 0.6], [0.35, 0.3], [0.65, 0.75], [1.1, 0.4]], width: 0.2, color: 'rgba(255,200,180,0.18)', speed: 0.45 },
      ],
      vignette: 0.45,
    },
  },
  {
    id: 'sonoma',
    name: 'Sonoma',
    swatch: 'linear-gradient(135deg, #7fd7ff, #3fa77a 55%, #124a4a)',
    light: {
      base: ['#a8e4ff', '#6cc9b8', '#2e8b7a'],
      blobs: [
        { x: 0.2, y: 0.2, r: 0.55, color: 'rgba(200, 245, 255, 0.95)', drift: 0.05, speed: 0.6 },
        { x: 0.8, y: 0.3, r: 0.5, color: 'rgba(120, 230, 190, 0.85)', drift: 0.06, speed: 0.5 },
        { x: 0.6, y: 0.9, r: 0.6, color: 'rgba(30, 110, 100, 0.75)', drift: 0.05, speed: 0.45 },
        { x: 0.1, y: 0.8, r: 0.45, color: 'rgba(255, 230, 150, 0.55)', drift: 0.04, speed: 0.55 },
      ],
      ribbons: [
        { points: [[-0.1, 0.55], [0.35, 0.35], [0.65, 0.7], [1.1, 0.45]], width: 0.2, color: 'rgba(255,255,255,0.24)', speed: 0.4 },
      ],
      vignette: 0.15,
    },
    dark: {
      base: ['#04222b', '#0a3d3c', '#0c2f4a'],
      blobs: [
        { x: 0.2, y: 0.2, r: 0.55, color: 'rgba(40, 170, 200, 0.6)', drift: 0.05, speed: 0.6 },
        { x: 0.8, y: 0.3, r: 0.5, color: 'rgba(60, 200, 140, 0.55)', drift: 0.06, speed: 0.5 },
        { x: 0.6, y: 0.9, r: 0.6, color: 'rgba(20, 80, 120, 0.8)', drift: 0.05, speed: 0.45 },
      ],
      ribbons: [
        { points: [[-0.1, 0.55], [0.35, 0.35], [0.65, 0.7], [1.1, 0.45]], width: 0.2, color: 'rgba(180,255,230,0.14)', speed: 0.4 },
      ],
      vignette: 0.5,
    },
  },
  {
    id: 'graphite',
    name: 'Graphite',
    swatch: 'linear-gradient(135deg, #cfd5e0, #7d8594 55%, #262a33)',
    light: {
      base: ['#e3e7ee', '#b8c0cf', '#8b94a6'],
      blobs: [
        { x: 0.2, y: 0.25, r: 0.55, color: 'rgba(255, 255, 255, 0.9)', drift: 0.05, speed: 0.6 },
        { x: 0.8, y: 0.3, r: 0.5, color: 'rgba(170, 185, 210, 0.85)', drift: 0.06, speed: 0.5 },
        { x: 0.6, y: 0.9, r: 0.6, color: 'rgba(90, 100, 120, 0.7)', drift: 0.05, speed: 0.45 },
      ],
      ribbons: [
        { points: [[-0.1, 0.6], [0.35, 0.35], [0.65, 0.75], [1.1, 0.45]], width: 0.2, color: 'rgba(255,255,255,0.35)', speed: 0.4 },
      ],
      vignette: 0.12,
    },
    dark: {
      base: ['#0d0f14', '#1b1f28', '#2a2f3b'],
      blobs: [
        { x: 0.2, y: 0.25, r: 0.55, color: 'rgba(90, 100, 130, 0.7)', drift: 0.05, speed: 0.6 },
        { x: 0.8, y: 0.3, r: 0.5, color: 'rgba(60, 70, 95, 0.75)', drift: 0.06, speed: 0.5 },
        { x: 0.6, y: 0.9, r: 0.6, color: 'rgba(120, 130, 160, 0.4)', drift: 0.05, speed: 0.45 },
      ],
      ribbons: [
        { points: [[-0.1, 0.6], [0.35, 0.35], [0.65, 0.75], [1.1, 0.45]], width: 0.2, color: 'rgba(255,255,255,0.1)', speed: 0.4 },
      ],
      vignette: 0.55,
    },
  },
]

export function wallpaperDef(id: WallpaperId): WallpaperDef {
  return WALLPAPERS.find((wallpaper) => wallpaper.id === id) ?? WALLPAPERS[0]
}

export function wallpaperPalette(id: WallpaperId, appearance: ResolvedAppearance): WallpaperPalette {
  const def = wallpaperDef(id)
  return appearance === 'dark' ? def.dark : def.light
}
