import { useEffect, useState } from 'react'

export function useMediaQuery(q: string): boolean {
  const [m, setM] = useState(() => window.matchMedia(q).matches)
  useEffect(() => {
    const mq = window.matchMedia(q)
    const on = () => setM(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [q])
  return m
}

export const useIsMobile = () => useMediaQuery('(max-width: 720px), (max-height: 480px) and (pointer: coarse)')

export function useClock(interval = 1000): Date {
  const [d, setD] = useState(() => new Date())
  useEffect(() => {
    const t = window.setInterval(() => setD(new Date()), interval)
    return () => window.clearInterval(t)
  }, [interval])
  return d
}

export function useOnEscape(active: boolean, fn: () => void) {
  useEffect(() => {
    if (!active) return
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        fn()
      }
    }
    window.addEventListener('keydown', h, true)
    return () => window.removeEventListener('keydown', h, true)
  }, [active, fn])
}

export function useOutside(ref: React.RefObject<HTMLElement | null>, active: boolean, fn: () => void) {
  useEffect(() => {
    if (!active) return
    const h = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) fn()
    }
    window.addEventListener('pointerdown', h, true)
    return () => window.removeEventListener('pointerdown', h, true)
  }, [ref, active, fn])
}

export const fmtDate = (iso: string) =>
  new Date(iso + 'T12:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
