import { Symbol } from '../icons/Symbol'
import { useClock } from '../os/hooks'

interface StatusBarProps {
  /** Light text over wallpaper / dark screens; dark text over light app content. */
  tone: 'light' | 'dark'
  island?: boolean
}

/** iOS status bar: time · Dynamic Island · cellular / Wi‑Fi / battery. */
export function StatusBar({ tone, island = true }: StatusBarProps) {
  const now = useClock()
  const time = now.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }).replace(/\s?[AP]M$/i, '')
  return (
    <div className="ios-status" data-tone={tone} aria-hidden="true">
      <span className="ios-status-time tnum">{time}</span>
      {island ? <span className="ios-island-cutout" /> : null}
      <span className="ios-status-right">
        <Symbol name="cellular" size={17} />
        <Symbol name="wifi" size={17} weight={2.4} />
        <Symbol name="battery" size={26} weight={1.8} />
      </span>
    </div>
  )
}
