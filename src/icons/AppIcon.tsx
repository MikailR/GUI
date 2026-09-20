import { useId, type CSSProperties } from 'react'
import type { AppId } from '../os/types'
import { squirclePath } from './squircle'

/** Gradient palette per app. Two stops plus a "glow" used for the icon's ambient shadow. */
const PALETTE: Record<AppId, { from: string; to: string; glow: string }> = {
  about: { from: '#6fb4ff', to: '#2d5cff', glow: '#3b7bff' },
  work: { from: '#ffb35c', to: '#ff3d7f', glow: '#ff6a5c' },
  writing: { from: '#ffd98a', to: '#f28c3b', glow: '#f3a04a' },
  lab: { from: '#c58bff', to: '#6d3cff', glow: '#8f5cff' },
  papers: { from: '#8fd7ff', to: '#3c9fd6', glow: '#4fb0e8' },
  trash: { from: '#e8ecf3', to: '#9aa3b2', glow: '#aab3c2' },
  settings: { from: '#9aa1ad', to: '#4b515c', glow: '#6b727e' },
}

const SQUIRCLE = squirclePath(100)

interface AppIconProps {
  appId: AppId
  size?: number
  className?: string
  style?: CSSProperties
  /** Trash renders its "full" glyph when true. */
  full?: boolean
}

/**
 * A liquid-glass app icon: squircle silhouette, two-stop gradient, top sheen,
 * inner specular rim, and a white glyph with a soft drop shadow.
 */
export function AppIcon({ appId, size = 64, className, style, full = false }: AppIconProps) {
  const uid = useId().replace(/:/g, '')
  const palette = PALETTE[appId]
  const gradId = `g-${uid}`
  const sheenId = `s-${uid}`
  const shadowId = `d-${uid}`
  const clipId = `c-${uid}`

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      style={style}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0" stopColor={palette.from} />
          <stop offset="1" stopColor={palette.to} />
        </linearGradient>
        <linearGradient id={sheenId} x1="0" y1="0" x2="0.35" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.62" />
          <stop offset="0.42" stopColor="#fff" stopOpacity="0.1" />
          <stop offset="0.6" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#fff" stopOpacity="0.18" />
        </linearGradient>
        <filter id={shadowId} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1.5" stdDeviation="1.4" floodColor="#000" floodOpacity="0.28" />
        </filter>
        <clipPath id={clipId}>
          <path d={SQUIRCLE} />
        </clipPath>
      </defs>

      <path d={SQUIRCLE} fill={`url(#${gradId})`} />
      <g clipPath={`url(#${clipId})`}>
        {/* Soft inner light pooling at the bottom, like a thick glass tile. */}
        <ellipse cx="50" cy="104" rx="52" ry="34" fill="#fff" fillOpacity="0.14" />
        <ellipse cx="30" cy="-6" rx="60" ry="36" fill="#fff" fillOpacity="0.22" />
      </g>
      <path d={SQUIRCLE} fill={`url(#${sheenId})`} />
      {/* Specular rim */}
      <path
        d={SQUIRCLE}
        fill="none"
        stroke="#fff"
        strokeOpacity="0.55"
        strokeWidth="1.6"
        style={{ transform: 'scale(0.984)', transformOrigin: '50px 50px' }}
      />
      <g fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" filter={`url(#${shadowId})`}>
        <Glyph appId={appId} full={full} />
      </g>
    </svg>
  )
}

function Glyph({ appId, full }: { appId: AppId; full: boolean }) {
  switch (appId) {
    case 'about':
      return (
        <>
          <circle cx="50" cy="38" r="13" />
          <path d="M26 78c3-14 12-21 24-21s21 7 24 21" />
        </>
      )
    case 'work':
      return (
        <>
          <path d="M34 26h32v14c0 11-7 19-16 19s-16-8-16-19V26z" />
          <path d="M34 32h-8c0 9 4 14 10 15M66 32h8c0 9-4 14-10 15" />
          <path d="M50 59v9M40 74h20" />
        </>
      )
    case 'writing':
      return (
        <>
          <path d="M62 26l12 12-32 32-16 4 4-16 32-32z" />
          <path d="M54 34l12 12" />
        </>
      )
    case 'lab':
      return (
        <>
          <path d="M42 24h16M45 24v18L28 68c-2 4 0 8 5 8h34c5 0 7-4 5-8L55 42V24" />
          <path d="M36 60h28" strokeOpacity="0.85" />
        </>
      )
    case 'papers':
      return (
        <>
          <path d="M36 22h20l12 12v40H36V22z" />
          <path d="M56 22v12h12" />
          <path d="M44 48h16M44 58h16" strokeOpacity="0.85" />
          <path d="M30 32v46h30" strokeOpacity="0.55" />
        </>
      )
    case 'trash':
      return (
        <>
          <path d="M30 34h40M43 34v-6h14v6" />
          <path d="M34 34l3 40h26l3-40" />
          {full ? (
            <path d="M44 46v20M50 46v20M56 46v20" strokeOpacity="0.9" />
          ) : (
            <path d="M50 46v20" strokeOpacity="0.5" />
          )}
        </>
      )
    case 'settings':
      return (
        <>
          <path d="M28 36h44M28 50h44M28 64h44" />
          <circle cx="40" cy="36" r="5" fill="#fff" />
          <circle cx="60" cy="50" r="5" fill="#fff" />
          <circle cx="44" cy="64" r="5" fill="#fff" />
        </>
      )
    default: {
      const exhaustive: never = appId
      return exhaustive
    }
  }
}

export function appGlow(appId: AppId): string {
  return PALETTE[appId].glow
}
