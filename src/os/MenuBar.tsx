import { useEffect, useRef, useState } from 'react';
import { useNow, modKey } from '../lib/hooks';
import { APPS } from './meta';
import { ACCENTS, useSettings } from './settings';
import { useOS } from './store';
import { AppIcon, Glyph, Logo } from './icons';
import type { AppId, ThemeName } from './types';

interface Item {
  label: string;
  hint?: string;
  checked?: boolean;
  disabled?: boolean;
  icon?: AppId;
  run?: () => void;
}
type Menu = { key: string; label: React.ReactNode; items: (Item | '-')[]; bold?: boolean };

export function MenuBar() {
  const os = useOS();
  const { settings, set, theme } = useSettings();
  const [open, setOpen] = useState<string | null>(null);
  const [cc, setCc] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);
  const now = useNow(10_000);
  const focused = os.state.focused;
  const fw = focused ? os.state.wins[focused] : undefined;

  useEffect(() => {
    if (!open && !cc) return;
    const onDown = (e: PointerEvent) => {
      if (!barRef.current?.contains(e.target as Node)) {
        setOpen(null);
        setCc(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        setOpen(null);
        setCc(false);
      }
    };
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('keydown', onKey, true);
    return () => {
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('keydown', onKey, true);
    };
  }, [open, cc]);

  const themes: ThemeName[] = ['dawn', 'day', 'dusk', 'night'];

  const menus: Menu[] = [
    {
      key: 'logo',
      label: <Logo size={17} />,
      items: [
        { label: 'About This Site', run: () => os.open('about') },
        '-',
        { label: 'Settings…', hint: `${modKey},`, run: () => os.open('settings') },
        { label: 'Keyboard Shortcuts', run: () => os.open('settings', { payload: 'keys' }) },
        '-',
        { label: 'Close All Windows', run: os.closeAll, disabled: !os.state.order.length },
        { label: 'Restart…', run: os.reboot },
      ],
    },
    {
      key: 'app',
      bold: true,
      label: focused ? APPS[focused].short ?? APPS[focused].title : 'Finder',
      items: focused
        ? [
            { label: `About ${APPS[focused].title}`, run: () => os.notify({ title: APPS[focused].title, body: APPS[focused].blurb, app: focused }) },
            '-',
            { label: `Quit ${APPS[focused].short ?? APPS[focused].title}`, hint: `${modKey}W`, run: () => os.close(focused) },
          ]
        : [
            { label: 'Search…', hint: `${modKey}K`, run: () => os.setSpotlight(true) },
            { label: 'Empty Trash…', disabled: settings.trashEmptied, run: () => os.open('trash', { payload: 'empty' }) },
          ],
    },
    {
      key: 'file',
      label: 'File',
      items: [
        { label: 'New Terminal', icon: 'terminal', run: () => os.open('terminal') },
        { label: 'Open Writing', icon: 'writing', run: () => os.open('writing') },
        { label: 'Open Lab', icon: 'lab', run: () => os.open('lab') },
        '-',
        { label: 'Close Window', hint: `${modKey}W  ·  Esc`, disabled: !focused, run: () => focused && os.close(focused) },
      ],
    },
    {
      key: 'view',
      label: 'View',
      items: [
        ...themes.map((t) => ({ label: `${t[0].toUpperCase()}${t.slice(1)} Wallpaper`, checked: settings.theme === t, run: () => set('theme', t) })),
        { label: 'Follow Local Time', checked: settings.theme === 'auto', run: () => set('theme', 'auto') },
        '-',
        { label: 'Survey Grid', checked: settings.grid, run: () => set('grid', !settings.grid) },
        { label: 'Dock Magnification', checked: settings.magnify, run: () => set('magnify', !settings.magnify) },
      ],
    },
    {
      key: 'window',
      label: 'Window',
      items: [
        { label: 'Minimize', hint: `${modKey}M`, disabled: !focused, run: () => focused && os.minimize(focused) },
        { label: fw?.maximized ? 'Restore Size' : 'Zoom', hint: `${modKey}↩`, disabled: !focused, run: () => focused && os.toggleMaximize(focused) },
        { label: 'Cycle Windows', hint: `${modKey}\``, disabled: os.state.order.length < 1, run: () => os.cycle(1) },
        ...(os.state.order.length ? (['-'] as const) : []),
        ...os.state.order.map((id) => ({ label: APPS[id].title, icon: id, checked: id === focused, run: () => os.focus(id) })),
      ],
    },
    {
      key: 'help',
      label: 'Help',
      items: [
        { label: 'Keyboard Shortcuts', run: () => os.open('settings', { payload: 'keys' }) },
        { label: 'Try the Terminal', icon: 'terminal', run: () => os.open('terminal') },
      ],
    },
  ];

  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const date = now.toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short' });

  return (
    <div className="menubar" ref={barRef} role="menubar">
      <div className="menubar__left">
        {menus.map((m) => (
          <div key={m.key} className="menubar__menu">
            <button
              className={`menubar__btn ${m.bold ? 'is-bold' : ''} ${open === m.key ? 'is-open' : ''} ${m.key === 'logo' ? 'is-logo' : ''}`}
              onPointerDown={(e) => {
                e.preventDefault();
                setCc(false);
                setOpen(open === m.key ? null : m.key);
              }}
              onPointerEnter={() => open && open !== m.key && setOpen(m.key)}
              aria-haspopup="menu"
              aria-expanded={open === m.key}
            >
              {m.label}
            </button>
            {open === m.key && (
              <div className="menu glass" role="menu">
                {m.items.map((it, i) =>
                  it === '-' ? (
                    <div key={i} className="menu__sep" />
                  ) : (
                    <button
                      key={i}
                      role="menuitem"
                      className="menu__item"
                      disabled={it.disabled}
                      onClick={() => {
                        setOpen(null);
                        it.run?.();
                      }}
                    >
                      <span className="menu__check">{it.checked ? '✓' : ''}</span>
                      {it.icon && <AppIcon app={it.icon} size={16} />}
                      <span className="menu__label">{it.label}</span>
                      {it.hint && <kbd className="menu__hint">{it.hint}</kbd>}
                    </button>
                  ),
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="menubar__right">
        <span className="menubar__status" title="Online (it's a static site)">
          <Glyph.wifi />
        </span>
        <span className="menubar__status menubar__battery" title="Battery: vibes">
          <Glyph.battery /> <small>87%</small>
        </span>
        <button className="menubar__btn" aria-label="Search" onClick={() => os.setSpotlight(true)}>
          <Glyph.search />
        </button>
        <div className="menubar__menu">
          <button
            className={`menubar__btn ${cc ? 'is-open' : ''}`}
            aria-label="Control Center"
            onPointerDown={(e) => {
              e.preventDefault();
              setOpen(null);
              setCc(!cc);
            }}
          >
            <Glyph.sliders />
          </button>
          {cc && (
            <div className="control-center glass" role="dialog" aria-label="Control Center">
              <div className="cc__tile cc__tile--wide">
                <div className="cc__label">Wallpaper</div>
                <div className="cc__themes">
                  {themes.map((t) => (
                    <button key={t} className={`cc__theme cc__theme--${t} ${theme === t ? 'is-on' : ''}`} onClick={() => set('theme', t)} aria-label={t}>
                      <span>{t}</span>
                    </button>
                  ))}
                </div>
                <label className="cc__row">
                  <input type="checkbox" checked={settings.theme === 'auto'} onChange={(e) => set('theme', e.target.checked ? 'auto' : theme)} />
                  Follow local time
                </label>
              </div>
              <div className="cc__tile">
                <div className="cc__label">Accent</div>
                <div className="cc__accents">
                  {ACCENTS.map((a) => (
                    <button key={a.value} className={`swatch ${settings.accent === a.value ? 'is-on' : ''}`} style={{ background: a.value }} onClick={() => set('accent', a.value)} aria-label={a.name} />
                  ))}
                </div>
              </div>
              <div className="cc__tile">
                <div className="cc__label">Motion</div>
                <button className={`cc__toggle ${settings.motion === 'reduced' ? '' : 'is-on'}`} onClick={() => set('motion', settings.motion === 'reduced' ? 'full' : 'reduced')}>
                  <Glyph.sparkle /> {settings.motion === 'reduced' ? 'Reduced' : 'Full'}
                </button>
              </div>
            </div>
          )}
        </div>
        <button className="menubar__btn menubar__clock" onClick={() => os.open('settings')} aria-label="Date and time">
          <span className="menubar__date">{date}</span>
          <span>{time}</span>
        </button>
      </div>
    </div>
  );
}
