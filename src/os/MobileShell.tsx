import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { APP_COMPONENTS } from '../apps';
import { profile } from '../content';
import { useNow } from '../lib/hooks';
import { spring } from '../lib/motion';
import { AppIcon, Glyph } from './icons';
import { APPS } from './meta';
import { iconRegistry } from './registry';
import { useSettings } from './settings';
import { Spotlight } from './Spotlight';
import { useOS, WinContext } from './store';
import { Toasts } from './Toasts';
import type { AppId, Rect, Win } from './types';

const HOME_GRID: AppId[] = ['about', 'hackathons', 'writing', 'lab', 'papers', 'terminal', 'settings', 'trash'];
const HOME_DOCK: AppId[] = ['about', 'writing', 'lab', 'terminal'];

function fly(from: Rect, el: HTMLElement) {
  const to = el.getBoundingClientRect();
  const sx = from.w / to.width;
  const sy = from.h / to.height;
  const dx = from.x + from.w / 2 - (to.left + to.width / 2);
  const dy = from.y + from.h / 2 - (to.top + to.height / 2);
  return `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`;
}

function iconRectFor(id: AppId): Rect | null {
  return iconRegistry.rect(`mdock:${id}`) ?? iconRegistry.rect(`home:${id}`);
}

export function MobileShell() {
  const os = useOS();
  const { settings } = useSettings();
  const [switcher, setSwitcher] = useState(false);
  const sheetEls = useRef(new Map<AppId, HTMLElement>());
  const flipFirst = useRef(new Map<AppId, DOMRect>());
  const now = useNow(10_000);
  const active = os.state.focused;

  const launch = (id: AppId, e?: React.MouseEvent) => {
    const r = e ? (e.currentTarget.querySelector('svg') ?? e.currentTarget).getBoundingClientRect() : null;
    setSwitcher(false);
    os.open(id, { origin: r ? { x: r.left, y: r.top, w: r.width, h: r.height } : null });
  };

  const recordFlip = () => {
    flipFirst.current.clear();
    sheetEls.current.forEach((el, id) => flipFirst.current.set(id, el.getBoundingClientRect()));
  };

  const openSwitcher = () => {
    if (!os.state.order.length) return;
    recordFlip();
    setSwitcher(true);
  };

  const pickFromSwitcher = (id: AppId) => {
    recordFlip();
    setSwitcher(false);
    os.focus(id);
  };

  // FLIP between full-screen sheets and switcher cards
  useLayoutEffect(() => {
    if (!flipFirst.current.size) return;
    const firsts = new Map(flipFirst.current);
    flipFirst.current.clear();
    const s = spring(300, 30);
    sheetEls.current.forEach((el, id) => {
      const first = firsts.get(id);
      if (!first || first.width === 0) return;
      const last = el.getBoundingClientRect();
      if (last.width === 0) return;
      const sx = first.width / last.width;
      const dx = first.left - last.left;
      const dy = first.top - last.top;
      el.animate([{ transformOrigin: '0 0', transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${first.height / last.height})` }, { transformOrigin: '0 0', transform: 'none' }], {
        duration: s.duration,
        easing: s.easing,
      });
    });
    if (switcher) {
      const el = active ? sheetEls.current.get(active) : null;
      el?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'instant' as ScrollBehavior });
    }
  }, [switcher, active]);

  useEffect(() => {
    if (switcher && !os.state.order.length) setSwitcher(false);
  }, [switcher, os.state.order.length]);

  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const showHome = !active || switcher;

  return (
    <div className={`mobile ${showHome ? 'is-home' : 'is-app'} ${switcher ? 'is-switching' : ''}`}>
      <div className="m-status">
        <span className="m-status__time">{time}</span>
        <span className="m-status__island" />
        <span className="m-status__icons">
          <Glyph.wifi />
          <Glyph.battery />
        </span>
      </div>

      <main className="m-home" aria-hidden={!showHome}>
        <section className="m-widget glass">
          <div className="m-widget__date">{now.toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long' })}</div>
          <div className="m-widget__hello">
            {profile.name}
            <span> — {profile.role.toLowerCase()}</span>
          </div>
          <div className="m-widget__now">
            {profile.now.slice(0, 2).map((n) => (
              <div key={n.k}>
                <b>{n.k}</b> {n.v}
              </div>
            ))}
          </div>
        </section>

        <div className="m-grid">
          {HOME_GRID.map((id, i) => (
            <button
              key={id}
              className="m-icon"
              style={{ '--i': i } as React.CSSProperties}
              ref={(el) => iconRegistry.set(`home:${id}`, el)}
              onClick={(e) => launch(id, e)}
            >
              <AppIcon app={id} size={60} full={id === 'trash' ? !settings.trashEmptied : undefined} />
              <span>{APPS[id].short ?? APPS[id].title}</span>
              {os.state.wins[id] && <i className="m-icon__dot" />}
            </button>
          ))}
        </div>

        <button className="m-search glass" onClick={() => os.setSpotlight(true)}>
          <Glyph.search /> Search
        </button>

        <nav className="m-dock glass">
          {HOME_DOCK.map((id) => (
            <button key={id} className="m-icon m-icon--dock" ref={(el) => iconRegistry.set(`mdock:${id}`, el)} onClick={(e) => launch(id, e)} aria-label={APPS[id].title}>
              <AppIcon app={id} size={58} />
            </button>
          ))}
        </nav>
      </main>

      <div className={`sheets ${switcher ? 'is-switcher' : ''}`} onClick={(e) => switcher && e.target === e.currentTarget && setSwitcher(false)}>
        {os.state.order.map((id) => (
          <Sheet
            key={id}
            win={os.state.wins[id]!}
            active={id === active}
            switcher={switcher}
            registerEl={(el) => (el ? sheetEls.current.set(id, el) : sheetEls.current.delete(id))}
            onSwitcher={openSwitcher}
            onPick={() => pickFromSwitcher(id)}
          />
        ))}
        {switcher && <div className="sheets__hint">Swipe a card up to quit · tap to open</div>}
      </div>

      <Toasts />
      <Spotlight onOpen={(id, payload) => (setSwitcher(false), os.open(id, { payload }))} />
    </div>
  );
}

interface SheetProps {
  win: Win;
  active: boolean;
  switcher: boolean;
  registerEl: (el: HTMLElement | null) => void;
  onSwitcher: () => void;
  onPick: () => void;
}

function Sheet({ win, active, switcher, registerEl, onSwitcher, onPick }: SheetProps) {
  const os = useOS();
  const { reducedMotion } = useSettings();
  const ref = useRef<HTMLDivElement>(null);
  const App = APP_COMPONENTS[win.id];
  const visible = switcher || (active && !win.minimized);

  // launch animation from the tapped icon
  useLayoutEffect(() => {
    const el = ref.current!;
    if (reducedMotion || !win.origin) {
      el.animate({ opacity: [0, 1] }, { duration: 160 });
      return;
    }
    const s = spring(220, 26);
    el.animate(
      [
        { transform: fly(win.origin, el), borderRadius: '28px', opacity: 0.4 },
        { opacity: 1, offset: 0.25 },
        { transform: 'none', borderRadius: '0px', opacity: 1 },
      ],
      { duration: s.duration, easing: s.easing },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // re-launch from home (was minimized)
  const wasMin = useRef(win.minimized);
  useLayoutEffect(() => {
    if (wasMin.current && !win.minimized && !switcher && !reducedMotion) {
      const el = ref.current!;
      const from = iconRectFor(win.id);
      if (from) {
        const s = spring(240, 26);
        el.animate([{ transform: fly(from, el), borderRadius: '28px', opacity: 0.3 }, { transform: 'none', borderRadius: '0px', opacity: 1 }], { duration: s.duration, easing: s.easing });
      }
    }
    wasMin.current = win.minimized;
  }, [win.minimized, win.id, switcher, reducedMotion]);

  useEffect(() => {
    if (!win.closing) return;
    const el = ref.current!;
    const a = el.animate([{ transform: 'none', opacity: 1 }, { transform: switcher ? 'translateY(-60vh)' : 'scale(.9)', opacity: 0 }], {
      duration: 220,
      easing: 'cubic-bezier(.4,0,1,1)',
      fill: 'forwards',
    });
    a.onfinish = () => os.remove(win.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [win.closing]);

  const goHome = () => {
    const el = ref.current!;
    const to = iconRectFor(win.id);
    if (reducedMotion || !to) return os.home();
    const current = getComputedStyle(el).transform;
    const a = el.animate(
      [
        { transform: current === 'none' ? 'none' : current, borderRadius: '24px', opacity: 1 },
        { transform: fly(to, el), borderRadius: '40px', opacity: 0 },
      ],
      { duration: 340, easing: 'cubic-bezier(.3,0,.2,1)', fill: 'forwards' },
    );
    a.onfinish = () => {
      el.style.transform = '';
      os.home();
      requestAnimationFrame(() => a.cancel());
    };
  };

  // home-indicator gesture: follow the finger, then decide home vs switcher
  const onGrabber = (e: React.PointerEvent) => {
    const el = ref.current!;
    const grab = e.currentTarget as HTMLElement;
    grab.setPointerCapture(e.pointerId);
    const sy = e.clientY;
    const sx = e.clientX;
    let last = { y: sy, t: performance.now() };
    let vy = 0;
    let dy = 0;
    const move = (ev: PointerEvent) => {
      dy = Math.min(0, ev.clientY - sy);
      const dx = (ev.clientX - sx) * 0.6;
      const now = performance.now();
      vy = (ev.clientY - last.y) / Math.max(1, now - last.t);
      last = { y: ev.clientY, t: now };
      const k = Math.min(1, -dy / 500);
      el.style.transition = 'none';
      el.style.transform = `translate(${dx}px, ${dy * 0.7}px) scale(${1 - k * 0.45})`;
      el.style.borderRadius = `${Math.round(k * 60)}px`;
    };
    const up = () => {
      grab.removeEventListener('pointermove', move);
      grab.removeEventListener('pointerup', up);
      grab.removeEventListener('pointercancel', up);
      el.style.borderRadius = '';
      if (dy > -12) {
        el.style.transform = '';
        goHome();
      } else if (dy < -220 || vy < -0.9) {
        goHome();
      } else if (dy < -60) {
        el.style.transform = '';
        onSwitcher();
      } else {
        el.animate([{ transform: el.style.transform }, { transform: 'none' }], { duration: 260, easing: 'cubic-bezier(.2,.9,.3,1.2)' });
        el.style.transform = '';
      }
    };
    grab.addEventListener('pointermove', move);
    grab.addEventListener('pointerup', up);
    grab.addEventListener('pointercancel', up);
  };

  // in the switcher, swipe a card up to quit it
  const onCardPointer = (e: React.PointerEvent) => {
    if (!switcher) return;
    const el = ref.current!;
    const card = e.currentTarget as HTMLElement;
    const sy = e.clientY;
    const sx = e.clientX;
    let dy = 0;
    let decided: 'v' | 'h' | null = null;
    const move = (ev: PointerEvent) => {
      const ddx = ev.clientX - sx;
      const ddy = ev.clientY - sy;
      if (!decided && Math.hypot(ddx, ddy) > 8) {
        decided = Math.abs(ddy) > Math.abs(ddx) && ddy < 0 ? 'v' : 'h';
        if (decided === 'v') card.setPointerCapture(ev.pointerId);
      }
      if (decided !== 'v') return;
      dy = Math.min(0, ddy);
      el.style.transform = `translateY(${dy}px)`;
      el.style.opacity = String(1 + dy / 600);
    };
    const up = () => {
      card.removeEventListener('pointermove', move);
      card.removeEventListener('pointerup', up);
      card.removeEventListener('pointercancel', up);
      if (decided === 'v' && dy < -110) {
        os.close(win.id);
      } else {
        if (decided === 'v') el.animate([{ transform: el.style.transform }, { transform: 'none' }], { duration: 240, easing: 'ease-out' });
        el.style.transform = '';
        el.style.opacity = '';
        if (!decided) onPick();
      }
    };
    card.addEventListener('pointermove', move);
    card.addEventListener('pointerup', up);
    card.addEventListener('pointercancel', up);
  };

  return (
    <div
      ref={(el) => {
        ref.current = el;
        registerEl(el);
      }}
      className={`sheet ${visible ? 'is-visible' : ''} ${active ? 'is-active' : ''}`}
      data-app={win.id}
      aria-hidden={!visible}
      onPointerDown={onCardPointer}
    >
      {switcher && (
        <div className="sheet__card-label">
          <AppIcon app={win.id} size={24} />
          {APPS[win.id].title}
        </div>
      )}
      <div className="sheet__inner" inert={switcher || undefined}>
        <header className="sheet__bar">
          <button className="sheet__bar-btn" onClick={goHome} aria-label="Home">
            <Glyph.chevronLeft />
          </button>
          <div className="sheet__title">
            <AppIcon app={win.id} size={20} />
            {APPS[win.id].title}
          </div>
          <button className="sheet__bar-btn" onClick={onSwitcher} aria-label="Open app switcher">
            <Glyph.grid />
          </button>
          <button className="sheet__bar-btn" onClick={() => os.close(win.id)} aria-label="Quit app">
            <Glyph.close />
          </button>
        </header>
        <div className="sheet__body win__body">
          <WinContext.Provider value={{ id: win.id, payload: win.payload, payloadSeq: win.payloadSeq, mobile: true }}>
            <App />
          </WinContext.Provider>
        </div>
        <div className="sheet__grabber" onPointerDown={onGrabber} role="button" aria-label="Swipe up to go home" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && goHome()}>
          <span />
        </div>
      </div>
    </div>
  );
}
