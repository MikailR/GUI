import { useCallback, useRef, useState, type ReactNode } from 'react'
import { useOS } from '../os/store'
import { APPS } from '../os/apps'
import { useClock, useOutside } from '../os/hooks'
import { Ico } from './Icons'

type MenuKey = 'logo' | 'file' | 'edit' | 'view' | 'window' | 'help' | 'none'

function Item({ label, hint, onClick, disabled, checked }: { label: string; hint?: string; onClick?: () => void; disabled?: boolean; checked?: boolean }) {
  return (
    <button className={`menu-item ${checked ? 'checked' : ''}`} onClick={onClick} disabled={disabled}>
      <span style={{ paddingLeft: checked !== undefined ? 22 : 0 }}>{label}</span>
      {hint && <span className="hint">{hint}</span>}
    </button>
  )
}

export function MenuBar() {
  const os = useOS()
  const [open, setOpen] = useState<MenuKey>('none')
  const ref = useRef<HTMLDivElement>(null)
  const closeMenu = useCallback(() => setOpen('none'), [])
  useOutside(ref, open !== 'none', closeMenu)
  const now = useClock(1000)

  const f = os.focused
  const appName = f ? APPS[f.app].menu ?? APPS[f.app].title : 'Desktop'
  const mod = navigator.platform.includes('Mac') || /iPhone|iPad/.test(navigator.userAgent) ? '⌘' : 'Ctrl+'

  const run = (fn: () => void) => () => {
    fn()
    closeMenu()
  }

  const menu = (key: MenuKey, label: ReactNode, children: ReactNode, cls = '') => (
    <div
      className={`mb-item ${cls} ${open === key ? 'active' : ''}`}
      onPointerDown={(e) => {
        e.preventDefault()
        setOpen(open === key ? 'none' : key)
      }}
      onPointerEnter={() => open !== 'none' && setOpen(key)}
    >
      {label}
      {open === key && <div className="menu-dropdown">{children}</div>}
    </div>
  )

  const live = os.state.windows.filter((w) => !w.minimized)

  return (
    <div className="menubar" ref={ref} onContextMenu={(e) => e.preventDefault()}>
      {menu(
        'logo',
        <Ico.Logo size={15} />,
        <>
          <Item label="About This Computer" onClick={run(() => os.open('sysinfo'))} />
          <div className="menu-sep" />
          <Item label="System Settings…" hint={`${mod},`} onClick={run(() => os.open('settings'))} />
          <div className="menu-sep" />
          <Item label="Sleep" onClick={run(() => os.sleep(true))} />
          <Item label="Restart…" onClick={run(() => os.reboot())} />
          <div className="menu-sep" />
          <Item label="Log Out Mikail…" onClick={run(() => os.toast('No login here', 'It is a personal site. You are already in.', 'about'))} />
        </>,
        'logo',
      )}
      {menu('file', appName, (
        <>
          <Item label="New Terminal" onClick={run(() => os.open('terminal'))} />
          <Item label="Open README" onClick={run(() => os.open('readme'))} />
          <div className="menu-sep" />
          <Item label="Close Window" hint={`${mod}W`} disabled={!f} onClick={run(() => f && os.close(f.id))} />
          <Item label="Close All Windows" disabled={!live.length} onClick={run(() => live.forEach((w) => os.close(w.id)))} />
        </>
      ), 'app')}
      {menu('edit', 'Edit', (
        <>
          <Item label="Undo" hint={`${mod}Z`} disabled />
          <Item label="Redo" hint={`⇧${mod}Z`} disabled />
          <div className="menu-sep" />
          <Item label="Cut" hint={`${mod}X`} disabled />
          <Item label="Copy" hint={`${mod}C`} disabled />
          <Item label="Paste" hint={`${mod}V`} disabled />
          <div className="menu-sep" />
          <Item label="Search…" hint={`${mod}K`} onClick={run(() => os.setSpotlight(true))} />
        </>
      ))}
      {menu('view', 'View', (
        <>
          <Item label="Dusk" checked={os.state.theme === 'dusk'} onClick={run(() => os.setTheme('dusk'))} />
          <Item label="Dawn" checked={os.state.theme === 'dawn'} onClick={run(() => os.setTheme('dawn'))} />
          <div className="menu-sep" />
          <Item label="Aurora wallpaper" checked={os.state.wallpaper === 'aurora'} onClick={run(() => os.setWallpaper('aurora'))} />
          <Item label="Horizon wallpaper" checked={os.state.wallpaper === 'horizon'} onClick={run(() => os.setWallpaper('horizon'))} />
          <Item label="Mono wallpaper" checked={os.state.wallpaper === 'mono'} onClick={run(() => os.setWallpaper('mono'))} />
          <div className="menu-sep" />
          <Item label="Reduce Motion" checked={os.state.reduceMotion} onClick={run(() => os.setMotion(!os.state.reduceMotion))} />
        </>
      ))}
      {menu('window', 'Window', (
        <>
          <Item label="Minimize" hint={`${mod}M`} disabled={!f} onClick={run(() => f && os.minimize(f.id))} />
          <Item label="Zoom" disabled={!f} onClick={run(() => f && os.toggleMax(f.id))} />
          <Item label="Cycle Windows" hint={`${mod}\``} disabled={live.length < 2} onClick={run(() => os.cycleFocus())} />
          <div className="menu-sep" />
          <Item label="Bring All to Front" disabled={!os.state.windows.length} onClick={run(() => os.state.windows.forEach((w) => w.minimized && os.restore(w.id)))} />
          {os.state.windows.length > 0 && <div className="menu-sep" />}
          {os.state.windows.map((w) => (
            <Item key={w.id} label={(w.minimized ? '◇ ' : '') + APPS[w.app].title} checked={f?.id === w.id} onClick={run(() => (w.minimized ? os.restore(w.id) : os.focus(w.id)))} />
          ))}
        </>
      ))}
      {menu('help', 'Help', (
        <>
          <Item label="Keyboard Shortcuts" onClick={run(() => os.open('readme'))} />
          <Item label="Search" hint={`${mod}K`} onClick={run(() => os.setSpotlight(true))} />
          <div className="menu-sep" />
          <Item label="Report a bug…" onClick={run(() => os.toast('Thanks!', 'Filed under Trash → jquery-plugin-ideas.', 'trash'))} />
        </>
      ))}
      <div className="menubar-spacer" />
      <div className="mb-right">
        <button className="mb-item" onClick={() => os.setTheme(os.state.theme === 'dusk' ? 'dawn' : 'dusk')} title="Toggle theme" aria-label="Toggle theme">
          {os.state.theme === 'dusk' ? <Ico.Moon /> : <Ico.Sun />}
        </button>
        <button className="mb-item" onClick={() => os.setSpotlight(true)} title="Search (⌘K)" aria-label="Search">
          <Ico.Search size={15} />
        </button>
        <span className="mb-item" title="Wi-Fi: connected to somewhere nice">
          <Ico.Wifi />
        </span>
        <span className="mb-item" title="Battery: it is a website, it will be fine">
          <Ico.Battery pct={0.82} />
        </span>
        <span className="mb-item">
          {now.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
          &nbsp;&nbsp;
          {now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  )
}
