import { useId, type CSSProperties, type ReactNode } from 'react'
import { ICON_BOX, ICON_SQUIRCLE } from './squircle'

export type IconVariant = 'ios' | 'mac'

interface IconShellProps {
  size: number
  variant: IconVariant
  /** Gradient stops for the squircle fill. */
  from: string
  to: string
  /** Direction light comes from, in degrees (CSS gradient convention). */
  lightAngle?: number
  className?: string
  style?: CSSProperties
  /**
   * Artwork rendered inside the squircle clip, in a 120×120 box. Receives a
   * `filter` URL for the shared glyph contact-shadow.
   */
  children: (shadow: string) => ReactNode
}

/**
 * The shared Apple-icon layering: squircle clip → gradient fill → artwork →
 * darker foot → top-light sheen → hairline specular rim. `mac` adds more depth.
 */
export function IconShell({ size, variant, from, to, lightAngle = 150, className, style, children }: IconShellProps) {
  const uid = useId().replace(/:/g, '')
  const rad = ((lightAngle - 90) * Math.PI) / 180
  const x2 = 0.5 + Math.cos(rad) * 0.5
  const y2 = 0.5 + Math.sin(rad) * 0.5
  const x1 = 1 - x2
  const y1 = 1 - y2
  const ids = {
    clip: `clip-${uid}`,
    bg: `bg-${uid}`,
    sheen: `sheen-${uid}`,
    rim: `rim-${uid}`,
    foot: `foot-${uid}`,
    shadow: `shadow-${uid}`,
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${ICON_BOX} ${ICON_BOX}`}
      className={className}
      style={style}
      aria-hidden="true"
      focusable="false"
      data-variant={variant}
    >
      <defs>
        <clipPath id={ids.clip}>
          <path d={ICON_SQUIRCLE} />
        </clipPath>
        <linearGradient id={ids.bg} x1={x1} y1={y1} x2={x2} y2={y2}>
          <stop offset="0" stopColor={from} />
          <stop offset="1" stopColor={to} />
        </linearGradient>
        <linearGradient id={ids.sheen} x1={x1} y1={y1} x2={x2} y2={y2}>
          <stop offset="0" stopColor="#fff" stopOpacity={variant === 'mac' ? 0.34 : 0.28} />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.04" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={ids.rim} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.7" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.18" />
          <stop offset="1" stopColor="#fff" stopOpacity="0.08" />
        </linearGradient>
        <radialGradient id={ids.foot} cx="0.5" cy="1.05" r="0.7">
          <stop offset="0" stopColor="#000" stopOpacity={variant === 'mac' ? 0.22 : 0.12} />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <filter id={ids.shadow} x="-20%" y="-20%" width="140%" height="150%">
          <feDropShadow dx="0" dy="1.6" stdDeviation="1.4" floodColor="#000" floodOpacity="0.22" />
        </filter>
      </defs>

      <g clipPath={`url(#${ids.clip})`}>
        <rect width={ICON_BOX} height={ICON_BOX} fill={`url(#${ids.bg})`} />
        {children(`url(#${ids.shadow})`)}
        <rect width={ICON_BOX} height={ICON_BOX} fill={`url(#${ids.foot})`} />
        <rect width={ICON_BOX} height={ICON_BOX} fill={`url(#${ids.sheen})`} />
      </g>
      <path
        d={ICON_SQUIRCLE}
        fill="none"
        stroke={`url(#${ids.rim})`}
        strokeWidth="1.6"
        style={{ transform: 'scale(0.987)', transformOrigin: '60px 60px' }}
      />
    </svg>
  )
}
