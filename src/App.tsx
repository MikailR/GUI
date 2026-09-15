import { useEffect, useState } from 'react'
import { OSProvider, useOS } from './os/store'
import { DOCK_ORDER } from './os/apps'
import { useIsMobile } from './os/hooks'
import { Boot } from './components/Boot'
import { Wallpaper } from './components/Wallpaper'
import { MenuBar } from './components/MenuBar'
import { Desktop } from './components/Desktop'
import { WindowLayer } from './components/Window'
import { Dock } from './components/Dock'
import { Spotlight } from './components/Spotlight'
import { Toasts } from './components/Toasts'
import { MobileShell } from './components/MobileShell'

function useShortcuts() {
  const os = useOS()
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey
      const typing = e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement
      if (mod && (e.key.toLowerCase() === 'k' || (e.code === 'Space' && !typing))) {
        e.preventDefault()
        os.setSpotlight(!os.state.spotlight)
        return
      }
      if (os.state.spotlight) return
      if (os.state.asleep) {
        os.sleep(false)
        return
      }
      const f = os.focused
      if (e.key === 'Escape' && f) {
        os.close(f.id)
        return
      }
      if (!mod) return
      const k = e.key.toLowerCase()
      if (k === 'w' && f) { e.preventDefault(); os.close(f.id) }
      else if (k === 'm' && f) { e.preventDefault(); os.minimize(f.id) }
      else if (e.key === '`' || e.code === 'Backquote') { e.preventDefault(); os.cycleFocus(e.shiftKey ? -1 : 1) }
      else if (k === ',') { e.preventDefault(); os.open('settings') }
      else if (/^[1-9]$/.test(e.key) && !typing) {
        const id = DOCK_ORDER[Number(e.key) - 1]
        if (id) { e.preventDefault(); os.open(id) }
      }
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [os])
}

function DesktopShell() {
  const os = useOS()
  useShortcuts()
  useEffect(() => {
    const t = window.setTimeout(() => os.toast('Welcome to Mikail OS', 'Double-click an icon, or press ⌘K to search.', 'about'), 600)
    return () => window.clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <div className={`os ${os.state.asleep ? 'dimmed' : ''}`} onPointerDown={() => os.state.asleep && os.sleep(false)}>
      <Wallpaper kind={os.state.wallpaper} theme={os.state.theme} animate={!os.state.reduceMotion} />
      <MenuBar />
      <Desktop />
      <WindowLayer />
      <Dock />
      <Toasts />
      {os.state.spotlight && <Spotlight />}
    </div>
  )
}

function Shell() {
  const os = useOS()
  const mobile = useIsMobile()
  const [booting, setBooting] = useState(true)
  const key = os.state.bootKey
  useEffect(() => {
    if (key > 0) setBooting(true)
  }, [key])
  return (
    <>
      {mobile ? <MobileShell /> : <DesktopShell />}
      {booting && <Boot key={key} onDone={() => setBooting(false)} />}
    </>
  )
}

export default function App() {
  return (
    <OSProvider>
      <Shell />
    </OSProvider>
  )
}
