import { useEffect } from 'react'
import { AppIcon } from '../icons/AppIcon'
import { APP_LIST } from '../os/apps'
import { SHORTCUTS, type DesktopSheet } from './menus'

interface SheetProps {
  sheet: DesktopSheet | null
  onClose: () => void
}

/** Centered modal glass panels: "About This Mac" and the keyboard shortcut reference. */
export function DesktopSheets({ sheet, onClose }: SheetProps) {
  useEffect(() => {
    if (!sheet) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose()
      }
    }
    document.addEventListener('keydown', onKey, true)
    return () => document.removeEventListener('keydown', onKey, true)
  }, [sheet, onClose])

  if (!sheet) return null

  return (
    <div className="sheet-backdrop" onPointerDown={onClose}>
      <div className="glass glass--thick sheet" role="dialog" aria-modal="true" onPointerDown={(e) => e.stopPropagation()}>
        {sheet === 'about-mac' ? <AboutMac /> : <Shortcuts />}
        <button type="button" className="glass-btn sheet__close" onClick={onClose}>
          Done
        </button>
      </div>
    </div>
  )
}

function AboutMac() {
  return (
    <div className="about-mac">
      <div className="about-mac__orb" aria-hidden="true">
        <AppIcon appId="about" size={72} />
      </div>
      <h2 className="about-mac__title">Mikail OS</h2>
      <p className="about-mac__version">Version 26 · Liquid Glass</p>
      <dl className="about-mac__specs">
        <dt>Chip</dt>
        <dd>React 19 on Vite 8</dd>
        <dt>Memory</dt>
        <dd>One reducer, no libraries</dd>
        <dt>Display</dt>
        <dd>Whatever you are holding</dd>
        <dt>Materials</dt>
        <dd>backdrop-filter, mask-composite, linear() springs</dd>
        <dt>Mobile</dt>
        <dd>Becomes iOS at ≤ 820px</dd>
      </dl>
    </div>
  )
}

function Shortcuts() {
  const rows: [string, string][] = [
    [SHORTCUTS.close, 'Close focused window (or dismiss)'],
    [SHORTCUTS.closeAlt, 'Close focused window'],
    [SHORTCUTS.minimize, 'Minimize focused window'],
    [SHORTCUTS.zoom, 'Zoom / restore focused window'],
    [SHORTCUTS.cycle, 'Cycle through windows'],
    [SHORTCUTS.tile, 'Tile all windows'],
    [SHORTCUTS.gather, 'Gather windows to centre'],
    [SHORTCUTS.showDesktop, 'Show desktop (minimize all)'],
    [SHORTCUTS.spotlight, 'Spotlight search'],
    [SHORTCUTS.settings, 'Open Settings'],
    [SHORTCUTS.help, 'This sheet'],
  ]
  return (
    <div className="shortcuts">
      <h2 className="sheet__title">Keyboard Shortcuts</h2>
      <p className="sheet__sub">Option-based chords so nothing fights your browser.</p>
      <div className="shortcuts__grid">
        {rows.map(([keys, label]) => (
          <div key={keys} className="shortcuts__row">
            <kbd>{keys}</kbd>
            <span>{label}</span>
          </div>
        ))}
        {APP_LIST.filter((a) => a.shortcutDigit).map((app) => (
          <div key={app.id} className="shortcuts__row">
            <kbd>⌥{app.shortcutDigit}</kbd>
            <span>Open {app.title}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
