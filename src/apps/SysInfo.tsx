import { useEffect, useState } from 'react'
import { useOS } from '../os/store'
import { Ico } from '../components/Icons'

const t0 = performance.timeOrigin

export default function SysInfo() {
  const os = useOS()
  const [tick, setTick] = useState(0)
  useEffect(() => {
    const i = window.setInterval(() => setTick((t) => t + 1), 1000)
    return () => window.clearInterval(i)
  }, [])
  const up = Math.floor((Date.now() - t0) / 1000)
  const ua = navigator.userAgent
  const browser = /Firefox\/(\d+)/.exec(ua)?.[0] ?? /Edg\/(\d+)/.exec(ua)?.[0] ?? /Chrome\/(\d+)/.exec(ua)?.[0] ?? /Version\/(\d+).*Safari/.exec(ua)?.[0]?.replace('Version/', 'Safari/') ?? 'a browser'
  const rows: [string, string][] = [
    ['Chip', 'Human, 1 core, frequently throttled'],
    ['Memory', 'TypeScript (mostly)'],
    ['Display', `${window.innerWidth} × ${window.innerHeight} @ ${window.devicePixelRatio}x`],
    ['Browser', browser.replace('/', ' ')],
    ['Uptime', `${Math.floor(up / 60)}m ${up % 60}s`],
    ['Windows', `${os.state.windows.length} open · ${os.state.windows.filter((w) => w.minimized).length} minimized`],
    ['Theme', `${os.state.theme} · ${os.state.wallpaper}`],
  ]
  void tick
  return (
    <div className="app">
      <div className="app-main scroll">
        <div className="pad" style={{ display: 'flex', gap: 22, alignItems: 'flex-start' }}>
          <div style={{ color: 'var(--accent)', flex: 'none' }}><Ico.Logo size={72} /></div>
          <div style={{ minWidth: 0 }}>
            <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>Mikail OS</h1>
            <div style={{ color: 'var(--text-2)', marginBottom: 14 }}>Version 1.0 “Dusk”</div>
            <table style={{ fontSize: 12.5, borderCollapse: 'collapse' }}>
              <tbody>
                {rows.map(([k, v]) => (
                  <tr key={k}>
                    <td style={{ padding: '2px 14px 2px 0', color: 'var(--text-3)', fontWeight: 600, whiteSpace: 'nowrap' }}>{k}</td>
                    <td style={{ padding: '2px 0' }} className="stat">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 16 }}>™ and © 2026 Mikail. All rights reserved, none enforced.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
