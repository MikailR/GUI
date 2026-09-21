import { useCallback, useEffect, useState, useSyncExternalStore } from 'react'
import type { ResolvedAppearance, Settings } from './types'
import { useSettings } from './store'

/* ----------------------------------------------------------- Media query */

export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query)
      mql.addEventListener('change', onChange)
      return () => mql.removeEventListener('change', onChange)
    },
    [query],
  )
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  )
}

export const PHONE_QUERY = '(max-width: 820px)'

export function useIsPhone(): boolean {
  return useMediaQuery(PHONE_QUERY)
}

/* ------------------------------------------------------------ Appearance */

export function useResolvedAppearance(): ResolvedAppearance {
  const { appearance } = useSettings()
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)')
  if (appearance === 'auto') return prefersDark ? 'dark' : 'light'
  return appearance
}

/**
 * Mirrors settings onto <html> as data attributes so CSS tokens can switch
 * without React re-rendering the whole tree.
 */
export function useApplyAppearance(settings: Settings, resolved: ResolvedAppearance): void {
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const prefersReducedTransparency = useMediaQuery('(prefers-reduced-transparency: reduce)')
  useEffect(() => {
    const root = document.documentElement
    root.dataset.appearance = resolved
    root.dataset.accent = settings.accent
    root.dataset.wallpaper = settings.wallpaper
    root.dataset.transparency = settings.reduceTransparency || prefersReducedTransparency ? 'reduced' : 'full'
    root.dataset.motion = settings.reduceMotion || prefersReducedMotion ? 'reduced' : 'full'
    root.style.colorScheme = resolved
    const themeMeta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
    if (themeMeta) themeMeta.content = resolved === 'dark' ? '#0b1020' : '#dbe7ff'
  }, [settings, resolved, prefersReducedMotion, prefersReducedTransparency])
}

/* ------------------------------------------------------------- Viewport */

export interface Viewport {
  w: number
  h: number
}

function readViewport(): Viewport {
  return { w: window.innerWidth, h: window.innerHeight }
}

export function useViewport(): Viewport {
  const [viewport, setViewport] = useState<Viewport>(readViewport)
  useEffect(() => {
    let frame = 0
    const onResize = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => setViewport(readViewport()))
    }
    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', onResize)
    }
  }, [])
  return viewport
}

/* ----------------------------------------------------------------- Clock */

/** Ticks once a minute, aligned to the wall clock. */
export function useClock(): Date {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    let timer = 0
    const schedule = () => {
      const current = new Date()
      setNow(current)
      const msToNextMinute = 60_000 - (current.getSeconds() * 1000 + current.getMilliseconds())
      timer = window.setTimeout(schedule, msToNextMinute + 20)
    }
    schedule()
    return () => window.clearTimeout(timer)
  }, [])
  return now
}

/* -------------------------------------------------------- Escape handler */

export function useEscape(active: boolean, onEscape: () => void): void {
  useEffect(() => {
    if (!active) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onEscape()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active, onEscape])
}

/* --------------------------------------------------------- Click outside */

export function useClickOutside(
  ref: React.RefObject<HTMLElement | null>,
  active: boolean,
  onOutside: () => void,
): void {
  useEffect(() => {
    if (!active) return
    const onPointer = (event: PointerEvent) => {
      const el = ref.current
      if (el && !el.contains(event.target as Node)) onOutside()
    }
    window.addEventListener('pointerdown', onPointer, true)
    return () => window.removeEventListener('pointerdown', onPointer, true)
  }, [ref, active, onOutside])
}
