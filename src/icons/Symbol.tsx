import type { CSSProperties, ReactNode } from 'react'

/**
 * SF-Symbols-flavoured UI glyphs: 24-unit grid, round caps, medium/semibold
 * stroke weight, filled where the system would fill. Original drawings.
 */

export type SymbolName =
  | 'chevron.left'
  | 'chevron.right'
  | 'chevron.down'
  | 'chevron.up'
  | 'magnifyingglass'
  | 'xmark'
  | 'checkmark'
  | 'plus'
  | 'minus'
  | 'ellipsis'
  | 'wifi'
  | 'battery'
  | 'cellular'
  | 'bluetooth'
  | 'airdrop'
  | 'sun'
  | 'moon'
  | 'gear'
  | 'switches'
  | 'person'
  | 'doc'
  | 'trash'
  | 'sparkles'
  | 'sidebar'
  | 'grid'
  | 'speaker'
  | 'lock'
  | 'undo'
  | 'star'
  | 'play'
  | 'pause'
  | 'link'
  | 'display'
  | 'keyboard'
  | 'info'
  | 'paintbrush'
  | 'accessibility'
  | 'photo'
  | 'clock'
  | 'location'
  | 'flask'
  | 'trophy'
  | 'book'
  | 'command'
  | 'arrow.up'
  | 'square.stack'
  | 'circle.lefthalf'
  | 'hand.tap'
  | 'envelope'
  | 'os.mark'

interface SymbolProps {
  name: SymbolName
  size?: number
  /** Stroke weight; 2 ≈ regular, 2.4 ≈ semibold, 2.8 ≈ bold. */
  weight?: number
  className?: string
  style?: CSSProperties
  title?: string
}

export function Symbol({ name, size = 18, weight = 2.2, className, style, title }: SymbolProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={weight}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      aria-hidden={title ? undefined : 'true'}
      role={title ? 'img' : undefined}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      {glyph(name)}
    </svg>
  )
}

function glyph(name: SymbolName): ReactNode {
  switch (name) {
    case 'chevron.left':
      return <path d="M14.5 5.5L8 12l6.5 6.5" />
    case 'chevron.right':
      return <path d="M9.5 5.5L16 12l-6.5 6.5" />
    case 'chevron.down':
      return <path d="M5.5 9.5L12 16l6.5-6.5" />
    case 'chevron.up':
      return <path d="M5.5 14.5L12 8l6.5 6.5" />
    case 'magnifyingglass':
      return (
        <>
          <circle cx="10.5" cy="10.5" r="6" />
          <path d="M15 15l5 5" />
        </>
      )
    case 'xmark':
      return <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" />
    case 'checkmark':
      return <path d="M5 12.5l4.5 4.5L19 7.5" />
    case 'plus':
      return <path d="M12 5v14M5 12h14" />
    case 'minus':
      return <path d="M5 12h14" />
    case 'ellipsis':
      return (
        <g fill="currentColor" stroke="none">
          <circle cx="6" cy="12" r="1.7" />
          <circle cx="12" cy="12" r="1.7" />
          <circle cx="18" cy="12" r="1.7" />
        </g>
      )
    case 'wifi':
      return (
        <>
          <path d="M2.5 9.2C8 3.9 16 3.9 21.5 9.2" />
          <path d="M5.8 12.6c3.5-3.3 8.9-3.3 12.4 0" />
          <path d="M9.1 16c1.6-1.5 4.2-1.5 5.8 0" />
          <circle cx="12" cy="19.2" r="1.3" fill="currentColor" stroke="none" />
        </>
      )
    case 'battery':
      return (
        <>
          <rect x="2.5" y="7.5" width="17" height="9" rx="2.6" />
          <path d="M21.5 10.5v3" strokeWidth="2.4" />
          <rect x="4.3" y="9.3" width="11.4" height="5.4" rx="1.2" fill="currentColor" stroke="none" />
        </>
      )
    case 'cellular':
      return (
        <g fill="currentColor" stroke="none">
          <rect x="3" y="15" width="3" height="5" rx="0.8" />
          <rect x="8" y="12" width="3" height="8" rx="0.8" />
          <rect x="13" y="8.5" width="3" height="11.5" rx="0.8" />
          <rect x="18" y="5" width="3" height="15" rx="0.8" />
        </g>
      )
    case 'bluetooth':
      return <path d="M7 8l10 8-5 4V4l5 4L7 16" />
    case 'airdrop':
      return (
        <>
          <path d="M12 3.5c-4.7 0-8.5 3.8-8.5 8.5 0 2.9 1.4 5.4 3.6 7" />
          <path d="M12 3.5c4.7 0 8.5 3.8 8.5 8.5 0 2.9-1.4 5.4-3.6 7" />
          <path d="M12 7.5c-2.5 0-4.5 2-4.5 4.5 0 1.5.8 2.9 1.9 3.7" />
          <path d="M12 7.5c2.5 0 4.5 2 4.5 4.5 0 1.5-.8 2.9-1.9 3.7" />
          <path d="M12 12l3.5 8.5h-7z" fill="currentColor" />
        </>
      )
    case 'sun':
      return (
        <>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2.8v2.4M12 18.8v2.4M2.8 12h2.4M18.8 12h2.4M5.5 5.5l1.7 1.7M16.8 16.8l1.7 1.7M5.5 18.5l1.7-1.7M16.8 7.2l1.7-1.7" />
        </>
      )
    case 'moon':
      return <path d="M14.5 3.5a8.5 8.5 0 1 0 6 14.4A9 9 0 0 1 14.5 3.5z" fill="currentColor" />
    case 'gear':
      return (
        <>
          <circle cx="12" cy="12" r="3.2" />
          <path d="M12 2.8l1.6 2.6 3-.6.6 3 2.6 1.6-1.4 2.6 1.4 2.6-2.6 1.6-.6 3-3-.6L12 21.2l-1.6-2.6-3 .6-.6-3-2.6-1.6L5.6 12 4.2 9.4 6.8 7.8l.6-3 3 .6z" />
        </>
      )
    case 'switches':
      return (
        <>
          <rect x="3" y="4.5" width="18" height="6.5" rx="3.25" />
          <circle cx="15.5" cy="7.75" r="2.2" fill="currentColor" stroke="none" />
          <rect x="3" y="13" width="18" height="6.5" rx="3.25" />
          <circle cx="8.5" cy="16.25" r="2.2" fill="currentColor" stroke="none" />
        </>
      )
    case 'person':
      return (
        <>
          <circle cx="12" cy="8" r="4" />
          <path d="M4.5 20.5c.8-4 3.9-6.5 7.5-6.5s6.7 2.5 7.5 6.5" />
        </>
      )
    case 'doc':
      return (
        <>
          <path d="M7 3.5h6.5L18.5 8.5v11a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-15a1 1 0 0 1 1-1z" />
          <path d="M13.5 3.5v5h5" />
        </>
      )
    case 'trash':
      return (
        <>
          <path d="M4.5 7h15M9.5 7V4.5h5V7" />
          <path d="M6.5 7l1 12.5h9l1-12.5" />
          <path d="M10 11v6M14 11v6" />
        </>
      )
    case 'sparkles':
      return (
        <g fill="currentColor" stroke="none">
          <path d="M10 3l1.9 5.1L17 10l-5.1 1.9L10 17l-1.9-5.1L3 10l5.1-1.9z" />
          <path d="M18 14l1 2.5 2.5 1-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1z" />
        </g>
      )
    case 'sidebar':
      return (
        <>
          <rect x="3" y="5" width="18" height="14" rx="3" />
          <path d="M9.5 5v14" />
        </>
      )
    case 'grid':
      return (
        <g fill="currentColor" stroke="none">
          <rect x="4" y="4" width="7" height="7" rx="2" />
          <rect x="13" y="4" width="7" height="7" rx="2" />
          <rect x="4" y="13" width="7" height="7" rx="2" />
          <rect x="13" y="13" width="7" height="7" rx="2" />
        </g>
      )
    case 'speaker':
      return (
        <>
          <path d="M4 9.5v5h3.2L12 18.5v-13L7.2 9.5z" fill="currentColor" />
          <path d="M15.5 9a4.2 4.2 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11" />
        </>
      )
    case 'lock':
      return (
        <>
          <rect x="5.5" y="10.5" width="13" height="10" rx="2.5" fill="currentColor" />
          <path d="M8 10.5V7.8a4 4 0 0 1 8 0v2.7" />
        </>
      )
    case 'undo':
      return (
        <>
          <path d="M8.5 6.5L4.5 10l4 3.5" />
          <path d="M4.5 10h9a5 5 0 0 1 0 10H9" />
        </>
      )
    case 'star':
      return <path d="M12 3.5l2.7 5.6 6 .8-4.4 4.2 1.1 6-5.4-2.9-5.4 2.9 1.1-6L3.3 9.9l6-.8z" fill="currentColor" />
    case 'play':
      return <path d="M7 4.8v14.4L19 12z" fill="currentColor" />
    case 'pause':
      return (
        <g fill="currentColor" stroke="none">
          <rect x="6" y="5" width="4" height="14" rx="1.2" />
          <rect x="14" y="5" width="4" height="14" rx="1.2" />
        </g>
      )
    case 'link':
      return (
        <>
          <path d="M13.5 6.5l2-2a3.9 3.9 0 0 1 5.5 5.5l-3 3a3.9 3.9 0 0 1-5.5 0" />
          <path d="M10.5 17.5l-2 2A3.9 3.9 0 0 1 3 14l3-3a3.9 3.9 0 0 1 5.5 0" />
        </>
      )
    case 'display':
      return (
        <>
          <rect x="3" y="4.5" width="18" height="12" rx="2.5" />
          <path d="M9 20h6M12 16.5V20" />
        </>
      )
    case 'keyboard':
      return (
        <>
          <rect x="3" y="6" width="18" height="12" rx="2.5" />
          <path d="M7 10h.01M11 10h.01M15 10h.01M7 14h10" />
        </>
      )
    case 'info':
      return (
        <>
          <circle cx="12" cy="12" r="8.5" />
          <path d="M12 11v5.5M12 7.5h.01" />
        </>
      )
    case 'paintbrush':
      return (
        <>
          <path d="M19.5 4.5c-3 .5-7.5 5-9.5 8l2 2c3-2 7.5-6.5 8-9.5z" fill="currentColor" />
          <path d="M9.5 13.5c-2.5 0-4 1.5-4 4 0 1.5-1 2.5-2.5 2.5 3.5 1 7-.5 7.5-4z" />
        </>
      )
    case 'accessibility':
      return (
        <>
          <circle cx="12" cy="12" r="8.5" />
          <circle cx="12" cy="8" r="1.4" fill="currentColor" stroke="none" />
          <path d="M8 11l4 .8 4-.8M12 11.8V15l-1.5 3.2M12 15l1.5 3.2" />
        </>
      )
    case 'photo':
      return (
        <>
          <rect x="3.5" y="5" width="17" height="14" rx="2.5" />
          <circle cx="9" cy="10" r="1.6" fill="currentColor" stroke="none" />
          <path d="M4 17l4.5-4.5 3 3 3.5-3.5L20 17" />
        </>
      )
    case 'clock':
      return (
        <>
          <circle cx="12" cy="12" r="8.5" />
          <path d="M12 7v5l3.5 2" />
        </>
      )
    case 'location':
      return <path d="M20 4L4 11l8 1.5L13.5 20z" fill="currentColor" />
    case 'flask':
      return (
        <>
          <path d="M9 3.5h6M10 3.5v6L4.8 18.6c-.6 1.1.2 2.4 1.4 2.4h11.6c1.2 0 2-1.3 1.4-2.4L14 9.5v-6" />
          <path d="M7.5 15h9" />
        </>
      )
    case 'trophy':
      return (
        <>
          <path d="M7 4.5h10v5a5 5 0 0 1-10 0z" />
          <path d="M7 6.5H4.5c0 3 1.5 4.5 3.5 5M17 6.5h2.5c0 3-1.5 4.5-3.5 5" />
          <path d="M12 14.5v3M8.5 20h7" />
        </>
      )
    case 'book':
      return (
        <>
          <path d="M12 6.5c-2-1.5-4.5-2-8-2v13c3.5 0 6 .5 8 2 2-1.5 4.5-2 8-2v-13c-3.5 0-6 .5-8 2z" />
          <path d="M12 6.5v13" />
        </>
      )
    case 'command':
      return (
        <path d="M9 9V6.5a2.5 2.5 0 1 0-2.5 2.5H9zm0 0h6m-6 0v6m6-6V6.5A2.5 2.5 0 1 1 17.5 9H15zm0 6h2.5a2.5 2.5 0 1 1-2.5 2.5V15zm0 0H9m0 0H6.5A2.5 2.5 0 1 0 9 17.5V15z" />
      )
    case 'arrow.up':
      return <path d="M12 19.5V5M5.5 11.5L12 5l6.5 6.5" />
    case 'square.stack':
      return (
        <>
          <rect x="6" y="8" width="14" height="12" rx="2.5" />
          <path d="M4 15V6.5A2.5 2.5 0 0 1 6.5 4H15" />
        </>
      )
    case 'circle.lefthalf':
      return (
        <>
          <circle cx="12" cy="12" r="8.5" />
          <path d="M12 3.5a8.5 8.5 0 0 0 0 17z" fill="currentColor" stroke="none" />
        </>
      )
    case 'hand.tap':
      return (
        <>
          <path d="M9 12V5.5a1.8 1.8 0 0 1 3.6 0V11" />
          <path d="M12.6 11v-1a1.8 1.8 0 0 1 3.6 0v2a1.8 1.8 0 0 1 3.6 0v3.5c0 3-2 5-5 5h-2.4c-1.5 0-2.6-.6-3.4-1.6L5.6 15a1.6 1.6 0 0 1 2.4-2l1 1.2" />
        </>
      )
    case 'envelope':
      return (
        <>
          <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
          <path d="M3.5 7l8.5 6 8.5-6" />
        </>
      )
    case 'os.mark':
      return (
        <g fill="currentColor" stroke="none">
          <path d="M12 2.6c6.4 0 9.4 3 9.4 9.4s-3 9.4-9.4 9.4-9.4-3-9.4-9.4S5.6 2.6 12 2.6zm0 4.2c-3.6 0-5.2 1.6-5.2 5.2s1.6 5.2 5.2 5.2 5.2-1.6 5.2-5.2S15.6 6.8 12 6.8z" />
          <circle cx="8.2" cy="7.6" r="1.6" opacity="0.5" />
        </g>
      )
    default: {
      const exhaustive: never = name
      return exhaustive
    }
  }
}
