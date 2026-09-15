import { Suspense, useEffect, useRef, useState } from 'react'
import { useOS } from '../os/store'
import { APPS, MOBILE_DOCK, MOBILE_HOME } from '../os/apps'
import { useClock } from '../os/hooks'
import type { Win } from '../os/types'
import { AppIcon, Ico } from './Icons'
import { Wallpaper } from './Wallpaper'
import { Toasts } from './Toasts'

function Sheet({ win, top }: { win: Win; top: boolean }) {
  const os = useOS()
  const def = APPS[win.app]
  const App = def.component
  const ref = useRef<HTMLDivElement>(null)
  const [drag, setDrag] = useState<'idle' | 'dragging' | 'settling'>('idle')

  useEffect(() => {
    if (win.phase === 'opening') {
      const t = window.setTimeout(() => os.opened(win.id), 380)
      return () => window.clearTimeout(t)
    }
    if (win.phase === 'closing') {
      const t = window.setTimeout(() => os.remove(win.id), 270)
      return () => window.clearTimeout(t)
    }
    if (win.phase === 'minimizing') {
      const t = window.setTimeout(() => os.minimized(win.id), 270)
      return () => window.clearTimeout(t)
    }
  }, [win.phase, win.id, os])

  // swipe down on the header to dismiss
  const onDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button')) return
    const el = ref.current!
    const head = e.currentTarget
    head.setPointerCapture(e.pointerId)
    const sy = e.clientY
    let dy = 0
    setDrag('dragging')
    const move = (ev: PointerEvent) => {
      dy = Math.max(0, ev.clientY - sy)
      el.style.transform = `translateY(${dy}px)`
    }
    const up = () => {
      head.removeEventListener('pointermove', move)
      head.removeEventListener('pointerup', up)
      head.removeEventListener('pointercancel', up)
      if (dy > 110) {
        el.style.transform = ''
        setDrag('idle')
        os.close(win.id)
      } else {
        setDrag('settling')
        el.style.transform = ''
        window.setTimeout(() => setDrag('idle'), 300)
      }
    }
    head.addEventListener('pointermove', move)
    head.addEventListener('pointerup', up)
    head.addEventListener('pointercancel', up)
  }

  return (
    <div
      ref={ref}
      className={`sheet ${win.phase} ${drag}`}
      style={{ zIndex: win.z, display: win.minimized ? 'none' : undefined, visibility: top || win.phase !== 'open' ? 'visible' : 'hidden' }}
      role="dialog"
      aria-label={def.title}
    >
      <div className="sheet-head" onPointerDown={onDown}>
        <div className="grab" />
        <div className="row">
          <div className="title">
            <AppIcon id={win.app} size={24} />
            {def.title}
          </div>
          <button className="ib" onClick={() => os.minimize(win.id)} aria-label="Minimize"><Ico.Chevron /></button>
          <button className="ib" onClick={() => os.close(win.id)} aria-label="Close"><Ico.Close /></button>
        </div>
      </div>
      <div className="sheet-body">
        <Suspense fallback={<div className="empty">Loading…</div>}>
          <App windowId={win.id} payload={win.payload} />
        </Suspense>
      </div>
    </div>
  )
}

export function MobileShell() {
  const os = useOS()
  const now = useClock(1000)
  const running = new Set(os.state.windows.map((w) => w.app))
  const top = os.focused

  return (
    <div className="mobile">
      <Wallpaper kind={os.state.wallpaper} theme={os.state.theme} animate={!os.state.reduceMotion} />
      <div className="m-status">
        <span>{now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</span>
        <span className="r">
          <Ico.Wifi />
          <Ico.Battery pct={0.82} />
        </span>
      </div>
      <div className="m-home">
        <div className="m-clock">
          <div className="big">{now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</div>
          <div className="small">{now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
        </div>
        <div className="m-grid">
          {MOBILE_HOME.map((id) => (
            <button key={id} className="m-icon" onClick={() => os.open(id)}>
              <AppIcon id={id} size={60} />
              <span className="label">{APPS[id].desktopLabel ?? APPS[id].title}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="m-dock">
        {MOBILE_DOCK.map((id) => (
          <button key={id} className={`m-icon ${running.has(id) ? 'running' : ''}`} onClick={() => os.open(id)}>
            <AppIcon id={id} size={56} />
            <span className="dot" />
          </button>
        ))}
      </div>
      {os.state.windows.map((w) => (
        <Sheet key={w.id} win={w} top={top?.id === w.id} />
      ))}
      {top && <button className="m-home-bar" onClick={() => os.minimizeAll()} aria-label="Home" />}
      <Toasts />
    </div>
  )
}
