import { memo, useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent, type ReactNode } from 'react'
import { appMeta } from '../os/apps'
import type { AppId, Rect, WindowState } from '../os/types'
import { Symbol } from '../icons/Symbol'

const MENU_BAR = 28

interface WindowProps {
  win: WindowState
  focused: boolean
  viewport: { w: number; h: number }
  onFocus: (appId: AppId) => void
  onClose: (appId: AppId) => void
  onMinimize: (appId: AppId) => void
  onZoom: (appId: AppId) => void
  onRect: (appId: AppId, rect: Rect) => void
  children: ReactNode
}

type Exit = 'close' | 'minimize' | null

type ResizeEdge = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw'
const EDGES: ResizeEdge[] = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw']

function isInteractive(target: EventTarget | null): boolean {
  return target instanceof Element && target.closest('button, input, select, textarea, a, [role="slider"]') !== null
}

export const Window = memo(function Window({
  win,
  focused,
  viewport,
  onFocus,
  onClose,
  onMinimize,
  onZoom,
  onRect,
  children,
}: WindowProps) {
  const frameRef = useRef<HTMLElement | null>(null)
  const [exit, setExit] = useState<Exit>(null)
  const meta = appMeta(win.id)

  /* ---- drag ---- */
  const drag = useRef<{ startX: number; startY: number; dx: number; dy: number } | null>(null)

  const onPointerDown = useCallback(
    (event: PointerEvent<HTMLElement>) => {
      if (!focused) onFocus(win.id)
      if (event.button !== 0) return
      const target = event.target as Element
      if (!target.closest('[data-drag-handle]') || isInteractive(target)) return
      if (target.closest('[data-no-drag]')) return
      drag.current = { startX: event.clientX, startY: event.clientY, dx: 0, dy: 0 }
      event.currentTarget.setPointerCapture(event.pointerId)
      frameRef.current?.setAttribute('data-dragging', '')
    },
    [focused, onFocus, win.id],
  )

  const onPointerMove = useCallback((event: PointerEvent<HTMLElement>) => {
    const state = drag.current
    if (!state || !frameRef.current) return
    state.dx = event.clientX - state.startX
    state.dy = event.clientY - state.startY
    frameRef.current.style.transform = `translate3d(${state.dx}px, ${state.dy}px, 0)`
  }, [])

  const onPointerUp = useCallback(
    (event: PointerEvent<HTMLElement>) => {
      const state = drag.current
      if (!state) return
      drag.current = null
      const frame = frameRef.current
      if (frame) {
        frame.style.transform = ''
        frame.removeAttribute('data-dragging')
      }
      event.currentTarget.releasePointerCapture(event.pointerId)
      if (state.dx === 0 && state.dy === 0) return
      const x = Math.min(Math.max(win.x + state.dx, -win.w + 120), viewport.w - 120)
      const y = Math.min(Math.max(win.y + state.dy, MENU_BAR), viewport.h - 60)
      onRect(win.id, { x, y, w: win.w, h: win.h })
    },
    [onRect, viewport.h, viewport.w, win],
  )

  /* ---- resize ---- */
  const startResize = useCallback(
    (edge: ResizeEdge) => (event: PointerEvent<HTMLElement>) => {
      if (event.button !== 0) return
      event.stopPropagation()
      onFocus(win.id)
      const frame = frameRef.current
      if (!frame) return
      const startX = event.clientX
      const startY = event.clientY
      const start = { x: win.x, y: win.y, w: win.w, h: win.h }
      const min = meta.minSize
      const handle = event.currentTarget
      handle.setPointerCapture(event.pointerId)
      frame.setAttribute('data-resizing', '')
      let next: Rect = start

      const move = (moveEvent: globalThis.PointerEvent) => {
        const dx = moveEvent.clientX - startX
        const dy = moveEvent.clientY - startY
        let { x, y, w, h } = start
        if (edge.includes('e')) w = Math.max(min.w, start.w + dx)
        if (edge.includes('s')) h = Math.max(min.h, start.h + dy)
        if (edge.includes('w')) {
          w = Math.max(min.w, start.w - dx)
          x = start.x + (start.w - w)
        }
        if (edge.includes('n')) {
          h = Math.max(min.h, start.h - dy)
          y = Math.max(MENU_BAR, start.y + (start.h - h))
          h = start.h + (start.y - y)
        }
        next = { x, y, w, h }
        frame.style.left = `${x}px`
        frame.style.top = `${y}px`
        frame.style.width = `${w}px`
        frame.style.height = `${h}px`
      }
      const up = () => {
        handle.removeEventListener('pointermove', move)
        handle.removeEventListener('pointerup', up)
        handle.removeEventListener('pointercancel', up)
        frame.removeAttribute('data-resizing')
        onRect(win.id, next)
      }
      handle.addEventListener('pointermove', move)
      handle.addEventListener('pointerup', up)
      handle.addEventListener('pointercancel', up)
    },
    [meta.minSize, onFocus, onRect, win],
  )

  /* ---- exit animations ---- */
  const requestClose = useCallback(() => setExit('close'), [])
  const requestMinimize = useCallback(() => {
    const frame = frameRef.current
    const dockItem = document.querySelector<HTMLElement>(`[data-dock-item="${win.id}"]`)
    if (frame && dockItem) {
      const from = frame.getBoundingClientRect()
      const to = dockItem.getBoundingClientRect()
      frame.style.setProperty('--to-x', `${to.left + to.width / 2 - (from.left + from.width / 2)}px`)
      frame.style.setProperty('--to-y', `${to.top + to.height / 2 - (from.top + from.height / 2)}px`)
    }
    setExit('minimize')
  }, [win.id])

  useEffect(() => {
    if (!exit) return
    const frame = frameRef.current
    const finish = () => (exit === 'close' ? onClose(win.id) : onMinimize(win.id))
    if (!frame) {
      finish()
      return
    }
    const reduced = document.documentElement.dataset.motion === 'reduced'
    if (reduced) {
      finish()
      return
    }
    const timer = window.setTimeout(finish, exit === 'close' ? 180 : 320)
    return () => window.clearTimeout(timer)
  }, [exit, onClose, onMinimize, win.id])

  const style: CSSProperties = {
    left: win.x,
    top: win.y,
    width: win.w,
    height: win.h,
    zIndex: win.z,
  }

  return (
    <section
      ref={frameRef}
      className="mac-window glass glass-thick"
      style={style}
      data-focused={focused || undefined}
      data-exit={exit ?? undefined}
      data-zoomed={win.zoomed || undefined}
      role="dialog"
      aria-label={meta.name}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onAnimationEnd={(event) => {
        if (event.animationName === 'window-in') event.currentTarget.setAttribute('data-entered', '')
      }}
    >
      <div className="mac-traffic" data-no-drag>
        <button type="button" className="mac-light" data-kind="close" onClick={requestClose} aria-label="Close window">
          <Symbol name="xmark" size={8} weight={3.2} />
        </button>
        <button type="button" className="mac-light" data-kind="minimize" onClick={requestMinimize} aria-label="Minimize window">
          <Symbol name="minus" size={8} weight={3.2} />
        </button>
        <button
          type="button"
          className="mac-light"
          data-kind="zoom"
          onClick={() => onZoom(win.id)}
          aria-label={win.zoomed ? 'Restore window size' : 'Zoom window'}
        >
          <ZoomGlyph />
        </button>
      </div>
      <div className="mac-window-body">{children}</div>
      {EDGES.map((edge) => (
        <div key={edge} className="mac-resize" data-edge={edge} onPointerDown={startResize(edge)} aria-hidden="true" />
      ))}
    </section>
  )
})

function ZoomGlyph() {
  return (
    <svg width="8" height="8" viewBox="0 0 8 8" aria-hidden="true">
      <path d="M1.2 6.8V2.6L5.4 6.8zM6.8 1.2v4.2L2.6 1.2z" fill="currentColor" />
    </svg>
  )
}
