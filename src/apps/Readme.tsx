const MOD = navigator.platform.includes('Mac') ? '⌘' : 'Ctrl+'

const KEYS: [string, string][] = [
  ['Esc', 'Close the focused window'],
  [`${MOD}W`, 'Close window (browsers may grab this — Esc always works)'],
  [`${MOD}M`, 'Minimize to dock'],
  [`${MOD}\``, 'Cycle window focus'],
  [`${MOD}K  /  ${MOD}Space`, 'Search everything'],
  [`${MOD}1…7`, 'Launch the nth dock app'],
  [`${MOD},`, 'System Settings'],
  ['Enter / ↑ ↓', 'Open / move the desktop selection'],
  ['Double-click title', 'Zoom window'],
  ['Right-click', 'Context menus on desktop and icons'],
]

export default function Readme() {
  return (
    <div className="app">
      <div className="app-main scroll">
        <div className="pad" style={{ fontFamily: 'var(--mono)', fontSize: 12.5, lineHeight: 1.7 }}>
          <div style={{ color: 'var(--text-3)' }}># README.txt</div>
          <p style={{ margin: '10px 0 14px' }}>
            This site is a small operating system. Windows drag, resize, minimize into the dock and remember their state. Everything here runs in the browser, there is no server and no login.
          </p>
          <div style={{ color: 'var(--text-3)' }}>## Keyboard</div>
          <table style={{ borderCollapse: 'collapse', margin: '8px 0 16px' }}>
            <tbody>
              {KEYS.map(([k, v]) => (
                <tr key={k}>
                  <td style={{ padding: '3px 16px 3px 0', whiteSpace: 'nowrap' }}><kbd>{k}</kbd></td>
                  <td style={{ padding: '3px 0', color: 'var(--text-2)' }}>{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ color: 'var(--text-3)' }}>## Things to try</div>
          <ul style={{ paddingLeft: 18, margin: '8px 0' }}>
            <li>Drag a box on the desktop to select icons.</li>
            <li>Open Terminal and run <code>neofetch</code>.</li>
            <li>Throw the ball in Lab → Spring toy.</li>
            <li>Change the wallpaper from the View menu.</li>
            <li>Shrink the browser to phone width and watch it become a phone.</li>
          </ul>
          <div style={{ color: 'var(--text-3)', marginTop: 14 }}>— last edited by mikail, today</div>
        </div>
      </div>
    </div>
  )
}
