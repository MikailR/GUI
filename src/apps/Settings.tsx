import { useOS, type Wallpaper } from '../os/store'

const WALLS: { id: Wallpaper; name: string; note: string }[] = [
  { id: 'dusk', name: 'Dusk', note: 'violet → ember' },
  { id: 'night', name: 'Night', note: 'indigo, pale moon' },
  { id: 'dawn', name: 'Dawn', note: 'blue-grey → gold' },
]

export function Settings() {
  const os = useOS()
  const { settings, wins } = os.state
  return (
    <div className="app settings">
      <header className="app-head">
        <div>
          <p className="eyebrow">system settings</p>
          <h1 className="display sm">
            Make it <em>yours.</em>
          </h1>
        </div>
      </header>

      <section className="set-group">
        <h3>Wallpaper</h3>
        <div className="wall-picker">
          {WALLS.map((w) => (
            <button key={w.id} className={`wall-opt ${settings.wallpaper === w.id ? 'on' : ''}`} onClick={() => os.setSettings({ wallpaper: w.id })}>
              <span className={`wall-swatch ${w.id}`} aria-hidden="true">
                <i />
              </span>
              <span className="wall-name">{w.name}</span>
              <span className="mono dim">{w.note}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="set-group">
        <h3>Motion</h3>
        <label className="switch-row">
          <span>
            Animations
            <small className="dim">Springs, dock magnification, drifting sun</small>
          </span>
          <button role="switch" aria-checked={settings.motion} className={`switch ${settings.motion ? 'on' : ''}`} onClick={() => os.setSettings({ motion: !settings.motion })}>
            <i />
          </button>
        </label>
      </section>

      <section className="set-group">
        <h3>Windows</h3>
        <div className="row wrap">
          <button className="btn" onClick={() => os.tile()}>
            Tile open windows
          </button>
          <button className="btn" onClick={() => os.resetLayout()}>
            Reset layout
          </button>
          <button
            className="btn ghost"
            onClick={() => {
              localStorage.removeItem('mikail-os:v1')
              sessionStorage.removeItem('mikail-os:booted')
              location.reload()
            }}
          >
            Forget everything &amp; reboot
          </button>
        </div>
        <p className="dim small">
          {wins.length} window{wins.length === 1 ? '' : 's'} open. Positions and sizes are saved to this browser only.
        </p>
      </section>

      <section className="set-group">
        <h3>About this OS</h3>
        <dl className="kv">
          <dt>version</dt>
          <dd>Mikail OS 0.1 “Dusk”</dd>
          <dt>kernel</dt>
          <dd>React 19 · Vite · TypeScript</dd>
          <dt>display</dt>
          <dd>
            {window.innerWidth} × {window.innerHeight} @ {window.devicePixelRatio}x
          </dd>
          <dt>uptime</dt>
          <dd>{Math.round(performance.now() / 1000)}s</dd>
        </dl>
      </section>
    </div>
  )
}
