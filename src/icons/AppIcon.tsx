import type { CSSProperties } from 'react'
import type { AppId } from '../os/types'
import { IconShell, type IconVariant } from './IconShell'

export type { IconVariant } from './IconShell'

/**
 * App icons in Apple's icon language: a squircle filled edge-to-edge with a rich
 * two-stop gradient, a white filled glyph with a soft contact shadow, a top-light
 * sheen and a hairline specular edge (see IconShell). All glyphs are original
 * drawings in an SF-Symbols-like weight; no Apple assets.
 */

interface AppIconProps {
  appId: AppId
  size?: number
  variant?: IconVariant
  /** Trash shows crumpled paper when true. */
  full?: boolean
  className?: string
  style?: CSSProperties
}

interface Palette {
  from: string
  to: string
  /** Colour used by shells for ambient glow / badges. */
  glow: string
}

const PALETTE: Record<AppId, Palette> = {
  about: { from: '#7CC6FF', to: '#1D5CFF', glow: '#3d7dff' },
  hackathons: { from: '#FFB340', to: '#FF2D55', glow: '#ff6a4d' },
  writing: { from: '#FFFDF7', to: '#F4EEDD', glow: '#ffc93c' },
  lab: { from: '#D28BFF', to: '#5B3CF5', glow: '#8b5cff' },
  papers: { from: '#FFFFFF', to: '#E9EEF6', glow: '#4b8dff' },
  trash: { from: '#F4F6F9', to: '#BFC6D1', glow: '#9aa5b5' },
  settings: { from: '#A6A6AD', to: '#55555C', glow: '#7a7a82' },
}

export function appGlow(appId: AppId): string {
  return PALETTE[appId].glow
}

export function AppIcon({ appId, size = 64, variant = 'ios', full = false, className, style }: AppIconProps) {
  const palette = PALETTE[appId]
  return (
    <IconShell size={size} variant={variant} from={palette.from} to={palette.to} className={className} style={style}>
      {(shadow) => <Artwork appId={appId} full={full} shadow={shadow} />}
    </IconShell>
  )
}

/* ------------------------------------------------------------------ Art */

interface ArtworkProps {
  appId: AppId
  full: boolean
  shadow: string
}

function Artwork({ appId, full, shadow }: ArtworkProps) {
  switch (appId) {
    case 'about':
      return (
        <g filter={shadow}>
          <circle cx="60" cy="44" r="16" fill="#fff" />
          <path d="M28 106C28 80 41 68 60 68s32 12 32 38v14H28z" fill="#fff" />
        </g>
      )
    case 'hackathons':
      return (
        <g filter={shadow}>
          <path
            d="M27 36h10v-6h46v6h10c3 0 5 2.4 4.6 5.4C96 55 90 62 81 64.5 77.4 71 71 75.6 64 76.8V86h10c2.2 0 4 1.8 4 4v4H42v-4c0-2.2 1.8-4 4-4h10v-9.2C49 75.6 42.6 71 39 64.5 30 62 24 55 22.4 41.4 22 38.4 24 36 27 36zm3 6c1.2 8.5 4.5 13.6 9.4 16.3-.9-3-1.4-6.3-1.4-9.8V42zm60 0h-8v6.5c0 3.5-.5 6.8-1.4 9.8 4.9-2.7 8.2-7.8 9.4-16.3z"
            fill="#fff"
          />
          <path d="M60 41l3.4 7.2 7.8 1-5.7 5.4 1.5 7.8L60 58.6l-7 3.8 1.5-7.8-5.7-5.4 7.8-1z" fill="#FF6A3D" />
        </g>
      )
    case 'writing':
      return (
        <>
          <rect width="120" height="32" fill="#FFD43A" />
          <rect y="30" width="120" height="3" fill="#E4B420" opacity="0.6" />
          {Array.from({ length: 8 }, (_, i) => (
            <circle key={i} cx={18 + i * 12} cy="14" r="1.9" fill="#000" opacity="0.28" />
          ))}
          <g stroke="#C9C1A9" strokeWidth="3.2" strokeLinecap="round">
            <path d="M22 52h76M22 66h76M22 80h76M22 94h46" />
          </g>
        </>
      )
    case 'lab':
      return (
        <g filter={shadow}>
          <path
            d="M46 22h28c1.7 0 3 1.3 3 3s-1.3 3-3 3h-3v18.4l22.6 38.8C96.7 90.6 92.9 98 86.7 98H33.3c-6.2 0-10-7.4-6.9-12.8L49 46.4V28h-3c-1.7 0-3-1.3-3-3s1.3-3 3-3z"
            fill="#fff"
          />
          <path d="M44.5 70L36 84.5c-1.6 2.8.3 6.5 3.5 6.5h41c3.2 0 5.1-3.7 3.5-6.5L75.5 70z" fill="#7A4CFF" />
          <circle cx="66" cy="81" r="3" fill="#fff" opacity="0.9" />
          <circle cx="55" cy="85.5" r="2" fill="#fff" opacity="0.8" />
          <circle cx="80" cy="34" r="3.5" fill="#fff" opacity="0.9" />
          <circle cx="88" cy="24" r="2.2" fill="#fff" opacity="0.7" />
        </g>
      )
    case 'papers':
      return (
        <g filter={shadow}>
          <path
            d="M22 44c0-3.3 2.7-6 6-6h22.5c1.6 0 3.1.6 4.2 1.8L59 44h33c3.3 0 6 2.7 6 6v40c0 3.3-2.7 6-6 6H28c-3.3 0-6-2.7-6-6z"
            fill="#1B63E4"
          />
          <rect x="35" y="48" width="50" height="30" rx="3.5" fill="#fff" />
          <path d="M42 56h30M42 62h36M42 68h22" stroke="#B9C7DC" strokeWidth="2.6" strokeLinecap="round" />
          <path
            d="M22 60c0-3.3 2.7-6 6-6h64c3.3 0 6 2.7 6 6v30c0 3.3-2.7 6-6 6H28c-3.3 0-6-2.7-6-6z"
            fill="#4A93FF"
          />
          <path d="M22 60c0-3.3 2.7-6 6-6h64c3.3 0 6 2.7 6 6v2H22z" fill="#fff" opacity="0.28" />
        </g>
      )
    case 'trash':
      return (
        <g filter={shadow}>
          {full && (
            <g>
              <path d="M40 38c-2-10 6-16 14-13 4-6 14-5 16 2 8-1 12 6 9 12z" fill="#fff" stroke="#9AA3AF" strokeWidth="1.6" />
              <path d="M52 30l6 3-4 5" fill="none" stroke="#9AA3AF" strokeWidth="1.4" />
            </g>
          )}
          <path d="M32 44l5 50c.3 2.3 2.2 4 4.5 4h37c2.3 0 4.2-1.7 4.5-4l5-50z" fill="#fff" opacity="0.55" />
          <g stroke="#6B7482" strokeWidth="1.5" opacity="0.9">
            <path d="M46 44l2 54M53 44l1 54M60 44v54M67 44l-1 54M74 44l-2 54" />
            <path d="M34.3 57h51.4M35.6 70h48.8M36.9 83h46.2" />
          </g>
          <path d="M32 44l5 50c.3 2.3 2.2 4 4.5 4h37c2.3 0 4.2-1.7 4.5-4l5-50z" fill="none" stroke="#5F6875" strokeWidth="2.4" />
          <rect x="26" y="36" width="68" height="9" rx="4.5" fill="#8A93A1" />
          <rect x="26" y="36" width="68" height="4" rx="2" fill="#fff" opacity="0.35" />
        </g>
      )
    case 'settings':
      return (
        <g filter={shadow}>
          <path d={gearPath(60, 60, 40, 32, 10)} fill="#fff" />
          <circle cx="60" cy="60" r="20" fill="#6C6C72" />
          <path d={gearPath(60, 60, 15.5, 11.5, 8)} fill="#F2F2F4" />
          <circle cx="60" cy="60" r="5.5" fill="#6C6C72" />
        </g>
      )
    default: {
      const exhaustive: never = appId
      return exhaustive
    }
  }
}

/** A gear outline with flat-topped teeth as a single closed path. */
function gearPath(cx: number, cy: number, outer: number, inner: number, teeth: number): string {
  const step = (Math.PI * 2) / teeth
  const parts: string[] = []
  for (let i = 0; i < teeth; i += 1) {
    const a0 = i * step
    const toothWidth = step * 0.42
    const gapWidth = step * 0.58
    const p = (r: number, a: number) => `${(cx + r * Math.cos(a)).toFixed(2)} ${(cy + r * Math.sin(a)).toFixed(2)}`
    const a1 = a0 + toothWidth * 0.18
    const a2 = a0 + toothWidth * 0.82
    const a3 = a0 + toothWidth
    const a4 = a0 + toothWidth + gapWidth
    parts.push(
      `${i === 0 ? 'M' : 'L'}${p(inner, a0)}`,
      `L${p(outer, a1)}`,
      `L${p(outer, a2)}`,
      `L${p(inner, a3)}`,
      `A${inner} ${inner} 0 0 1 ${p(inner, a4)}`,
    )
  }
  return `${parts.join('')}Z`
}
