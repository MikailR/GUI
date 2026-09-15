import { useCallback, useEffect, useRef, useState } from 'react'
import { useOS } from '../os/store'
import { APPS, DESKTOP_ORDER } from '../os/apps'
import type { AppId } from '../os/types'
import { AppIcon } from './Icons'
import { ContextMenu, type CtxItem } from './ContextMenu'

type Marquee = { x0: number; y0: number; x1: number; y1: number }

export function Desktop() {
  const os = useOS()
  const [selected, setSelected] = useState<Set<AppId>>(new Set())
  const [marquee, setMarquee] = useState<Marquee | null>(null)
  const [ctx, setCtx] = useState<{ x: number; y: number; items: CtxItem[] } | null>(null)
  const [dropping, setDropping] = useState<AppId | null>(null)
  const iconRefs = useRef(new Map<AppId, HTMLButtonElement>())
  const rootRef = useRef<HTMLDivElement>(null)

  const launch = useCallback(
    (id: AppId) => {
      setDropping(id)
      window.setTimeout(() => setDropping(null), 400)
      os.open(id)
    },
    [os],
  )

  // Enter opens the selection; arrows move it
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (os.state.spotlight) return
      if (e.key === 'Enter' && selected.size) {
        selected.forEach((id) => launch(id))
        setSelected(new Set())
      } else if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && !os.focused) {
        e.preventDefault()
        const cur = [...selected][0]
        const i = cur ? DESKTOP_ORDER.indexOf(cur) : -1
        const n = e.key === 'ArrowDown' ? Math.min(DESKTOP_ORDER.length - 1, i + 1) : Math.max(0, i - 1)
        setSelected(new Set([DESKTOP_ORDER[n]]))
      }
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [selected, launch, os.state.spotlight, os.focused])

  const onDesktopDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget || e.button !== 0) return
    setSelected(new Set())
    const root = e.currentTarget
    const r = root.getBoundingClientRect()
    const x0 = e.clientX - r.left
    const y0 = e.clientY - r.top
    setMarquee({ x0, y0, x1: x0, y1: y0 })
    root.setPointerCapture(e.pointerId)
    const move = (ev: PointerEvent) => {
      const x1 = ev.clientX - r.left
      const y1 = ev.clientY - r.top
      setMarquee({ x0, y0, x1, y1 })
      const L = Math.min(x0, x1) + r.left, T = Math.min(y0, y1) + r.top, R = Math.max(x0, x1) + r.left, B = Math.max(y0, y1) + r.top
      const next = new Set<AppId>()
      iconRefs.current.forEach((el, id) => {
        const b = el.getBoundingClientRect()
        if (b.left < R && b.right > L && b.top < B && b.bottom > T) next.add(id)
      })
      setSelected(next)
    }
    const up = () => {
      root.removeEventListener('pointermove', move)
      root.removeEventListener('pointerup', up)
      root.removeEventListener('pointercancel', up)
      setMarquee(null)
    }
    root.addEventListener('pointermove', move)
    root.addEventListener('pointerup', up)
    root.addEventListener('pointercancel', up)
  }

  const desktopMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    if (e.target !== e.currentTarget) return
    setCtx({
      x: e.clientX,
      y: e.clientY,
      items: [
        { label: 'New Terminal Window', onClick: () => os.open('terminal') },
        { label: 'Search…', hint: '⌘K', onClick: () => os.setSpotlight(true) },
        { sep: true, label: '' },
        { label: 'Aurora wallpaper', onClick: () => os.setWallpaper('aurora') },
        { label: 'Horizon wallpaper', onClick: () => os.setWallpaper('horizon') },
        { label: 'Mono wallpaper', onClick: () => os.setWallpaper('mono') },
        { sep: true, label: '' },
        { label: os.state.theme === 'dusk' ? 'Switch to Dawn' : 'Switch to Dusk', onClick: () => os.setTheme(os.state.theme === 'dusk' ? 'dawn' : 'dusk') },
        { label: 'Clean Up Icons', onClick: () => os.toast('Already tidy', 'The grid is the grid.', 'settings') },
        { label: 'About This Computer', onClick: () => os.open('sysinfo') },
      ],
    })
  }

  const iconMenu = (e: React.MouseEvent, id: AppId) => {
    e.preventDefault()
    e.stopPropagation()
    setSelected(new Set([id]))
    setCtx({
      x: e.clientX,
      y: e.clientY,
      items: [
        { label: 'Open', onClick: () => launch(id) },
        { label: 'Get Info', onClick: () => os.toast(APPS[id].title, `Kind: Application · Where: /Users/mikail/Desktop`, id) },
        { sep: true, label: '' },
        { label: id === 'trash' ? 'Empty Trash…' : 'Move to Trash', onClick: () => (id === 'trash' ? os.open('trash') : os.toast('Nope', `${APPS[id].title} is load-bearing.`, 'trash')) },
      ],
    })
  }

  return (
    <div className="desktop" ref={rootRef} onPointerDown={onDesktopDown} onContextMenu={desktopMenu}>
      <div className="icon-grid">
        {DESKTOP_ORDER.map((id) => {
          const def = APPS[id]
          const sel = selected.has(id)
          return (
            <button
              key={id}
              ref={(el) => {
                if (el) iconRefs.current.set(id, el)
                else iconRefs.current.delete(id)
              }}
              className={`dicon ${sel ? 'selected' : ''} ${dropping === id ? 'dropping' : ''}`}
              onPointerDown={(e) => {
                e.stopPropagation()
                if (e.button !== 0) return
                setSelected(e.shiftKey || e.metaKey ? new Set([...selected, id]) : new Set([id]))
              }}
              onPointerUp={(e) => {
                if (e.pointerType === 'touch') launch(id)
              }}
              onDoubleClick={() => launch(id)}
              onContextMenu={(e) => iconMenu(e, id)}
              aria-label={`Open ${def.title}`}
            >
              <AppIcon id={id} size={56} className="glyph" />
              <span className="label">{def.desktopLabel ?? def.title}</span>
            </button>
          )
        })}
      </div>
      {marquee && (
        <div
          className="marquee"
          style={{
            left: Math.min(marquee.x0, marquee.x1),
            top: Math.min(marquee.y0, marquee.y1),
            width: Math.abs(marquee.x1 - marquee.x0),
            height: Math.abs(marquee.y1 - marquee.y0),
          }}
        />
      )}
      {ctx && <ContextMenu x={ctx.x} y={ctx.y} items={ctx.items} onClose={() => setCtx(null)} />}
    </div>
  )
}
