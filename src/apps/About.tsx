import { ABOUT } from '../content/data'
import { useOS } from '../os/store'

export default function About() {
  const os = useOS()
  return (
    <div className="app">
      <div className="app-main scroll">
        <div className="pad" style={{ display: 'flex', gap: 28, flexWrap: 'wrap' }}>
          <div style={{ flex: '0 0 auto' }}>
            <div className="avatar" aria-hidden="true">
              <svg width="112" height="112" viewBox="0 0 112 112">
                <defs>
                  <radialGradient id="av" cx="35%" cy="30%" r="80%">
                    <stop offset="0" stopColor="#ffd08a" />
                    <stop offset="0.55" stopColor="#ff6f91" />
                    <stop offset="1" stopColor="#5b3bff" />
                  </radialGradient>
                </defs>
                <circle cx="56" cy="56" r="54" fill="url(#av)" />
                <circle cx="56" cy="56" r="54" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />
                <text x="56" y="70" textAnchor="middle" fontSize="42" fontWeight="700" fill="#fff" fontFamily="var(--font)" letterSpacing="-2">M.</text>
              </svg>
            </div>
            <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {ABOUT.links.map((l) => (
                <a key={l.label} href={l.href} target="_blank" rel="noreferrer" className="chip" style={{ justifyContent: 'center' }}>{l.label} ↗</a>
              ))}
              <button className="chip" onClick={() => os.open('terminal')} style={{ justifyContent: 'center' }}>$ terminal</button>
            </div>
          </div>
          <div className="prose" style={{ flex: '1 1 320px', minWidth: 0 }}>
            <h1>{ABOUT.name}</h1>
            <div className="meta" style={{ marginBottom: 16 }}>
              <span>{ABOUT.role}</span>·<span>{ABOUT.location}</span>
            </div>
            <p className="lede">{ABOUT.tagline}</p>
            {ABOUT.bio.map((p, i) => <p key={i}>{p}</p>)}
            <h2>Now</h2>
            <ul>{ABOUT.now.map((n) => <li key={n}>{n}</li>)}</ul>
            <h2>Toolbox</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
              {ABOUT.skills.map((s) => <span key={s} className="chip">{s}</span>)}
            </div>
            <h2>Around here</h2>
            <p>
              Try <button className="chip accent" onClick={() => os.open('lab')}>Lab</button> for things that move,{' '}
              <button className="chip accent" onClick={() => os.open('writing')}>Writing</button> for things I think, and{' '}
              <button className="chip accent" onClick={() => os.open('trash')}>Trash</button> for things I regret.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
