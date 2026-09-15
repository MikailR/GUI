import { useOS } from '../os/store'
import { useNow } from '../os/Clock'

export function About() {
  const os = useOS()
  const now = useNow(60_000)
  const hour = now.getHours()
  const greeting = hour < 5 ? 'Still up?' : hour < 12 ? 'Good morning.' : hour < 18 ? 'Good afternoon.' : 'Good evening.'

  return (
    <div className="app about">
      <p className="eyebrow">{greeting} · about.md</p>
      <h1 className="display">
        Mikail builds <em>interfaces</em> that feel like places.
      </h1>
      <p className="lede">
        Front-end engineer. I care about motion that explains, typography that breathes, and software that remembers where you left your windows.
        This site is a small argument for all three.
      </p>

      <div className="about-grid">
        <dl className="kv">
          <dt>location</dt>
          <dd>Lisbon · UTC+1</dd>
          <dt>currently</dt>
          <dd>Design-engineering at a small studio, shipping tools for people who make things</dd>
          <dt>stack</dt>
          <dd>React, TypeScript, WebGL, a little Rust on weekends</dd>
          <dt>typing</dt>
          <dd>Colemak, badly</dd>
          <dt>status</dt>
          <dd>
            <span className="status-dot" /> open to interesting problems
          </dd>
        </dl>
        <div className="about-now">
          <div className="eyebrow">now</div>
          <ul className="plain">
            <li>Rebuilding my note-taking app as a tiling window manager for text.</li>
            <li>Reading everything Jef Raskin wrote, in order.</li>
            <li>Learning to bake a loaf that is not a brick.</li>
          </ul>
        </div>
      </div>

      <div className="row wrap">
        <button className="btn accent" onClick={() => os.open('hackathons')}>
          Hackathons →
        </button>
        <button className="btn" onClick={() => os.open('writing')}>
          Writing
        </button>
        <button className="btn" onClick={() => os.open('lab')}>
          Lab
        </button>
        <button className="btn ghost" onClick={() => os.open('terminal')}>
          or open a terminal
        </button>
      </div>

      <footer className="about-foot">
        <span className="mono">mikail@os</span>
        <span className="mono">v0.1 · built with Vite, React and one wallpaper</span>
      </footer>
    </div>
  )
}
