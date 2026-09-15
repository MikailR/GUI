import { AnimatePresence, motion, useDragControls, type PanInfo } from 'framer-motion'
import { APPS, APP_BY_ID, type AppId } from '../apps/registry'
import { AppView } from '../apps'
import { useOS, type Win } from './store'
import { Wallpaper } from './Wallpaper'
import { AppIcon } from './AppIcon'
import { Clock } from './Clock'

const TAB: AppId[] = ['about', 'hackathons', 'writing', 'lab']

function Sheet({ win, depth, count }: { win: Win; depth: number; count: number }) {
  const os = useOS()
  const meta = APP_BY_ID[win.id]
  const top = depth === 0
  const controls = useDragControls()
  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.y > 120 || info.velocity.y > 700) os.setHome(true)
  }
  return (
    <motion.div
      className={`m-sheet ${top ? 'top' : ''}`}
      style={{ zIndex: 100 + win.z }}
      initial={{ y: '100%' }}
      animate={{ y: -depth * 14, scale: 1 - depth * 0.04, opacity: depth > 2 ? 0 : 1 }}
      exit={{ y: '110%', transition: { type: 'spring', stiffness: 400, damping: 40 } }}
      transition={{ type: 'spring', stiffness: 380, damping: 36 }}
      drag={top ? 'y' : false}
      dragListener={false}
      dragControls={controls}
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={{ top: 0, bottom: 0.7 }}
      dragSnapToOrigin
      onDragEnd={onDragEnd}
      aria-hidden={!top}
    >
      <SheetHeader win={win} count={count} onGrab={(e) => top && controls.start(e)} />
      <div className="m-body">
        <AppView id={win.id} />
      </div>
      <span className="sr-only">{meta.title}</span>
    </motion.div>
  )
}

function SheetHeader({ win, count, onGrab }: { win: Win; count: number; onGrab: (e: React.PointerEvent) => void }) {
  const os = useOS()
  const meta = APP_BY_ID[win.id]
  return (
    <div className="m-head-wrap" onPointerDown={onGrab} style={{ touchAction: 'none' }}>
      <div className="m-handle" />
      <div className="m-head">
        <button className="m-btn" onClick={() => os.close(win.id)} aria-label="Close" onPointerDown={(e) => e.stopPropagation()}>
          <svg width="12" height="12" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <path d="M2 2l6 6M8 2l-6 6" />
          </svg>
        </button>
        <div className="m-title">
          {meta.title}
          <small>
            {meta.code}.app · {count} open
          </small>
        </div>
        <button className="m-btn" onClick={() => os.setHome(true)} onPointerDown={(e) => e.stopPropagation()}>
          Home
        </button>
      </div>
    </div>
  )
}

function Switcher() {
  const os = useOS()
  const wins = [...os.state.wins].sort((a, b) => b.z - a.z)
  return (
    <motion.div className="m-switcher" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }} onPointerDown={(e) => e.target === e.currentTarget && os.setSwitcher(false)}>
      <h2>
        Open
        <small>
          {wins.length} app{wins.length === 1 ? '' : 's'} · swipe up to close
        </small>
      </h2>
      {wins.length ? (
        <div className="m-cards">
          <AnimatePresence>
          {wins.map((w) => (
            <motion.div
              key={w.id}
              className="m-card"
              layout
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0.9, bottom: 0.1 }}
              onDragEnd={(_, info) => {
                if (info.offset.y < -110 || info.velocity.y < -600) os.close(w.id)
              }}
              exit={{ y: -400, opacity: 0 }}
              onTap={() => {
                os.focus(w.id)
                os.setSwitcher(false)
              }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="m-card-head">
                <AppIcon id={w.id} />
                {APP_BY_ID[w.id].title}
                <button
                  className="m-card-close"
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation()
                    os.close(w.id)
                  }}
                  aria-label="Close"
                >
                  ×
                </button>
              </div>
              <div className="m-card-prev">
                <div>
                  <AppView id={w.id} />
                </div>
              </div>
            </motion.div>
          ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="m-empty">Nothing open. Tap an app.</div>
      )}
      <div className="m-tab">
        <button className="m-btn accent" onClick={() => os.setSwitcher(false)}>
          Done
        </button>
      </div>
    </motion.div>
  )
}

export function Mobile() {
  const os = useOS()
  const { state } = os
  const stack = [...state.wins].sort((a, b) => a.z - b.z)
  const showSheets = !state.home && stack.length > 0
  const hour = new Date().getHours()
  const greet = hour < 12 ? 'Morning.' : hour < 18 ? 'Afternoon.' : 'Evening.'

  return (
    <div className="mobile">
      <Wallpaper parallax={false} />
      <div className="m-status">
        <b>Mikail OS</b>
        <Clock date={false} />
      </div>

      <div className="m-home">
        <div className="m-greet">
          {greet} This is <em>Mikail’s</em> desk, folded to fit your pocket.
          <small>Tap an app. Sheets stack; the switcher is on the right of the dock.</small>
        </div>
        <div className="m-grid">
          {APPS.filter((a) => a.desktop || a.dock).map((a) => (
            <button key={a.id} className="m-app" onClick={() => os.open(a.id)}>
              <AppIcon id={a.id} />
              {state.wins.some((w) => w.id === a.id) && <span className="m-dot" />}
              {a.title}
            </button>
          ))}
          <button className="m-app" onClick={() => os.open('settings')}>
            <AppIcon id="settings" />
            Settings
          </button>
        </div>
      </div>

      <div className="m-sheets">
        <AnimatePresence>{showSheets && stack.map((w, i) => <Sheet key={w.id} win={w} depth={stack.length - 1 - i} count={stack.length} />)}</AnimatePresence>
      </div>

      <AnimatePresence>{state.switcher && <Switcher key="switcher" />}</AnimatePresence>

      {!state.switcher && (
        <nav className="m-tab" aria-label="Dock">
          {TAB.map((id) => {
            const w = state.wins.find((x) => x.id === id)
            return (
              <button key={id} className={`dock-item ${w ? 'running' : ''}`} onClick={() => os.open(id)} aria-label={APP_BY_ID[id].title}>
                <AppIcon id={id} />
                <span className="dock-dot" />
              </button>
            )
          })}
          <button className="dock-item m-switch" onClick={() => os.setSwitcher(true)} aria-label="Open apps">
            <span className="tile neutral">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <rect x="4" y="6" width="16" height="12" rx="2.5" />
                <rect x="7" y="3" width="10" height="3" rx="1" fill="currentColor" stroke="none" opacity="0.6" />
              </svg>
            </span>
            {state.wins.length > 0 && <span className="dock-dot" style={{ opacity: 1 }} />}
          </button>
        </nav>
      )}
    </div>
  )
}
