import { useCallback, type PointerEvent } from 'react'

/**
 * Returns pointer handlers that write --mx/--my (percentages) onto the target
 * so `.glass-caustic::after` can follow the cursor. No React state involved.
 */
export function useCaustic() {
  const onPointerMove = useCallback((event: PointerEvent<HTMLElement>) => {
    const el = event.currentTarget
    const rect = el.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 100
    const y = ((event.clientY - rect.top) / rect.height) * 100
    el.style.setProperty('--mx', `${x.toFixed(1)}%`)
    el.style.setProperty('--my', `${y.toFixed(1)}%`)
  }, [])
  return { onPointerMove }
}
