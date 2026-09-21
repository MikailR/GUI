import { useRef, type PointerEvent } from 'react'
import { AppIcon } from '../icons/AppIcon'
import { Symbol } from '../icons/Symbol'
import { HACKATHONS, POSTS } from '../content/data'
import { useClock } from '../os/hooks'

interface LockScreenProps {
  onUnlock: () => void
}

/** iOS Lock Screen: thin large clock, glass notifications, swipe up to open. */
export function LockScreen({ onUnlock }: LockScreenProps) {
  const now = useClock()
  const start = useRef<number | null>(null)
  const time = now.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }).replace(/\s?[AP]M$/i, '')
  const date = now.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })

  const onDown = (event: PointerEvent<HTMLDivElement>) => {
    start.current = event.clientY
  }
  const onUp = (event: PointerEvent<HTMLDivElement>) => {
    if (start.current !== null && start.current - event.clientY > 40) onUnlock()
    start.current = null
  }

  return (
    <div className="ios-lock" onPointerDown={onDown} onPointerUp={onUp} onPointerCancel={() => (start.current = null)}>
      <div className="ios-lock-top">
        <Symbol name="lock" size={18} className="ios-lock-glyph" />
        <div className="ios-lock-date">{date}</div>
        <div className="ios-lock-time tnum">{time}</div>
      </div>

      <div className="ios-lock-stack">
        <div className="ios-lock-notif glass glass-thin">
          <AppIcon appId="hackathons" size={38} />
          <div>
            <strong>Hackathons</strong>
            <span>
              {HACKATHONS[0].project} — {HACKATHONS[0].place} at {HACKATHONS[0].event}
            </span>
          </div>
          <small>now</small>
        </div>
        <div className="ios-lock-notif glass glass-thin">
          <AppIcon appId="writing" size={38} />
          <div>
            <strong>Writing</strong>
            <span>New essay: {POSTS[0].title}</span>
          </div>
          <small>2h ago</small>
        </div>
      </div>

      <div className="ios-lock-bottom">
        <span className="ios-lock-quick glass glass-thin" aria-hidden="true">
          <Symbol name="sun" size={20} />
        </span>
        <span className="ios-lock-quick glass glass-thin" aria-hidden="true">
          <Symbol name="photo" size={20} />
        </span>
      </div>

      <button type="button" className="ios-lock-hint" onClick={onUnlock}>
        <Symbol name="chevron.up" size={14} weight={2.6} />
        Swipe up to open
      </button>
      <span className="ios-home-indicator" aria-hidden="true" />
    </div>
  )
}
