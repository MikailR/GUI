import { useState } from 'react';
import { modKey } from '../lib/hooks';
import { Glyph } from '../os/icons';
import { ACCENTS, themeForHour, useSettings } from '../os/settings';
import { useOS } from '../os/store';
import type { ThemeName } from '../os/types';
import { Segmented, usePayload } from './shared';

type Pane = 'appearance' | 'motion' | 'keys' | 'system';

const PANES: { id: Pane; label: string; icon: keyof typeof Glyph }[] = [
  { id: 'appearance', label: 'Appearance', icon: 'sun' },
  { id: 'motion', label: 'Dock & Motion', icon: 'sparkle' },
  { id: 'keys', label: 'Keyboard', icon: 'keyboard' },
  { id: 'system', label: 'About System', icon: 'sliders' },
];

export function Settings() {
  const [pane, setPane] = useState<Pane>('appearance');
  usePayload((p) => PANES.some((x) => x.id === p) && setPane(p as Pane));

  return (
    <div className="settings">
      <nav className="settings__nav">
        {PANES.map((p) => {
          const G = Glyph[p.icon];
          return (
            <button key={p.id} className={`side__item ${pane === p.id ? 'is-on' : ''}`} onClick={() => setPane(p.id)}>
              <G /> {p.label}
            </button>
          );
        })}
      </nav>
      <div className="settings__pane" key={pane}>
        {pane === 'appearance' && <Appearance />}
        {pane === 'motion' && <Motion />}
        {pane === 'keys' && <Keys />}
        {pane === 'system' && <System />}
      </div>
    </div>
  );
}

function Appearance() {
  const { settings, set, theme } = useSettings();
  const themes: { id: ThemeName; hint: string }[] = [
    { id: 'dawn', hint: '05–09' },
    { id: 'day', hint: '09–17' },
    { id: 'dusk', hint: '17–21' },
    { id: 'night', hint: '21–05' },
  ];
  return (
    <>
      <h3>Wallpaper</h3>
      <div className="theme-cards">
        {themes.map((t) => (
          <button key={t.id} className={`theme-card ${theme === t.id ? 'is-on' : ''}`} onClick={() => set('theme', t.id)}>
            <span className={`theme-card__sky cc__theme--${t.id}`} />
            <span className="theme-card__name">{t.id}</span>
            <span className="theme-card__hint mono">{t.hint}</span>
          </button>
        ))}
      </div>
      <label className="row">
        <span>
          Follow local time
          <small>Right now that would be “{themeForHour(new Date().getHours())}”.</small>
        </span>
        <Switch checked={settings.theme === 'auto'} onChange={(v) => set('theme', v ? 'auto' : theme)} />
      </label>
      <label className="row">
        <span>
          Survey grid
          <small>Faint map grid behind the contours.</small>
        </span>
        <Switch checked={settings.grid} onChange={(v) => set('grid', v)} />
      </label>
      <h3>Accent</h3>
      <div className="row row--swatches">
        {ACCENTS.map((a) => (
          <button key={a.value} className={`swatch swatch--lg ${settings.accent === a.value ? 'is-on' : ''}`} style={{ background: a.value }} onClick={() => set('accent', a.value)} aria-label={a.name}>
            <span>{a.name}</span>
          </button>
        ))}
      </div>
    </>
  );
}

function Motion() {
  const { settings, set, reducedMotion } = useSettings();
  return (
    <>
      <h3>Motion</h3>
      <div className="row">
        <span>
          Animation
          <small>{reducedMotion ? 'Windows fade instead of zooming; the wallpaper stands still.' : 'Springs, zooms, and a drifting wallpaper.'}</small>
        </span>
        <Segmented
          label="Motion preference"
          value={settings.motion}
          onChange={(v) => set('motion', v)}
          options={[
            { value: 'system', label: 'System' },
            { value: 'full', label: 'Full' },
            { value: 'reduced', label: 'Reduced' },
          ]}
        />
      </div>
      <h3>Dock</h3>
      <label className="row">
        <span>
          Magnification
          <small>Icons swell under the pointer with a cosine falloff.</small>
        </span>
        <Switch checked={settings.magnify} onChange={(v) => set('magnify', v)} />
      </label>
    </>
  );
}

function Keys() {
  const rows: [string[], string][] = [
    [[modKey, 'K'], 'Search everything (also “/”)'],
    [[modKey, '`'], 'Switch windows — hold the modifier, tap to cycle'],
    [['Esc'], 'Close the focused window'],
    [[modKey, 'W'], 'Close the focused window'],
    [[modKey, 'M'], 'Minimize to the dock'],
    [[modKey, '↩'], 'Zoom / restore'],
    [[modKey, '1–7'], 'Open dock app by position'],
    [[modKey, ','], 'Settings'],
    [['↑', '↓', '←', '→'], 'Move between desktop icons'],
    [['↩'], 'Open selected icon'],
  ];
  return (
    <>
      <h3>Keyboard shortcuts</h3>
      <p className="muted">Ctrl works in place of {modKey} too. Browser-reserved combos like ⌘W can’t be captured, so {modKey} is the reliable choice.</p>
      <table className="keys">
        <tbody>
          {rows.map(([k, d]) => (
            <tr key={d + k.join()}>
              <td>
                {k.map((x) => (
                  <kbd key={x}>{x}</kbd>
                ))}
              </td>
              <td>{d}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Gestures</h3>
      <table className="keys">
        <tbody>
          <tr>
            <td>Drag title bar to an edge</td>
            <td>Snap left / right half, or top to maximize</td>
          </tr>
          <tr>
            <td>Double-click title bar</td>
            <td>Zoom</td>
          </tr>
          <tr>
            <td>Right-click desktop</td>
            <td>Context menu</td>
          </tr>
          <tr>
            <td>Phone: swipe up the bar</td>
            <td>Short swipe → app switcher, long swipe → home</td>
          </tr>
        </tbody>
      </table>
    </>
  );
}

function System() {
  const { reset } = useSettings();
  const os = useOS();
  return (
    <>
      <div className="system-hero">
        <div className="system-hero__mark">
          M<span>.os</span>
        </div>
        <div>
          <h3>mikail.os 26.9 “Contour”</h3>
          <p className="muted mono">build {import.meta.env.MODE} · React 19 · Vite · zero UI dependencies</p>
        </div>
      </div>
      <dl className="specs">
        <div>
          <dt>Window manager</dt>
          <dd>useReducer stack, DOM-direct dragging</dd>
        </div>
        <div>
          <dt>Animation</dt>
          <dd>Web Animations API + spring-baked linear()</dd>
        </div>
        <div>
          <dt>Wallpaper</dt>
          <dd>Canvas 2D, simplex noise, marching squares</dd>
        </div>
        <div>
          <dt>Layout</dt>
          <dd>Container queries — apps adapt to window size</dd>
        </div>
      </dl>
      <div className="row row--actions">
        <button
          className="btn btn--ghost"
          onClick={() => {
            reset();
            localStorage.removeItem('mikail.os:icons');
            localStorage.removeItem('mikail.os:sticky');
            os.notify({ title: 'Settings reset', body: 'Back to factory dusk.', app: 'settings' });
          }}
        >
          Reset all settings
        </button>
        <button className="btn" onClick={os.reboot}>
          Restart
        </button>
      </div>
    </>
  );
}

function Switch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button role="switch" aria-checked={checked} className={`switch ${checked ? 'is-on' : ''}`} onClick={(e) => (e.preventDefault(), onChange(!checked))}>
      <i />
    </button>
  );
}
