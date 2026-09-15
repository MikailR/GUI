import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { APP_COMPONENTS } from '../apps';
import { loadRaw, save } from '../lib/storage';
import { modKey } from '../lib/hooks';
import { Dock } from './Dock';
import { AppIcon } from './icons';
import { MenuBar } from './MenuBar';
import { APPS, DESKTOP_ICONS, DOCK_APPS } from './meta';
import { iconRegistry } from './registry';
import { useSettings } from './settings';
import { Spotlight } from './Spotlight';
import { MENUBAR_H, useOS } from './store';
import { Toasts } from './Toasts';
import type { AppId, Rect } from './types';
import { Window, type SnapZone } from './Window';

const CELL_W = 96;
const CELL_H = 104;
type GridPos = { c: number; r: number };

function defaultPositions(): Record<string, GridPos> {
  return Object.fromEntries(DESKTOP_ICONS.map((id, i) => [id, { c: 0, r: i }]));
}

function toPx(p: GridPos) {
  return { x: window.innerWidth - (p.c + 1) * CELL_W - 12, y: MENUBAR_H + 14 + p.r * CELL_H };
}

function intersects(a: Rect, b: Rect) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

export function Desktop() {
  const os = useOS();
  const { settings, set, theme } = useSettings();
  const [positions, setPositions] = useState<Record<string, GridPos>>(() => ({ ...defaultPositions(), ...loadRaw('icons', {}) }));
  const [selected, setSelected] = useState<Set<AppId>>(new Set());
  const [drag, setDrag] = useState<{ dx: number; dy: number } | null>(null);
  const [lasso, setLasso] = useState<Rect | null>(null);
  const [ctx, setCtx] = useState<{ x: number; y: number } | null>(null);
  const [snap, setSnap] = useState<SnapZone>(null);
  const [switcher, setSwitcher] = useState<{ list: AppId[]; index: number } | null>(null);
  const [, forceLayout] = useState(0);
  const iconEls = useRef(new Map<AppId, HTMLElement>());
  const switcherRef = useRef(switcher);
  switcherRef.current = switcher;

  useEffect(() => save('icons', positions), [positions]);
  useEffect(() => {
    const onResize = () => forceLayout((n) => n + 1);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const openFromIcon = useCallback(
    (id: AppId, payload?: string) => {
      const el = iconEls.current.get(id)?.querySelector('svg');
      const r = el?.getBoundingClientRect();
      os.open(id, { origin: r ? { x: r.left, y: r.top, w: r.width, h: r.height } : null, payload });
    },
    [os],
  );

  // ---------- keyboard shortcuts ----------
  useEffect(() => {
    const typing = (el: Element | null) => el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement;
    const onKey = (e: KeyboardEvent) => {
      const mod = e.altKey || e.ctrlKey || e.metaKey;
      const { focused, order, wins } = os.state;

      if ((e.code === 'KeyK' && mod) || (e.key === '/' && !typing(document.activeElement))) {
        e.preventDefault();
        os.setSpotlight(!os.spotlight);
        return;
      }
      if (os.spotlight) return;

      if (e.code === 'Backquote' && (e.altKey || e.ctrlKey)) {
        e.preventDefault();
        const cur = switcherRef.current;
        const dir = e.shiftKey ? -1 : 1;
        if (cur) {
          setSwitcher({ ...cur, index: (cur.index + dir + cur.list.length) % cur.list.length });
        } else {
          const list = [...order].reverse().filter((id) => !wins[id]?.closing);
          if (!list.length) return;
          setSwitcher({ list, index: list.length > 1 ? (dir === 1 ? 1 : list.length - 1) : 0 });
        }
        return;
      }
      if (e.key === 'Escape') {
        if (ctx) return setCtx(null);
        const ae = document.activeElement;
        if (typing(ae) && (ae as HTMLInputElement).value) return;
        if (focused) {
          e.preventDefault();
          os.close(focused);
        } else if (selected.size) setSelected(new Set());
        return;
      }
      if (mod && e.code === 'KeyW' && focused) {
        e.preventDefault();
        os.close(focused);
        return;
      }
      if (e.altKey && e.code === 'KeyM' && focused) {
        e.preventDefault();
        os.minimize(focused);
        return;
      }
      if (e.altKey && e.key === 'Enter' && focused) {
        e.preventDefault();
        os.toggleMaximize(focused);
        return;
      }
      if (e.altKey && e.code === 'Comma') {
        e.preventDefault();
        os.open('settings');
        return;
      }
      if (e.altKey && /^Digit[1-7]$/.test(e.code)) {
        e.preventDefault();
        os.open(DOCK_APPS[Number(e.code.slice(5)) - 1]);
        return;
      }
      // desktop icon navigation when nothing is focused
      if (!focused && !typing(document.activeElement)) {
        const arrows: Record<string, [number, number]> = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [1, 0], ArrowRight: [-1, 0] };
        if (e.key in arrows) {
          e.preventDefault();
          const [dc, dr] = arrows[e.key];
          const cur = [...selected][0];
          if (!cur) return setSelected(new Set([DESKTOP_ICONS[0]]));
          const p = positions[cur];
          let best: AppId | null = null;
          let bestD = Infinity;
          for (const id of DESKTOP_ICONS) {
            const q = positions[id];
            const vc = q.c - p.c;
            const vr = q.r - p.r;
            if (id === cur || vc * dc + vr * dr <= 0) continue;
            const d = Math.abs(vc) + Math.abs(vr) + (dc ? Math.abs(vr) * 2 : Math.abs(vc) * 2);
            if (d < bestD) (bestD = d), (best = id);
          }
          if (best) setSelected(new Set([best]));
        } else if (e.key === 'Enter' && selected.size) {
          e.preventDefault();
          selected.forEach((id) => openFromIcon(id));
        }
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      const cur = switcherRef.current;
      if (cur && (e.key === 'Alt' || e.key === 'Control')) {
        os.focus(cur.list[cur.index]);
        setSwitcher(null);
      }
    };
    const onBlur = () => setSwitcher(null);
    window.addEventListener('keydown', onKey);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', onBlur);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', onBlur);
    };
  }, [os, ctx, selected, positions, openFromIcon]);

  // ---------- icon drag / lasso ----------
  const onIconPointerDown = (id: AppId) => (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    e.stopPropagation();
    setCtx(null);
    let sel = selected;
    if (e.shiftKey || e.metaKey) {
      sel = new Set(selected);
      sel.has(id) ? sel.delete(id) : sel.add(id);
    } else if (!selected.has(id)) {
      sel = new Set([id]);
    }
    setSelected(sel);
    const el = e.currentTarget as HTMLElement;
    el.setPointerCapture(e.pointerId);
    const sx = e.clientX;
    const sy = e.clientY;
    let moved = false;
    const move = (ev: PointerEvent) => {
      const dx = ev.clientX - sx;
      const dy = ev.clientY - sy;
      if (!moved && Math.hypot(dx, dy) < 5) return;
      moved = true;
      setDrag({ dx, dy });
    };
    const up = (ev: PointerEvent) => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up);
      setDrag(null);
      if (!moved) return;
      const dc = -Math.round((ev.clientX - sx) / CELL_W);
      const dr = Math.round((ev.clientY - sy) / CELL_H);
      setPositions((prev) => {
        const next = { ...prev };
        const maxC = Math.max(0, Math.floor((window.innerWidth - 24) / CELL_W) - 1);
        const maxR = Math.max(0, Math.floor((window.innerHeight - MENUBAR_H - 110) / CELL_H) - 1);
        const taken = new Set(Object.entries(prev).filter(([k]) => !sel.has(k as AppId)).map(([, p]) => `${p.c}:${p.r}`));
        for (const sid of sel) {
          let c = Math.min(maxC, Math.max(0, prev[sid].c + dc));
          let r = Math.min(maxR, Math.max(0, prev[sid].r + dr));
          // walk down, then left, until a free cell turns up
          while (taken.has(`${c}:${r}`)) {
            r++;
            if (r > maxR) (r = 0), (c = (c + 1) % (maxC + 1));
          }
          taken.add(`${c}:${r}`);
          next[sid] = { c, r };
        }
        return next;
      });
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
  };

  const onSurfacePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0 || e.target !== e.currentTarget) return;
    setCtx(null);
    setSelected(new Set());
    const el = e.currentTarget as HTMLElement;
    el.setPointerCapture(e.pointerId);
    const sx = e.clientX;
    const sy = e.clientY;
    const move = (ev: PointerEvent) => {
      const r = { x: Math.min(sx, ev.clientX), y: Math.min(sy, ev.clientY), w: Math.abs(ev.clientX - sx), h: Math.abs(ev.clientY - sy) };
      setLasso(r);
      const hit = new Set<AppId>();
      iconEls.current.forEach((node, id) => {
        const b = node.getBoundingClientRect();
        if (intersects(r, { x: b.left, y: b.top, w: b.width, h: b.height })) hit.add(id);
      });
      setSelected(hit);
    };
    const up = () => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up);
      setLasso(null);
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
  };

  const snapStyle = useMemo(() => {
    if (!snap) return null;
    const pad = 8;
    const h = window.innerHeight - MENUBAR_H - 92;
    const half = (window.innerWidth - pad * 3) / 2;
    if (snap === 'max') return { transform: `translate(0px, ${MENUBAR_H}px)`, width: window.innerWidth, height: h };
    return { transform: `translate(${snap === 'left' ? pad : pad * 2 + half}px, ${MENUBAR_H + pad}px)`, width: half, height: h - pad * 2 };
  }, [snap]);

  const ctxItems: { label: string; run: () => void; checked?: boolean; sep?: boolean }[] = [
    { label: 'Open Terminal Here', run: () => os.open('terminal', { origin: ctx ? { x: ctx.x, y: ctx.y, w: 1, h: 1 } : null }) },
    { label: 'Search…', run: () => os.setSpotlight(true) },
    { label: 'Clean Up Icons', run: () => setPositions(defaultPositions()), sep: true },
    ...(['dawn', 'day', 'dusk', 'night'] as const).map((t, i) => ({
      label: `${t[0].toUpperCase()}${t.slice(1)}`,
      checked: theme === t,
      run: () => set('theme', t),
      sep: i === 0,
    })),
    { label: settings.stickyDismissed ? 'Show Welcome Note' : 'Hide Welcome Note', run: () => set('stickyDismissed', !settings.stickyDismissed), sep: true },
    { label: 'Change Wallpaper Settings…', run: () => os.open('lab', { payload: 'x-wallpaper' }) },
  ];

  return (
    <div className="desktop">
      <MenuBar />
      <div
        className="desktop__surface"
        onPointerDown={onSurfacePointerDown}
        onContextMenu={(e) => {
          if (e.target !== e.currentTarget) return;
          e.preventDefault();
          setCtx({ x: Math.min(e.clientX, window.innerWidth - 240), y: Math.min(e.clientY, window.innerHeight - 320) });
        }}
      >
        {DESKTOP_ICONS.map((id) => {
          const p = toPx(positions[id] ?? { c: 0, r: 0 });
          const isSel = selected.has(id);
          const offset = drag && isSel ? drag : { dx: 0, dy: 0 };
          return (
            <button
              key={id}
              ref={(el) => {
                if (el) iconEls.current.set(id, el);
                else iconEls.current.delete(id);
                iconRegistry.set(`desk:${id}`, el);
              }}
              className={`desk-icon ${isSel ? 'is-selected' : ''} ${drag && isSel ? 'is-dragging' : ''} ${os.state.wins[id] ? 'is-open' : ''}`}
              style={{ transform: `translate(${p.x + offset.dx}px, ${p.y + offset.dy}px)` }}
              onPointerDown={onIconPointerDown(id)}
              onDoubleClick={() => openFromIcon(id)}
              onKeyDown={(e) => e.key === ' ' && openFromIcon(id)}
              aria-label={`Open ${APPS[id].title}`}
            >
              <AppIcon app={id} size={58} full={id === 'trash' ? !settings.trashEmptied : undefined} />
              <span className="desk-icon__label">{APPS[id].short ?? APPS[id].title}</span>
            </button>
          );
        })}

        {!settings.stickyDismissed && <Sticky onClose={() => set('stickyDismissed', true)} onOpen={openFromIcon} />}
        {lasso && <div className="lasso" style={{ transform: `translate(${lasso.x}px, ${lasso.y}px)`, width: lasso.w, height: lasso.h }} />}
      </div>

      {snapStyle && <div className="snap-preview" style={snapStyle} />}

      {os.state.order.map((id, i) => {
        const win = os.state.wins[id]!;
        const App = APP_COMPONENTS[id];
        return (
          <Window key={id} win={win} z={100 + i} focused={os.state.focused === id} onSnapPreview={setSnap}>
            <App />
          </Window>
        );
      })}

      {ctx && (
        <div className="menu glass ctx-menu" style={{ left: ctx.x, top: ctx.y }} role="menu" onPointerDown={(e) => e.stopPropagation()}>
          {ctxItems.map((it) => (
            <div key={it.label}>
              {it.sep && <div className="menu__sep" />}
              <button
                className="menu__item"
                role="menuitem"
                onClick={() => {
                  setCtx(null);
                  it.run();
                }}
              >
                <span className="menu__check">{it.checked ? '✓' : ''}</span>
                <span className="menu__label">{it.label}</span>
              </button>
            </div>
          ))}
        </div>
      )}
      {ctx && <div className="ctx-scrim" onPointerDown={() => setCtx(null)} onContextMenu={(e) => (e.preventDefault(), setCtx(null))} />}

      {switcher && (
        <div className="switcher glass" role="listbox" aria-label="Window switcher">
          <div className="switcher__row">
            {switcher.list.map((id, i) => (
              <div key={id} className={`switcher__item ${i === switcher.index ? 'is-on' : ''}`} role="option" aria-selected={i === switcher.index}>
                <AppIcon app={id} size={64} />
              </div>
            ))}
          </div>
          <div className="switcher__name">{APPS[switcher.list[switcher.index]].title}</div>
        </div>
      )}

      <Dock />
      <Toasts />
      <Spotlight onOpen={(id, payload) => (iconEls.current.has(id) ? openFromIcon(id, payload) : os.open(id, { payload }))} />
    </div>
  );
}

function Sticky({ onClose, onOpen }: { onClose: () => void; onOpen: (id: AppId) => void }) {
  const [pos, setPos] = useState(() => loadRaw('sticky', { x: 48, y: MENUBAR_H + 40 }));
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => save('sticky', pos), [pos]);

  const onDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    e.stopPropagation();
    const el = e.currentTarget as HTMLElement;
    el.setPointerCapture(e.pointerId);
    const sx = e.clientX - pos.x;
    const sy = e.clientY - pos.y;
    const move = (ev: PointerEvent) =>
      setPos({ x: Math.max(0, Math.min(window.innerWidth - 240, ev.clientX - sx)), y: Math.max(MENUBAR_H, Math.min(window.innerHeight - 200, ev.clientY - sy)) });
    const up = () => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up);
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
  };

  return (
    <div ref={ref} className="sticky" style={{ transform: `translate(${pos.x}px, ${pos.y}px) rotate(-1.5deg)` }} onPointerDown={onDown}>
      <button className="sticky__close" onClick={onClose} aria-label="Dismiss note">
        ×
      </button>
      <p className="sticky__hello">Hi, I’m Mikail.</p>
      <p>I build interfaces for a living. This site is a tiny OS — poke around.</p>
      <ul>
        <li>
          Double-click <button className="linkish" onClick={() => onOpen('about')}>About</button> to start
        </li>
        <li>
          <kbd>{modKey}</kbd> <kbd>K</kbd> search everything
        </li>
        <li>
          <kbd>{modKey}</kbd> <kbd>`</kbd> switch windows · <kbd>Esc</kbd> close
        </li>
        <li>Drag a window to a screen edge to snap</li>
        <li>
          Try <code>neofetch</code> in <button className="linkish" onClick={() => onOpen('terminal')}>Terminal</button>
        </li>
      </ul>
    </div>
  );
}
