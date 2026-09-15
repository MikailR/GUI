import type { AppId } from '../apps/registry'
import { APP_BY_ID } from '../apps/registry'
import { useOS } from './store'

/** Glyphs are built from primitives only: lines, circles, rects. */
function Glyph({ id, trashFull }: { id: AppId; trashFull: boolean }) {
  const s = { stroke: 'currentColor', strokeWidth: 2.2, strokeLinecap: 'round' as const, fill: 'none' }
  switch (id) {
    case 'about':
      return (
        <svg viewBox="0 0 24 24">
          <circle cx="12" cy="8" r="4.2" {...s} />
          <path d="M4.5 21c1.2-4.4 4-6.5 7.5-6.5s6.3 2.1 7.5 6.5" {...s} />
        </svg>
      )
    case 'hackathons':
      return (
        <svg viewBox="0 0 24 24">
          <rect x="3" y="12" width="5" height="9" rx="1" fill="currentColor" opacity="0.7" />
          <rect x="9.5" y="5" width="5" height="16" rx="1" fill="currentColor" />
          <rect x="16" y="9" width="5" height="12" rx="1" fill="currentColor" opacity="0.7" />
        </svg>
      )
    case 'writing':
      return (
        <svg viewBox="0 0 24 24">
          <path d="M4 7h16M4 12h16M4 17h9" {...s} />
        </svg>
      )
    case 'lab':
      return (
        <svg viewBox="0 0 24 24">
          <circle cx="7" cy="7" r="2.4" fill="currentColor" />
          <circle cx="17" cy="7" r="2.4" {...s} />
          <circle cx="7" cy="17" r="2.4" {...s} />
          <rect x="13.5" y="13.5" width="7" height="7" rx="1.6" fill="currentColor" />
        </svg>
      )
    case 'papers':
      return (
        <svg viewBox="0 0 24 24">
          <rect x="5" y="3" width="14" height="18" rx="2" {...s} />
          <path d="M9 9h6M9 13h6M9 17h3" {...s} />
        </svg>
      )
    case 'terminal':
      return (
        <svg viewBox="0 0 24 24">
          <path d="M5 7l5 5-5 5M12 18h7" {...s} strokeWidth={2.4} />
        </svg>
      )
    case 'settings':
      return (
        <svg viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="7.5" {...s} strokeDasharray="4 3" />
          <circle cx="12" cy="12" r="3" fill="currentColor" />
        </svg>
      )
    case 'trash':
      return (
        <svg viewBox="0 0 24 24">
          <path d="M5 7h14" {...s} />
          <rect x="7" y="7" width="10" height="13" rx="2" {...s} />
          <path d="M10 4h4" {...s} />
          {trashFull && <path d="M10 11v6M14 11v6" {...s} opacity="0.7" />}
        </svg>
      )
  }
}

export function AppIcon({ id, size, className = '' }: { id: AppId; size?: number; className?: string }) {
  const meta = APP_BY_ID[id]
  const { state } = useOS()
  const style: React.CSSProperties = size ? { width: size, height: size } : {}
  const hue = meta.hue
  return (
    <div
      className={`tile ${hue === null ? 'neutral' : ''} ${className}`}
      style={{ ...style, ...(hue !== null ? ({ '--h': hue } as React.CSSProperties) : {}) }}
      aria-hidden="true"
    >
      <Glyph id={id} trashFull={id === 'trash' && state.trash.length > 0} />
    </div>
  )
}
