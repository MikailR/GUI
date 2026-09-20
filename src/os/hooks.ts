import { useCallback, useEffect, useRef, useState } from 'react'
import { useOs } from './store'

/** Subscribe to a CSS media query. */
export function useMediaQuery(query: string): boolean {
  const get = () => (typeof window !== 'undefined' ? window.matchMedia(query).matches : false)
  const [matches, setMatches] = useState(get)
  useEffect(() => {
    const media = window.matchMedia(query)
    const onChange = () => setMatches(media.matches)
    onChange()
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [query])
  return matches
}

/** The phone shell kicks in at 820px and below. */
export const PHONE_QUERY = '(max-width: 820px)'

/** True when either the OS preference or the in-app setting asks for less motion. */
export function useReducedMotion(): boolean {
  const system = useMediaQuery('(prefers-reduced-motion: reduce)')
  const { state } = useOs()
  return system || state.settings.reduceMotion
}

/** Ticks once a minute (aligned to the minute) and returns the current Date. */
export function useClock(intervalMs = 60_000): Date {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    let timer: number
    const schedule = () => {
      const delay = intervalMs - (Date.now() % intervalMs) + 20
      timer = window.setTimeout(() => {
        setNow(new Date())
        schedule()
      }, delay)
    }
    schedule()
    return () => window.clearTimeout(timer)
  }, [intervalMs])
  return now
}

export interface DragHandlers {
  onPointerDown: (event: React.PointerEvent<Element>) => void
}

interface UsePointerDragOptions {
  onStart?: (event: PointerEvent) => void
  /** dx/dy are relative to the pointerdown position. */
  onMove: (dx: number, dy: number, event: PointerEvent) => void
  onEnd?: (dx: number, dy: number, event: PointerEvent) => void
  /** Ignore the gesture if the pointerdown target matches this selector. */
  ignoreSelector?: string
  /** Movement threshold before onStart fires (prevents click jitter). */
  threshold?: number
}

/**
 * Pointer-capture based drag. Attaches move/up listeners to the captured element,
 * so the gesture survives leaving the element or the window.
 */
export function usePointerDrag(options: UsePointerDragOptions): DragHandlers {
  const optionsRef = useRef(options)
  optionsRef.current = options

  const onPointerDown = useCallback((event: React.PointerEvent<Element>) => {
    const opts = optionsRef.current
    if (event.button !== 0 && event.pointerType === 'mouse') return
    const target = event.target as Element
    if (opts.ignoreSelector && target.closest(opts.ignoreSelector)) return

    // Typed as HTMLElement for the pointer-event listener overloads; SVG elements share the same runtime API.
    const el = event.currentTarget as HTMLElement
    const startX = event.clientX
    const startY = event.clientY
    const threshold = opts.threshold ?? 2
    let started = false

    const move = (ev: PointerEvent) => {
      const dx = ev.clientX - startX
      const dy = ev.clientY - startY
      if (!started) {
        if (Math.abs(dx) < threshold && Math.abs(dy) < threshold) return
        started = true
        optionsRef.current.onStart?.(ev)
      }
      optionsRef.current.onMove(dx, dy, ev)
    }
    const up = (ev: PointerEvent) => {
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerup', up)
      el.removeEventListener('pointercancel', up)
      if (el.hasPointerCapture(ev.pointerId)) el.releasePointerCapture(ev.pointerId)
      if (started) optionsRef.current.onEnd?.(ev.clientX - startX, ev.clientY - startY, ev)
    }

    el.setPointerCapture(event.pointerId)
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerup', up)
    el.addEventListener('pointercancel', up)
  }, [])

  return { onPointerDown }
}

/** Current viewport size, updated on resize (debounced to a frame). */
export function useViewport() {
  const [size, setSize] = useState(() => ({ w: window.innerWidth, h: window.innerHeight }))
  useEffect(() => {
    let frame = 0
    const onResize = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => setSize({ w: window.innerWidth, h: window.innerHeight }))
    }
    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', onResize)
    }
  }, [])
  return size
}

/** Runs a requestAnimationFrame loop while `active`; the callback receives dt in seconds. */
export function useAnimationFrame(active: boolean, callback: (dt: number, t: number) => void) {
  const cbRef = useRef(callback)
  cbRef.current = callback
  useEffect(() => {
    if (!active) return
    let frame = 0
    let last = performance.now()
    const start = last
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      cbRef.current(dt, (now - start) / 1000)
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [active])
}

/** True while the element is at least partially on screen. */
export function useOnScreen<T extends Element>(ref: React.RefObject<T | null>): boolean {
  const [visible, setVisible] = useState(true)
  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.05 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref])
  return visible
}
