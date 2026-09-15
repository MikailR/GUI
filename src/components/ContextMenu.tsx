import { useCallback, useEffect, useRef, type ReactNode } from 'react'
import { useOnEscape, useOutside } from '../os/hooks'

export interface CtxItem {
  label: string
  hint?: string
  onClick?: () => void
  disabled?: boolean
  sep?: boolean
}

export function ContextMenu({ x, y, items, onClose }: { x: number; y: number; items: CtxItem[]; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  useOutside(ref, true, onClose)
  useOnEscape(true, onClose)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    if (r.right > window.innerWidth) el.style.left = `${Math.max(4, x - r.width)}px`
    if (r.bottom > window.innerHeight) el.style.top = `${Math.max(4, y - r.height)}px`
  }, [x, y])
  const run = useCallback((fn?: () => void) => () => { fn?.(); onClose() }, [onClose])
  return (
    <div className="ctx" ref={ref} style={{ left: x, top: y }} onContextMenu={(e) => e.preventDefault()}>
      {items.map((it, i): ReactNode =>
        it.sep ? (
          <div className="menu-sep" key={i} />
        ) : (
          <button key={i} className="menu-item" disabled={it.disabled} onClick={run(it.onClick)}>
            <span>{it.label}</span>
            {it.hint && <span className="hint">{it.hint}</span>}
          </button>
        ),
      )}
    </div>
  )
}
