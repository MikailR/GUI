import { useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { APPS } from '../apps/registry'
import { useOS } from './store'
import { Wallpaper } from './Wallpaper'
import { MenuBar } from './MenuBar'
import { DesktopIcons } from './DesktopIcons'
import { Window } from './Window'
import { Dock } from './Dock'
import { Launcher } from './Launcher'
import { Help } from './Help'

export function Desktop() {
  const os = useOS()
  const { state } = os

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey
      const typing = (e.target as HTMLElement).matches('input, textarea, [contenteditable]')
      const focused = state.focus

      if (mod && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        os.setLauncher(!state.launcher)
        return
      }
      if (e.key === 'Escape') {
        if (state.launcher) return os.setLauncher(false)
        if (state.help) return os.setHelp(false)
        if (state.menu) return os.setMenu(null)
        if (focused && !typing) os.close(focused)
        return
      }
      if (typing) return
      if (e.key === '?' && !mod) {
        e.preventDefault()
        os.setHelp(!state.help)
        return
      }
      if (mod && e.key.toLowerCase() === 'w' && focused) {
        e.preventDefault()
        os.close(focused)
      } else if (mod && e.key.toLowerCase() === 'm' && focused) {
        e.preventDefault()
        os.minimize(focused)
      } else if (mod && e.key === 'ArrowUp' && focused) {
        e.preventDefault()
        os.toggleMax(focused)
      } else if (mod && e.key === '`') {
        e.preventDefault()
        os.cycle(e.shiftKey ? -1 : 1)
      } else if (mod && e.key.toLowerCase() === 't') {
        e.preventDefault()
        os.open('terminal')
      } else if (e.altKey && /^[1-9]$/.test(e.key)) {
        const dock = APPS.filter((a) => a.dock)
        const app = dock[Number(e.key) - 1]
        if (app) {
          e.preventDefault()
          os.open(app.id)
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [os, state.focus, state.launcher, state.help, state.menu])

  const visible = state.wins.filter((w) => !w.min)

  return (
    <div className="desktop">
      <Wallpaper />
      <MenuBar />
      <DesktopIcons />
      <div className="win-layer">
        <AnimatePresence>
          {visible.map((w) => (
            <Window key={w.id} win={w} />
          ))}
        </AnimatePresence>
      </div>
      <Dock />
      <AnimatePresence>{state.launcher && <Launcher key="launcher" />}</AnimatePresence>
      <AnimatePresence>{state.help && <Help key="help" />}</AnimatePresence>
    </div>
  )
}
