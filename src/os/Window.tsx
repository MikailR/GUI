import { useEffect, useRef, useState, type PointerEvent as RPointerEvent } from 'react'
import { motion } from 'framer-motion'
import { APP_BY_ID } from '../apps/registry'
import { AppView } from '../apps'
import { useOS, type Win, MENUBAR_H, DOCK_H } from './store'

type Mode = 'move' | 'e' | 's' | 'se' | 'w'

export function Window({ win }: { win: Win }) {
  const os = useOS()
  const meta = APP_BY_ID[win.id]
  const focused = os.state.focus === win.id
  const [dragging, setDragging] = useState(false)
  const [animating, setAnimating] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const winRef = useRef(win)
  winRef.current = win

  // Animate geometry on maximise/restore and tile/reset, not while dragging.
  const prevMax = useRef(win.max)
  useEffect(() => {
    if (prevMax.current !== win.max) {
      prevMax.current = win.max
      setAnimating(true)
      const t = setTimeout(() => setAnimating(false), 380)
      return () => clearTimeout(t)
    }
  }, [win.max])

  const begin = (mode: Mode) => (e: RPointerEvent<HTMLElement>) => {
    if (e.button !== 0) return
    if (mode === 'move' && (e.target as HTMLElement).closest('button')) return
    if (win.max) return
    e.preventDefault()
    const el = e.currentTarget
    const start = { px: e.clientX, py: e.clientY, ...winRef.current }
    el.setPointerCapture(e.pointerId)
    setDragging(true)
    setAnimating(false)
    const vw = window.innerWidth
    const vh = window.innerHeight
    const onMove = (ev: PointerEvent) => {
      const dx = ev.clientX - start.px
      const dy = ev.clientY - start.py
      if (mode === 'move') {
        const x = Math.max(-start.w + 120, Math.min(start.x + dx, vw - 120))
        const y = Math.max(MENUBAR_H, Math.min(start.y + dy, vh - DOCK_H - 30))
        os.move(win.id, x, y)
      } else {
        let w = start.w
        let h = start.h
        let x = start.x
        if (mode === 'e' || mode === 'se') w = Math.max(meta.min[0], start.w + dx)
        if (mode === 's' || mode === 'se') h = Math.max(meta.min[1], start.h + dy)
        if (mode === 'w') {
          w = Math.max(meta.min[0], start.w - dx)
          x = start.x + (start.w - w)
        }
        os.resize(win.id, w, h)
        if (x !== start.x) os.move(win.id, x, start.y)
      }
    }
    const onUp = () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerup', onUp)
      el.removeEventListener('pointercancel', onUp)
      setDragging(false)
    }
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerup', onUp)
    el.addEventListener('pointercancel', onUp)
  }

  const geometry = win.max ? {} : { left: win.x, top: win.y, width: win.w, height: win.h }

  return (
    <motion.div
      ref={ref}
      className={`win ${focused ? 'focused' : ''} ${dragging ? 'dragging' : ''} ${animating ? 'animating' : ''} ${win.max ? 'max' : ''}`}
      style={{ ...geometry, zIndex: win.z }}
      initial={{ opacity: 0, scale: 0.9, y: 18 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92, y: 24, transition: { duration: 0.18 } }}
      transition={{ type: 'spring', stiffness: 420, damping: 34, mass: 0.9 }}
      onPointerDownCapture={() => !focused && os.focus(win.id)}
      role="dialog"
      aria-label={meta.title}
      data-app={win.id}
    >
      <div className="win-tb" onPointerDown={begin('move')} onDoubleClick={() => os.toggleMax(win.id)}>
        <div className="lights">
          <button className="l-close" aria-label="Close" onClick={() => os.close(win.id)}>
            <svg viewBox="0 0 10 10">
              <path d="M2 2l6 6M8 2l-6 6" />
            </svg>
          </button>
          <button className="l-min" aria-label="Minimise" onClick={() => os.minimize(win.id)}>
            <svg viewBox="0 0 10 10">
              <path d="M2 5h6" />
            </svg>
          </button>
          <button className="l-max" aria-label={win.max ? 'Restore' : 'Maximise'} onClick={() => os.toggleMax(win.id)}>
            <svg viewBox="0 0 10 10">
              <path d="M2.5 2.5h5v5h-5z" />
            </svg>
          </button>
        </div>
        <div className="win-title">{meta.title}</div>
        <div className="win-code">{meta.code}.app</div>
      </div>
      <div className="win-body">
        <AppView id={win.id} />
      </div>
      <div className="rs rs-e" onPointerDown={begin('e')} />
      <div className="rs rs-s" onPointerDown={begin('s')} />
      <div className="rs rs-w" onPointerDown={begin('w')} />
      <div className="rs rs-se" onPointerDown={begin('se')} />
    </motion.div>
  )
}
