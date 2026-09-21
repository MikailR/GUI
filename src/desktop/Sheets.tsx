import { useRef } from 'react'
import { Button, Kbd } from '../components/controls'
import { Symbol } from '../icons/Symbol'
import { useClickOutside, useEscape } from '../os/hooks'

interface SheetProps {
  onClose: () => void
}

/** "About This Mac"-style panel. */
export function AboutMacSheet({ onClose }: SheetProps) {
  const ref = useRef<HTMLDivElement | null>(null)
  useEscape(true, onClose)
  useClickOutside(ref, true, onClose)
  return (
    <div className="sheet-backdrop">
      <div ref={ref} className="sheet glass glass-thick about-mac" role="dialog" aria-label="About This Mac">
        <div className="about-mac-mark">
          <Symbol name="os.mark" size={64} />
        </div>
        <h2>Mikail OS</h2>
        <p className="about-mac-version">Liquid Glass v2 · build 2026.09</p>
        <dl className="about-mac-specs">
          <dt>Chip</dt>
          <dd>React 19 · TypeScript 5.9</dd>
          <dt>Renderer</dt>
          <dd>Vite 8 · zero UI dependencies</dd>
          <dt>Material</dt>
          <dd>backdrop-filter, masked specular rims, linear() springs</dd>
          <dt>Phone</dt>
          <dd>Turns into iOS below 820px</dd>
        </dl>
        <div className="sheet-actions">
          <Button variant="tinted" onClick={() => window.open('https://github.com/MikailR/GUI', '_blank', 'noopener')}>
            Source…
          </Button>
          <Button variant="filled" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </div>
  )
}

const SHORTCUTS: [string, string][] = [
  ['⌘K / Ctrl K', 'Search'],
  ['⌥1 – ⌥7', 'Open apps'],
  ['⌥W', 'Close window'],
  ['⌥M', 'Minimize window'],
  ['⌥↩', 'Zoom window'],
  ['⌥`', 'Cycle windows'],
  ['⌥T', 'Tile windows'],
  ['⌥G', 'Bring all to center'],
  ['⌥D', 'Show desktop'],
  ['⌥,', 'Settings'],
  ['Esc', 'Close focused window / dismiss'],
  ['?', 'This sheet'],
]

export function ShortcutsSheet({ onClose }: SheetProps) {
  const ref = useRef<HTMLDivElement | null>(null)
  useEscape(true, onClose)
  useClickOutside(ref, true, onClose)
  return (
    <div className="sheet-backdrop">
      <div ref={ref} className="sheet glass glass-thick shortcuts" role="dialog" aria-label="Keyboard shortcuts">
        <h2>Keyboard Shortcuts</h2>
        <p className="sheet-sub">Option-based so nothing fights the browser.</p>
        <ul className="shortcuts-list">
          {SHORTCUTS.map(([keys, what]) => (
            <li key={keys}>
              <span>{what}</span>
              <span className="shortcuts-keys">
                {keys.split(' / ').map((combo) => (
                  <Kbd key={combo}>{combo}</Kbd>
                ))}
              </span>
            </li>
          ))}
        </ul>
        <div className="sheet-actions">
          <Button variant="filled" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </div>
  )
}
