import { useEffect, useState, type RefObject } from 'react'

export interface Size {
  width: number
  height: number
}

/** Observes an element's content box. Returns 0×0 until measured. */
export function useElementSize<T extends HTMLElement>(ref: RefObject<T | null>): Size {
  const [size, setSize] = useState<Size>({ width: 0, height: 0 })
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (!entry) return
      const { width, height } = entry.contentRect
      setSize((prev) => (prev.width === width && prev.height === height ? prev : { width, height }))
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref])
  return size
}

/** Shared lab helpers: a labelled slider row used by every experiment. */
export function formatNumber(value: number, digits = 0): string {
  return value.toFixed(digits)
}
