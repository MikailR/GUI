import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { APP_BY_ID } from '../apps/registry'
import { useOS, APPS } from './store'
import { Clock } from './Clock'

const MOD = /Mac|iPhone|iPad/.test(navigator.platform) ? '⌘' : 'Ctrl'
export const MOD_LABEL = MOD

export function MenuBar() {
  const os = useOS()
  const { state } = os
  const active = state.focus ? APP_BY_ID[state.focus] : null
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!state.menu) return
    const onDown = (e: PointerEvent) => {
      if (!barRef.current?.contains(e.target as Node)) os.setMenu(null)
    }
    window.addEventListener('pointerdown', onDown)
    return () => window.removeEventListener('pointerdown', onDown)
  }, [state.menu, os])

  const toggle = (name: string) => os.setMenu(state.menu === name ? null : name)
  const hover = (name: string) => state.menu && state.menu !== name && os.setMenu(name)
  const run = (fn: () => void) => () => {
    fn()
    os.setMenu(null)
  }

  return (
    <div className="menubar" ref={barRef}>
      <div className="menubar-l">
        <button className="mi menubar-brand" aria-expanded={state.menu === 'os'} onClick={() => toggle('os')} onPointerEnter={() => hover('os')}>
          Mikail OS
        </button>
        <button className="mi menubar-app" aria-expanded={state.menu === 'app'} onClick={() => toggle('app')} onPointerEnter={() => hover('app')}>
          {active ? active.title : 'Finder'}
        </button>
        <button className="mi" aria-expanded={state.menu === 'go'} onClick={() => toggle('go')} onPointerEnter={() => hover('go')}>
          Go
        </button>
        <button className="mi" aria-expanded={state.menu === 'window'} onClick={() => toggle('window')} onPointerEnter={() => hover('window')}>
          Window
        </button>
        <button className="mi" aria-expanded={state.menu === 'help'} onClick={() => toggle('help')} onPointerEnter={() => hover('help')}>
          Help
        </button>
      </div>
      <div className="menubar-r">
        <button className="mi" onClick={() => os.setLauncher(true)} title={`Search (${MOD} K)`}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.5-3.5" />
          </svg>
        </button>
        <span className="mi">
          <span className="wifi" aria-label="wifi">
            <i />
            <i />
            <i />
          </span>
        </span>
        <span className="mi">
          <span className="batt" aria-label="battery 73%">
            <i />
          </span>
          73%
        </span>
        <span className="mi">
          <Clock />
        </span>
      </div>

      <AnimatePresence>
        {state.menu && (
          <motion.div
            key={state.menu}
            className="menu"
            style={{ left: state.menu === 'os' ? 8 : state.menu === 'app' ? 104 : state.menu === 'go' ? 180 : state.menu === 'window' ? 224 : 300 }}
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.16 }}
          >
            {state.menu === 'os' && (
              <>
                <button className="menu-item" onClick={run(() => os.open('about'))}>
                  About this OS
                </button>
                <button className="menu-item" onClick={run(() => os.open('settings'))}>
                  System Settings…
                </button>
                <div className="menu-sep" />
                <button className="menu-item" onClick={run(() => os.open('terminal'))}>
                  Terminal <kbd>{MOD} T</kbd>
                </button>
                <div className="menu-sep" />
                <button className="menu-item" onClick={run(() => os.closeAll())}>
                  Close all windows
                </button>
              </>
            )}
            {state.menu === 'app' && (
              <>
                {active ? (
                  <>
                    <div className="menu-head">{active.code}.app</div>
                    <button className="menu-item" onClick={run(() => os.toggleMax(active.id))}>
                      {state.wins.find((w) => w.id === active.id)?.max ? 'Restore' : 'Maximise'} <kbd>{MOD} ↑</kbd>
                    </button>
                    <button className="menu-item" onClick={run(() => os.minimize(active.id))}>
                      Minimise <kbd>{MOD} M</kbd>
                    </button>
                    <div className="menu-sep" />
                    <button className="menu-item" onClick={run(() => os.close(active.id))}>
                      Close window <kbd>Esc</kbd>
                    </button>
                  </>
                ) : (
                  <div className="menu-head">no active window</div>
                )}
              </>
            )}
            {state.menu === 'go' && (
              <>
                {APPS.map((a) => (
                  <button key={a.id} className="menu-item" onClick={run(() => os.open(a.id))}>
                    {a.title} <kbd>{a.code}.app</kbd>
                  </button>
                ))}
              </>
            )}
            {state.menu === 'window' && (
              <>
                <button className="menu-item" onClick={run(() => os.tile())}>
                  Tile open windows
                </button>
                <button className="menu-item" onClick={run(() => os.cycle(1))}>
                  Cycle windows <kbd>{MOD} `</kbd>
                </button>
                <button className="menu-item" onClick={run(() => os.resetLayout())}>
                  Reset layout
                </button>
                <div className="menu-sep" />
                {state.wins.length ? (
                  state.wins.map((w) => (
                    <button key={w.id} className="menu-item" onClick={run(() => os.focus(w.id))}>
                      {w.min ? '◇ ' : state.focus === w.id ? '● ' : '○ '}
                      {APP_BY_ID[w.id].title}
                    </button>
                  ))
                ) : (
                  <div className="menu-head">no windows open</div>
                )}
              </>
            )}
            {state.menu === 'help' && (
              <>
                <button className="menu-item" onClick={run(() => os.setHelp(true))}>
                  Keyboard shortcuts <kbd>?</kbd>
                </button>
                <button className="menu-item" onClick={run(() => os.open('writing'))}>
                  Why does this site look like an OS?
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
