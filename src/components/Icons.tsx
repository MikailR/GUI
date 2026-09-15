import type { AppId } from '../os/types'

/* Hand-drawn squircle app icons. Each is a gradient tile with a single glyph. */

const TILE: Record<AppId, { from: string; to: string }> = {
  about: { from: '#ff9a62', to: '#ff4d7d' },
  hackathons: { from: '#ffd166', to: '#ef8f0e' },
  writing: { from: '#f6f2ea', to: '#cfc6b5' },
  lab: { from: '#7ef0c8', to: '#0fa17c' },
  papers: { from: '#9bb7ff', to: '#4b64e8' },
  trash: { from: '#c9ccd6', to: '#7d8190' },
  terminal: { from: '#3a3d47', to: '#15161c' },
  settings: { from: '#a4a8b3', to: '#5a5e6b' },
  readme: { from: '#fff', to: '#e6e6e8' },
  sysinfo: { from: '#d5b3ff', to: '#7c4dff' },
}

function Glyph({ id }: { id: AppId }) {
  const s = { fill: 'none', stroke: '#fff', strokeWidth: 2.2, strokeLinecap: 'round', strokeLinejoin: 'round' } as const
  switch (id) {
    case 'about':
      return (
        <g {...s}>
          <circle cx="32" cy="24" r="8" />
          <path d="M16 50c2-9 8-13 16-13s14 4 16 13" />
        </g>
      )
    case 'hackathons':
      return (
        <g {...s} stroke="#3a2500">
          <path d="M20 14h24v10a12 12 0 0 1-24 0z" />
          <path d="M20 18h-6v4a6 6 0 0 0 6 6M44 18h6v4a6 6 0 0 1-6 6" />
          <path d="M32 36v8M24 50h16" />
        </g>
      )
    case 'writing':
      return (
        <g {...s} stroke="#2b2620">
          <path d="M18 46l3-11L40 16l8 8-19 19z" />
          <path d="M37 19l8 8M21 35l8 8" />
        </g>
      )
    case 'lab':
      return (
        <g {...s} stroke="#04352a">
          <path d="M26 12h12M28 12v14L16 46a4 4 0 0 0 4 6h24a4 4 0 0 0 4-6L36 26V12" />
          <path d="M22 40h20" />
        </g>
      )
    case 'papers':
      return (
        <g {...s}>
          <path d="M20 12h16l8 8v32H20z" />
          <path d="M36 12v8h8M26 30h12M26 38h12M26 46h8" />
        </g>
      )
    case 'trash':
      return (
        <g {...s} stroke="#2a2c33">
          <path d="M18 20h28M26 20v-4h12v4M22 20l2 30h16l2-30" />
          <path d="M29 27v16M35 27v16" />
        </g>
      )
    case 'terminal':
      return (
        <g {...s} stroke="#b8ffb0">
          <path d="M18 22l10 10-10 10M32 42h14" />
        </g>
      )
    case 'settings':
      return (
        <g {...s} stroke="#1e2028">
          <circle cx="32" cy="32" r="7" />
          <path d="M32 12v6M32 46v6M12 32h6M46 32h6M18 18l4 4M42 42l4 4M18 46l4-4M42 22l4-4" />
        </g>
      )
    case 'readme':
      return (
        <g {...s} stroke="#3b3b40" strokeWidth={2}>
          <path d="M18 18h28M18 26h28M18 34h20M18 42h24" />
        </g>
      )
    case 'sysinfo':
      return (
        <g {...s}>
          <circle cx="32" cy="32" r="16" />
          <path d="M32 28v12M32 22v1" />
        </g>
      )
  }
}

export function AppIcon({ id, size = 48, className }: { id: AppId; size?: number; className?: string }) {
  const t = TILE[id]
  const gid = `g-${id}`
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" style={{ display: 'block', flex: 'none' }}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0" stopColor={t.from} />
          <stop offset="1" stopColor={t.to} />
        </linearGradient>
        <linearGradient id={`${gid}-sheen`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.28" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M20 2h24c10 0 18 8 18 18v24c0 10-8 18-18 18H20C10 62 2 54 2 44V20C2 10 10 2 20 2z" fill={`url(#${gid})`} />
      <path d="M20 2h24c10 0 18 8 18 18v24c0 10-8 18-18 18H20C10 62 2 54 2 44V20C2 10 10 2 20 2z" fill={`url(#${gid}-sheen)`} />
      <path d="M20 2h24c10 0 18 8 18 18v24c0 10-8 18-18 18H20C10 62 2 54 2 44V20C2 10 10 2 20 2z" fill="none" stroke="rgba(0,0,0,0.25)" strokeWidth="1" />
      <Glyph id={id} />
    </svg>
  )
}

/* Tiny UI glyphs for chrome */
export const Ico = {
  Search: (p: { size?: number }) => (
    <svg width={p.size ?? 18} height={p.size ?? 18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </svg>
  ),
  Wifi: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M2 9a16 16 0 0 1 20 0M5.5 13a11 11 0 0 1 13 0M9 17a5 5 0 0 1 6 0" />
      <circle cx="12" cy="20" r="1" fill="currentColor" />
    </svg>
  ),
  Battery: ({ pct }: { pct: number }) => (
    <svg width="24" height="14" viewBox="0 0 28 14" fill="none" stroke="currentColor">
      <rect x="1" y="1" width="23" height="12" rx="3" strokeWidth="1.5" />
      <rect x="3" y="3" width={19 * pct} height="8" rx="1.5" fill="currentColor" stroke="none" />
      <path d="M26 5v4" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  Sun: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  ),
  Moon: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
    </svg>
  ),
  Logo: ({ size = 16 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-label="Mikail OS">
      <path d="M8 52V12h8l16 20 16-20h8v40h-9V28L32 46 17 28v24z" fill="currentColor" />
    </svg>
  ),
  X: () => (
    <svg viewBox="0 0 10 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
      <path d="M2 2l6 6M8 2l-6 6" />
    </svg>
  ),
  Minus: () => (
    <svg viewBox="0 0 10 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
      <path d="M2 5h6" />
    </svg>
  ),
  Expand: () => (
    <svg viewBox="0 0 10 10" fill="currentColor">
      <path d="M2 6.5V8h1.5L2 6.5zM8 3.5V2H6.5L8 3.5z" />
      <path d="M2.3 7.7l5.4-5.4" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  ),
  Chevron: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9l6 6 6-6" />
    </svg>
  ),
  Close: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  ),
}
