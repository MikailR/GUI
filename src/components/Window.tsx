import { Suspense, useEffect, useRef, useState } from 'react'
import { MENUBAR_H, fullRect, useOS } from '../os/store'
import { APPS } from '../os/apps'
import type { Rect, Win } from '../os/types'
import { AppIcon, Ico } from './Icons'

type Dir = 'e' | 's' | 'w' | 'se' | 'sw'

export function Window({ win, focused }: { win: Win; focused: boolean }) {
  const os = useOS()
  const def = APPS[win.app]
  const ref = useRef<HTMLDivElement>(null)
  const [dragging, setDragging] = useState(false)
  const [animating, setAnimating] = useState(false)
  const App = def.component

  // phase transitions
  useEffect(() => {
    if (win.phase === 'opening') {
      const t = window.setTimeout(() => os.opened(win.id), 300)
      return () => window.clearTimeout(t)
    }
    if (win.phase === 'closing') {
      const t = window.setTimeout(() => os.remove(win.id), 190)
      return () => window.clearTimeout(t)
    }
    if (win.phase === 'minimizing') {
      // aim the genie at the dock icon
      const el = ref.current
      const dockEl = document.querySelector<HTMLElement>(`[data-dock="${win.app}"]`)
      if (el && dockEl) {
        const a = el.getBoundingClientRect()
        const b = dockEl.getBoundingClientRect()
        el.style.setProperty('--dock-dx', `${b.left + b.width / 2 - (a.left + a.width / 2)}px`)
        el.style.setProperty('--dock-dy', `${b.top + b.height / 2 - (a.top + a.height / 2)}px`)
      }
      const t = window.setTimeout(() => os.minimized(win.id), 330)
      return () => window.clearTimeout(t)
    }
  }, [win.phase, win.id, win.app, os])

  const startDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 || win.maximized) return
    if ((e.target as HTMLElement).closest('button')) return
    const el = ref.current!
    const bar = e.currentTarget
    bar.setPointerCapture(e.pointerId)
    const sx = e.clientX, sy = e.clientY
    const { x, y, w } = win.rect
    let nx = x, ny = y
    setDragging(true)
    const move = (ev: PointerEvent) => {
      nx = x + ev.clientX - sx
      ny = y + ev.clientY - sy
      // keep the title bar reachable
      nx = Math.max(-w + 80, Math.min(window.innerWidth - 80, nx))
      ny = Math.max(MENUBAR_H, Math.min(window.innerHeight - 40, ny))
      el.style.transform = `translate(${nx - x}px, ${ny - y}px)`
    }
    const up = () => {
      bar.removeEventListener('pointermove', move)
      bar.removeEventListener('pointerup', up)
      bar.removeEventListener('pointercancel', up)
      el.style.transform = ''
      setDragging(false)
      if (nx !== x || ny !== y) os.move(win.id, Math.round(nx), Math.round(ny))
    }
    bar.addEventListener('pointermove', move)
    bar.addEventListener('pointerup', up)
    bar.addEventListener('pointercancel', up)
  }

  const startResize = (dir: Dir) => (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 || win.maximized) return
    e.stopPropagation()
    const el = ref.current!
    const handle = e.currentTarget
    handle.setPointerCapture(e.pointerId)
    const sx = e.clientX, sy = e.clientY
    const r0 = win.rect
    let r: Rect = r0
    const move = (ev: PointerEvent) => {
      const dx = ev.clientX - sx, dy = ev.clientY - sy
      let { x, y, w, h } = r0
      if (dir.includes('e')) w = Math.max(def.minW, r0.w + dx)
      if (dir.includes('s')) h = Math.max(def.minH, r0.h + dy)
      if (dir.includes('w')) {
        w = Math.max(def.minW, r0.w - dx)
        x = r0.x + (r0.w - w)
      }
      r = { x, y, w, h }
      el.style.left = `${x}px`
      el.style.width = `${w}px`
      el.style.height = `${h}px`
    }
    const up = () => {
      handle.removeEventListener('pointermove', move)
      handle.removeEventListener('pointerup', up)
      handle.removeEventListener('pointercancel', up)
      os.resize(win.id, r)
    }
    handle.addEventListener('pointermove', move)
    handle.addEventListener('pointerup', up)
    handle.addEventListener('pointercancel', up)
  }

  const zoom = () => {
    setAnimating(true)
    window.setTimeout(() => setAnimating(false), 320)
    os.toggleMax(win.id)
  }

  const cls = ['win', focused && 'focused', win.phase, dragging && 'dragging', animating && 'animating', win.maximized && 'maximized']
    .filter(Boolean)
    .join(' ')

  return (
    <div
      ref={ref}
      className={cls}
      style={{ left: win.rect.x, top: win.rect.y, width: win.rect.w, height: win.rect.h, zIndex: win.z, display: win.minimized ? 'none' : undefined }}
      onPointerDownCapture={() => !focused && os.focus(win.id)}
      role="dialog"
      aria-label={def.title}
    >
      <div className="win-titlebar" onPointerDown={startDrag} onDoubleClick={zoom}>
        <div className="traffic">
          <button className="close" onClick={() => os.close(win.id)} aria-label="Close" title="Close (Esc)"><Ico.X /></button>
          <button className="min" onClick={() => os.minimize(win.id)} aria-label="Minimize" title="Minimize (⌘M)"><Ico.Minus /></button>
          <button className="max" onClick={zoom} aria-label="Zoom" title="Zoom"><Ico.Expand /></button>
        </div>
        <div className="win-title">
          <AppIcon id={win.app} size={16} />
          {def.title}
        </div>
      </div>
      <div className="win-body">
        <Suspense fallback={<div className="empty">Loading…</div>}>
          <App windowId={win.id} payload={win.payload} />
        </Suspense>
      </div>
      {!win.maximized && (
        <>
          <div className="rz e" onPointerDown={startResize('e')} />
          <div className="rz s" onPointerDown={startResize('s')} />
          <div className="rz w" onPointerDown={startResize('w')} />
          <div className="rz se" onPointerDown={startResize('se')} />
          <div className="rz sw" onPointerDown={startResize('sw')} />
        </>
      )}
    </div>
  )
}

export function WindowLayer() {
  const os = useOS()
  // keep windows on screen when the viewport changes
  useEffect(() => {
    const h = () => {
      const vw = window.innerWidth, vh = window.innerHeight
      for (const w of os.state.windows) {
        if (w.maximized) os.resize(w.id, fullRect())
        else if (w.rect.x > vw - 80 || w.rect.y > vh - 40) os.move(w.id, Math.min(w.rect.x, vw - 120), Math.min(w.rect.y, vh - 80))
      }
    }
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [os])
  return (
    <div className="win-layer">
      {os.state.windows.map((w) => (
        <Window key={w.id} win={w} focused={os.focused?.id === w.id} />
      ))}
    </div>
  )
}
