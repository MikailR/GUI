import { useEffect } from 'react'

/** Layered CSS wallpaper: dusk gradient, half-set sun, drifting topographic contours, grain. */
export function Wallpaper({ parallax = true }: { parallax?: boolean }) {
  useEffect(() => {
    if (!parallax) return
    let raf = 0
    const root = document.documentElement
    const onMove = (e: PointerEvent) => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        root.style.setProperty('--mx', String((e.clientX / window.innerWidth - 0.5) * 2))
        root.style.setProperty('--my', String((e.clientY / window.innerHeight - 0.5) * 2))
      })
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [parallax])

  return (
    <div className="wall" aria-hidden="true">
      <div className="wall-sky" />
      <div className="wall-sun" />
      <div className="wall-contours" />
      <div className="wall-grain" />
      <div className="wall-vignette" />
    </div>
  )
}
