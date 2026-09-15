import { useState } from 'react'
import { useOS } from '../os/store'
import type { Theme, WallpaperKind } from '../os/types'

const WALLS: { id: WallpaperKind; name: string; css: string }[] = [
  { id: 'aurora', name: 'Aurora', css: 'radial-gradient(circle at 30% 30%, #ff8c3c, transparent 55%), radial-gradient(circle at 70% 70%, #3cc8d2, transparent 55%), radial-gradient(circle at 70% 20%, #5a46e6, transparent 60%), #10101c' },
  { id: 'horizon', name: 'Horizon', css: 'linear-gradient(#07070f 0%, #2a1440 40%, #b5433c 58%, #120a1c 58.5%, #05050a 100%)' },
  { id: 'mono', name: 'Mono', css: 'linear-gradient(135deg, #1a1c26, #0a0a0f)' },
]

export default function Settings() {
  const os = useOS()
  const [tab, setTab] = useState<'appearance' | 'motion' | 'about'>('appearance')
  return (
    <div className="app">
      <div className="app-side">
        <div className="sec">Settings</div>
        <button className={`side-item ${tab === 'appearance' ? 'active' : ''}`} onClick={() => setTab('appearance')}>🎨 Appearance</button>
        <button className={`side-item ${tab === 'motion' ? 'active' : ''}`} onClick={() => setTab('motion')}>🌀 Motion</button>
        <button className={`side-item ${tab === 'about' ? 'active' : ''}`} onClick={() => setTab('about')}>ℹ️ About</button>
      </div>
      <div className="app-main scroll">
        <div className="pad" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {tab === 'appearance' && (
            <>
              <section>
                <h2 style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Theme</h2>
                <div style={{ display: 'flex', gap: 12 }}>
                  {(['dusk', 'dawn'] as Theme[]).map((t) => (
                    <button key={t} onClick={() => os.setTheme(t)} style={{ textAlign: 'left' }}>
                      <div style={{ width: 120, height: 76, borderRadius: 10, border: `2px solid ${os.state.theme === t ? 'var(--accent)' : 'var(--hairline)'}`, background: t === 'dusk' ? '#14121f' : '#f3efe7', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', inset: '18px 20px 12px', borderRadius: 5, background: t === 'dusk' ? 'rgba(40,40,52,.95)' : '#fff', boxShadow: '0 4px 12px rgba(0,0,0,.3)' }}>
                          <div style={{ height: 8, borderRadius: '5px 5px 0 0', background: t === 'dusk' ? '#2c2c38' : '#eee', display: 'flex', gap: 2, padding: 2 }}>
                            <i style={{ width: 4, height: 4, borderRadius: 2, background: '#ff5f57' }} /><i style={{ width: 4, height: 4, borderRadius: 2, background: '#febc2e' }} /><i style={{ width: 4, height: 4, borderRadius: 2, background: '#28c840' }} />
                          </div>
                        </div>
                      </div>
                      <div style={{ fontSize: 12, marginTop: 6, textTransform: 'capitalize', fontWeight: os.state.theme === t ? 600 : 400 }}>{t}</div>
                    </button>
                  ))}
                </div>
              </section>
              <section>
                <h2 style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Wallpaper</h2>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  {WALLS.map((w) => (
                    <button key={w.id} onClick={() => os.setWallpaper(w.id)} style={{ textAlign: 'left' }}>
                      <div style={{ width: 120, height: 76, borderRadius: 10, background: w.css, border: `2px solid ${os.state.wallpaper === w.id ? 'var(--accent)' : 'var(--hairline)'}` }} />
                      <div style={{ fontSize: 12, marginTop: 6, fontWeight: os.state.wallpaper === w.id ? 600 : 400 }}>{w.name}</div>
                    </button>
                  ))}
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 8 }}>All wallpapers are generated live on a canvas. No images were harmed.</p>
              </section>
            </>
          )}
          {tab === 'motion' && (
            <section>
              <label className="card" style={{ display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer' }}>
                <input type="checkbox" checked={os.state.reduceMotion} onChange={(e) => os.setMotion(e.target.checked)} style={{ width: 18, height: 18, accentColor: 'var(--accent)' }} />
                <span>
                  <div style={{ fontWeight: 600 }}>Reduce motion</div>
                  <div style={{ fontSize: 12, color: 'var(--text-2)' }}>Freezes the wallpaper and shortens window animations. Also honours your OS preference.</div>
                </span>
              </label>
              <p style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 12 }}>Motion budget: the dock magnification, window open/close, the genie minimize, sheet transitions on mobile, and the aurora. Everything else is static.</p>
            </section>
          )}
          {tab === 'about' && (
            <section className="card">
              <div style={{ fontWeight: 600 }}>Mikail OS 1.0</div>
              <p style={{ fontSize: 12.5, color: 'var(--text-2)', marginTop: 6, lineHeight: 1.6 }}>
                A personal site pretending to be a computer. Built with React 19, Vite, TypeScript and zero other runtime dependencies. Window manager, dock, spotlight, and wallpapers are all hand-rolled.
              </p>
              <button className="btn small" style={{ marginTop: 10 }} onClick={() => os.open('sysinfo')}>About This Computer</button>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
