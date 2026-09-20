import type { SVGProps } from 'react'

export type GlyphName =
  | 'chevron-left'
  | 'chevron-right'
  | 'chevron-down'
  | 'close'
  | 'search'
  | 'apple'
  | 'wifi'
  | 'battery'
  | 'control-center'
  | 'sun'
  | 'moon'
  | 'grid'
  | 'plus'
  | 'minus'
  | 'arrow-up-left'
  | 'check'
  | 'link'
  | 'github'
  | 'mail'
  | 'butterfly'
  | 'ellipsis'
  | 'play'
  | 'reset'
  | 'trophy'
  | 'sparkle'
  | 'signal'
  | 'home'

interface GlyphProps extends SVGProps<SVGSVGElement> {
  name: GlyphName
  size?: number
}

/** Small stroke-based UI glyphs, SF Symbols-ish. Inherit `currentColor`. */
export function Glyph({ name, size = 16, ...rest }: GlyphProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      <GlyphPath name={name} />
    </svg>
  )
}

function GlyphPath({ name }: { name: GlyphName }) {
  switch (name) {
    case 'chevron-left':
      return <path d="M15 5l-7 7 7 7" />
    case 'chevron-right':
      return <path d="M9 5l7 7-7 7" />
    case 'chevron-down':
      return <path d="M5 9l7 7 7-7" />
    case 'close':
      return <path d="M6 6l12 12M18 6L6 18" />
    case 'search':
      return (
        <>
          <circle cx="11" cy="11" r="6.5" />
          <path d="M16 16l4.5 4.5" />
        </>
      )
    case 'apple':
      return (
        <path
          fill="currentColor"
          stroke="none"
          d="M16.6 12.7c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.1-2.8.9-3.5.9-.7 0-1.9-.9-3.1-.8-1.6 0-3.1.9-3.9 2.4-1.7 2.9-.4 7.2 1.2 9.5.8 1.2 1.8 2.5 3 2.4 1.2 0 1.7-.8 3.1-.8 1.5 0 1.9.8 3.2.8 1.3 0 2.1-1.2 2.9-2.3.9-1.3 1.3-2.6 1.3-2.7-.1 0-2.8-1.1-2.8-4.1zM14.4 5.9c.6-.8 1.1-1.9.9-3-.9 0-2 .6-2.7 1.4-.6.7-1.1 1.8-1 2.9 1 .1 2.1-.5 2.8-1.3z"
        />
      )
    case 'wifi':
      return (
        <>
          <path d="M2.5 9.5a14 14 0 0 1 19 0" />
          <path d="M6 13a9 9 0 0 1 12 0" />
          <path d="M9.5 16.5a4 4 0 0 1 5 0" />
          <circle cx="12" cy="19.5" r="1" fill="currentColor" stroke="none" />
        </>
      )
    case 'battery':
      return (
        <>
          <rect x="2.5" y="7.5" width="17" height="9" rx="2.5" />
          <path d="M21.5 10.5v3" />
          <rect x="4.5" y="9.5" width="11" height="5" rx="1" fill="currentColor" stroke="none" />
        </>
      )
    case 'control-center':
      return (
        <>
          <rect x="3" y="5" width="18" height="6" rx="3" />
          <rect x="3" y="13" width="18" height="6" rx="3" />
          <circle cx="7" cy="8" r="1.6" fill="currentColor" stroke="none" />
          <circle cx="17" cy="16" r="1.6" fill="currentColor" stroke="none" />
        </>
      )
    case 'sun':
      return (
        <>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8" />
        </>
      )
    case 'moon':
      return <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" />
    case 'grid':
      return (
        <>
          <rect x="4" y="4" width="6.5" height="6.5" rx="2" />
          <rect x="13.5" y="4" width="6.5" height="6.5" rx="2" />
          <rect x="4" y="13.5" width="6.5" height="6.5" rx="2" />
          <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="2" />
        </>
      )
    case 'plus':
      return <path d="M12 5v14M5 12h14" />
    case 'minus':
      return <path d="M5 12h14" />
    case 'arrow-up-left':
      return <path d="M17 17L7 7M7 15V7h8" />
    case 'check':
      return <path d="M5 12.5l4.5 4.5L19 7" />
    case 'link':
      return (
        <>
          <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" />
          <path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />
        </>
      )
    case 'github':
      return (
        <path
          fill="currentColor"
          stroke="none"
          d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.8c-2.8.6-3.4-1.2-3.4-1.2-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.6 2.4 1.1 3 .9.1-.7.4-1.1.6-1.4-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.8 1a9.5 9.5 0 0 1 5 0c1.9-1.3 2.8-1 2.8-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.4 4.7-4.6 5 .4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5A10 10 0 0 0 12 2z"
        />
      )
    case 'mail':
      return (
        <>
          <rect x="3" y="5.5" width="18" height="13" rx="3" />
          <path d="M3.5 7.5L12 13l8.5-5.5" />
        </>
      )
    case 'butterfly':
      return (
        <path d="M12 9c-2-4-6-6-8-4s0 8 5 9c-3 1-3 5-1 5s3-3 4-5c1 2 2 5 4 5s2-4-1-5c5-1 7-7 5-9s-6 0-8 4z" />
      )
    case 'ellipsis':
      return (
        <>
          <circle cx="6" cy="12" r="1.6" fill="currentColor" stroke="none" />
          <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" />
          <circle cx="18" cy="12" r="1.6" fill="currentColor" stroke="none" />
        </>
      )
    case 'play':
      return <path d="M7 5.5v13l11-6.5z" fill="currentColor" stroke="none" />
    case 'reset':
      return (
        <>
          <path d="M4 12a8 8 0 1 0 2.3-5.7" />
          <path d="M4 4v5h5" />
        </>
      )
    case 'trophy':
      return (
        <>
          <path d="M8 4h8v5a4 4 0 0 1-8 0V4z" />
          <path d="M8 6H5.5c0 3 1.5 4.5 3.5 4.8M16 6h2.5c0 3-1.5 4.5-3.5 4.8" />
          <path d="M12 13v4M9 20h6" />
        </>
      )
    case 'sparkle':
      return <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" />
    case 'signal':
      return (
        <>
          <path d="M4 18v-2" />
          <path d="M8.5 18v-5" />
          <path d="M13 18v-8" />
          <path d="M17.5 18V7" />
        </>
      )
    case 'home':
      return <path d="M4 11l8-7 8 7v9a1 1 0 0 1-1 1h-5v-6h-4v6H5a1 1 0 0 1-1-1z" />
    default: {
      const exhaustive: never = name
      return exhaustive
    }
  }
}
