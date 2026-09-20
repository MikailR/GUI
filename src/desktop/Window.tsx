import { memo, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { APPS } from '../os/apps'
import { usePointerDrag } from '../os/hooks'
import type { AppId, WindowRect, WindowState } from '../os/types'

export type WindowPhase = 'opening' | 'open' | 'closing' | 'minimizing' | 'restoring'

interface WindowProps {
  win: WindowState
  focused: boolean
  /** Externally requested exit animation; when it finishes `onExited` fires. */
  exit: 'closing' | 'minimizing' | null
  onExited: (kind: 'closing' | 'minimizing') => void
  onFocus: () => void
  onRequestClose: () => void
  onRequestMinimize: () => void
  onToggleZoom: () => void
  onCommitRect: (rect: WindowRect) => void
  /** Optional right-side toolbar content supplied by the app. */
  toolbar?: ReactNode
  subtitle?: string | null
  children: ReactNode
}

const MENUBAR = 30
const KEEP_VISIBLE = 80 // px of the title bar that must remain on screen

type ResizeDir = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw'
const RESIZE_DIRS: ResizeDir[] = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw']

/** Where the Dock icon for an app currently is, so minimize can aim at it. */
function dockTarget(appId: AppId): { x: number; y: number } {
  const el = document.querySelector<HTMLElement>(`[data-dock-app="${appId}"]`)
  if (!el) return { x: window.innerWidth / 2, y: window.innerHeight }
  const r = el.getBoundingClientRect()
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 }
}

/**
 * A liquid-glass window. Drag writes transforms during the gesture and commits a rect on release;
 * resize writes geometry directly (layout is expected to change) and commits on release.
 */
export const Window = memo(function Window({
  win,
  focused,
  exit,
  onExited,
  onFocus,
  onRequestClose,
  onRequestMinimize,
  onToggleZoom,
  onCommitRect,
  toolbar,
  subtitle,
  children,
}: WindowProps) {
  const ref = useRef<HTMLElement | null>(null)
  const [phase, setPhase] = useState<WindowPhase>('opening')
  const meta = APPS[win.appId]
  const wasMinimized = useRef(win.minimized)

  // Entrance → open. Exit requests come from the shell so keyboard + traffic lights share one path.
  useEffect(() => {
    if (exit) setPhase(exit)
  }, [exit])

  // Coming back from the Dock: play a restore animation.
  useEffect(() => {
    if (wasMinimized.current && !win.minimized) setPhase('restoring')
    wasMinimized.current = win.minimized
  }, [win.minimized])

  useEffect(() => {
    if (phase !== 'closing' && phase !== 'minimizing') return
    const el = ref.current
    if (!el) return
    const kind = phase
    let done = false
    const finish = () => {
      if (done) return
      done = true
      onExited(kind)
    }
    el.addEventListener('animationend', finish, { once: true })
    const timer = window.setTimeout(finish, 700)
    return () => {
      el.removeEventListener('animationend', finish)
      window.clearTimeout(timer)
    }
  }, [phase, onExited])

  const onEnterAnimationEnd = () => {
    if (phase === 'opening' || phase === 'restoring') setPhase('open')
  }

  /* ---------------------------------------------------------- drag */
  const drag = usePointerDrag({
    ignoreSelector: 'button, a, input, [data-no-drag]',
    onStart: () => {
      onFocus()
      ref.current?.classList.add('is-dragging')
    },
    onMove: (dx, dy) => {
      const el = ref.current
      if (el) el.style.transform = `translate3d(${dx}px, ${dy}px, 0)`
    },
    onEnd: (dx, dy) => {
      const el = ref.current
      if (el) {
        el.style.transform = ''
        el.classList.remove('is-dragging')
      }
      const vw = window.innerWidth
      const vh = window.innerHeight
      const x = Math.min(vw - KEEP_VISIBLE, Math.max(KEEP_VISIBLE - win.rect.w, win.rect.x + dx))
      const y = Math.min(vh - 60, Math.max(MENUBAR, win.rect.y + dy))
      onCommitRect({ ...win.rect, x: Math.round(x), y: Math.round(y) })
    },
  })

  /* -------------------------------------------------------- resize */
  const resizeDir = useRef<ResizeDir>('se')
  const resize = usePointerDrag({
    threshold: 0,
    onStart: () => {
      onFocus()
      ref.current?.classList.add('is-resizing')
    },
    onMove: (dx, dy) => {
      const el = ref.current
      if (!el) return
      const next = resizeRect(win.rect, resizeDir.current, dx, dy, meta.minSize)
      el.style.left = `${next.x}px`
      el.style.top = `${next.y}px`
      el.style.width = `${next.w}px`
      el.style.height = `${next.h}px`
    },
    onEnd: (dx, dy) => {
      ref.current?.classList.remove('is-resizing')
      onCommitRect(resizeRect(win.rect, resizeDir.current, dx, dy, meta.minSize))
    },
  })

  const target = phase === 'minimizing' ? dockTarget(win.appId) : null
  const style: CSSProperties & Record<string, string | number> = {
    left: win.rect.x,
    top: win.rect.y,
    width: win.rect.w,
    height: win.rect.h,
    zIndex: win.z,
    '--min-dx': target ? `${target.x - (win.rect.x + win.rect.w / 2)}px` : '0px',
    '--min-dy': target ? `${target.y - (win.rect.y + win.rect.h / 2)}px` : '0px',
  }

  return (
    <section
      ref={ref}
      className={`glass window phase-${phase} ${focused ? 'is-focused' : ''} ${win.zoomed ? 'is-zoomed' : ''}`}
      style={style}
      role="dialog"
      aria-label={`${meta.title} window`}
      data-window={win.appId}
      onPointerDownCapture={() => {
        if (!focused) onFocus()
      }}
      onAnimationEnd={onEnterAnimationEnd}
    >
      <header className="window__titlebar no-select" onPointerDown={drag.onPointerDown} onDoubleClick={onToggleZoom}>
        <div className="traffic" role="group" aria-label="Window controls">
          <button type="button" className="traffic__btn traffic__btn--close" aria-label="Close" title="Close (Esc)" onClick={onRequestClose}>
            <svg viewBox="0 0 12 12" aria-hidden="true">
              <path d="M3.5 3.5l5 5M8.5 3.5l-5 5" />
            </svg>
          </button>
          <button type="button" className="traffic__btn traffic__btn--min" aria-label="Minimize" title="Minimize (⌥M)" onClick={onRequestMinimize}>
            <svg viewBox="0 0 12 12" aria-hidden="true">
              <path d="M3 6h6" />
            </svg>
          </button>
          <button type="button" className="traffic__btn traffic__btn--zoom" aria-label={win.zoomed ? 'Restore size' : 'Zoom'} title="Zoom (⌥↩)" onClick={onToggleZoom}>
            <svg viewBox="0 0 12 12" aria-hidden="true">
              {win.zoomed ? (
                <path d="M3.5 6.5v2h2M8.5 5.5v-2h-2" strokeLinecap="round" />
              ) : (
                <path d="M3 8.5V3h5.5M9 3.5V9H3.5" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
        <div className="window__title">
          <span className="window__title-main">{meta.title}</span>
          {subtitle ? <span className="window__title-sub">{subtitle}</span> : null}
        </div>
        <div className="window__toolbar" data-no-drag>
          {toolbar}
        </div>
      </header>

      <div className="window__body">{children}</div>

      {RESIZE_DIRS.map((dir) => (
        <div
          key={dir}
          className={`window__resize window__resize--${dir}`}
          data-no-drag
          onPointerDown={(e) => {
            resizeDir.current = dir
            resize.onPointerDown(e)
          }}
        />
      ))}
    </section>
  )
})

function resizeRect(rect: WindowRect, dir: ResizeDir, dx: number, dy: number, min: { w: number; h: number }): WindowRect {
  let { x, y, w, h } = rect
  if (dir.includes('e')) w = Math.max(min.w, rect.w + dx)
  if (dir.includes('s')) h = Math.max(min.h, rect.h + dy)
  if (dir.includes('w')) {
    w = Math.max(min.w, rect.w - dx)
    x = rect.x + (rect.w - w)
  }
  if (dir.includes('n')) {
    h = Math.max(min.h, rect.h - dy)
    y = Math.max(MENUBAR, rect.y + (rect.h - h))
    h = rect.y + rect.h - y
  }
  return { x: Math.round(x), y: Math.round(y), w: Math.round(w), h: Math.round(h) }
}
