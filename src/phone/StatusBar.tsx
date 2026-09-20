import { Glyph } from '../icons/Glyph'
import { useClock } from '../os/hooks'

/**
 * iOS status bar: time on the left, cellular / Wi-Fi / battery on the right.
 * `light` = white glyphs over wallpaper; `auto-app` = follows the app surface's ink colour.
 */
export function StatusBar({ tone = 'light' }: { tone?: 'light' | 'auto-app' }) {
  const now = useClock()
  const time = now.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
  return (
    <div className={`statusbar statusbar--${tone}`} aria-hidden="true">
      <span className="statusbar__time">{time}</span>
      <span className="statusbar__right">
        <Glyph name="signal" size={16} strokeWidth={2.6} />
        <Glyph name="wifi" size={16} strokeWidth={2.2} />
        <Glyph name="battery" size={24} />
      </span>
    </div>
  )
}
