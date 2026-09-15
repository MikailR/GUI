import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { experiments, type Experiment } from '../content';
import { spring } from '../lib/motion';
import { Glyph } from '../os/icons';
import { DEFAULT_WALLPAPER, useSettings } from '../os/settings';
import { ContourArt, usePayload } from './shared';

export function Lab() {
  const [open, setOpen] = useState<string | null>(null);
  usePayload((p) => experiments.some((x) => x.id === p) && setOpen(p));
  const exp = experiments.find((x) => x.id === open);

  if (exp) return <Detail exp={exp} onBack={() => setOpen(null)} />;

  return (
    <div className="lab">
      <header className="lab__head">
        <div>
          <h2>Lab</h2>
          <p>Small experiments. Some of them grew up into real features; most are just fun to touch.</p>
        </div>
        <span className="lab__count mono">{experiments.length} specimens</span>
      </header>
      <div className="lab__grid">
        {experiments.map((x, i) => (
          <button key={x.id} className={`lab-card ${x.demo ? 'is-live' : ''}`} style={{ '--i': i } as React.CSSProperties} onClick={() => setOpen(x.id)}>
            <div className="lab-card__stage">
              {x.demo ? <DemoPreview kind={x.demo} /> : <ContourArt seed={x.id} hue={x.id === 'x-dither' ? 30 : 300} />}
              {x.demo ? <span className="lab-card__live">live</span> : <span className="lab-card__live is-archived">archived</span>}
            </div>
            <div className="lab-card__body">
              <strong>{x.title}</strong>
              <span className="mono">{x.year}</span>
            </div>
            <p>{x.blurb}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

function DemoPreview({ kind }: { kind: NonNullable<Experiment['demo']> }) {
  switch (kind) {
    case 'spring':
      return <SpringDemo auto />;
    case 'goo':
      return <GooDemo auto />;
    case 'flip':
      return <FlipDemo auto />;
    case 'wallpaper':
      return <div className="wp-thumb" />;
  }
}

function Detail({ exp, onBack }: { exp: Experiment; onBack: () => void }) {
  return (
    <div className="lab-detail">
      <div className="toolbar">
        <button className="btn btn--ghost" onClick={onBack}>
          <Glyph.chevronLeft /> Lab
        </button>
        <strong className="toolbar__title">{exp.title}</strong>
        <div className="toolbar__spacer" />
        <div className="chips">
          {exp.tags.map((t) => (
            <span className="chip" key={t}>
              {t}
            </span>
          ))}
        </div>
      </div>
      <p className="lab-detail__blurb">{exp.blurb}</p>
      <div className="lab-detail__stage">
        {exp.demo === 'spring' && <SpringDemo />}
        {exp.demo === 'goo' && <GooDemo />}
        {exp.demo === 'flip' && <FlipDemo />}
        {exp.demo === 'wallpaper' && <WallpaperTuner />}
        {!exp.demo && (
          <div className="archived">
            <ContourArt seed={exp.id} hue={200} />
            <p>This one needs a camera or microphone, so it lives on in a video. Recording coming soon.</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------- Spring tuner ---------------- */
function SpringDemo({ auto }: { auto?: boolean }) {
  const [k, setK] = useState(170);
  const [c, setC] = useState(12);
  const stageRef = useRef<HTMLDivElement>(null);
  const puckRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPolylineElement>(null);
  const params = useRef({ k, c });
  params.current = { k, c };
  const sim = useRef({ x: 0, y: 0, vx: 0, vy: 0, held: false, hist: [] as number[] });

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    let pluck = 0;
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      const s = sim.current;
      if (auto && !s.held) {
        pluck += dt;
        if (pluck > 2.2) {
          pluck = 0;
          s.x = (Math.random() - 0.5) * 90;
          s.y = -30 - Math.random() * 20;
        }
      }
      if (!s.held) {
        const { k: K, c: C } = params.current;
        for (let i = 0; i < 4; i++) {
          const h = dt / 4;
          s.vx += (-K * s.x - C * s.vx) * h;
          s.vy += (-K * s.y - C * s.vy) * h;
          s.x += s.vx * h;
          s.y += s.vy * h;
        }
      }
      s.hist.push(s.x);
      if (s.hist.length > 140) s.hist.shift();
      if (puckRef.current) puckRef.current.style.transform = `translate(${s.x}px, ${s.y}px)`;
      if (pathRef.current) pathRef.current.setAttribute('points', s.hist.map((v, i) => `${i * 2},${40 + v * 0.3}`).join(' '));
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [auto]);

  const onDown = (e: React.PointerEvent) => {
    if (auto) return;
    const stage = stageRef.current!.getBoundingClientRect();
    const cx = stage.left + stage.width / 2;
    const cy = stage.top + stage.height / 2;
    const el = e.currentTarget as HTMLElement;
    el.setPointerCapture(e.pointerId);
    const s = sim.current;
    s.held = true;
    const move = (ev: PointerEvent) => {
      const nx = Math.max(-stage.width / 2 + 20, Math.min(stage.width / 2 - 20, ev.clientX - cx));
      const ny = Math.max(-stage.height / 2 + 20, Math.min(stage.height / 2 - 20, ev.clientY - cy));
      s.vx = (nx - s.x) * 30;
      s.vy = (ny - s.y) * 30;
      s.x = nx;
      s.y = ny;
    };
    const up = () => {
      s.held = false;
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up);
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
  };

  const zeta = c / (2 * Math.sqrt(k));
  return (
    <div className={`spring-demo ${auto ? 'is-auto' : ''}`}>
      <div className="spring-demo__stage" ref={stageRef}>
        <svg className="spring-demo__graph" viewBox="0 0 280 80" preserveAspectRatio="none" aria-hidden>
          <line x1="0" x2="280" y1="40" y2="40" />
          <polyline ref={pathRef} />
        </svg>
        <div className="spring-demo__anchor" />
        <div className="spring-demo__puck" ref={puckRef} onPointerDown={onDown} role="slider" aria-label="Spring puck — drag and release" aria-valuenow={0} tabIndex={auto ? -1 : 0} />
      </div>
      {!auto && (
        <div className="controls">
          <label>
            <span>Stiffness</span>
            <input type="range" min="20" max="400" value={k} onChange={(e) => setK(+e.target.value)} />
            <output className="mono">{k}</output>
          </label>
          <label>
            <span>Damping</span>
            <input type="range" min="1" max="40" value={c} onChange={(e) => setC(+e.target.value)} />
            <output className="mono">{c}</output>
          </label>
          <p className="controls__note mono">
            ζ = {zeta.toFixed(2)} · {zeta < 1 ? 'underdamped — it wobbles' : zeta === 1 ? 'critically damped' : 'overdamped — it oozes'}
          </p>
        </div>
      )}
    </div>
  );
}

/* ---------------- Gooey blobs ---------------- */
function GooDemo({ auto }: { auto?: boolean }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const blobs = useRef<(HTMLSpanElement | null)[]>([]);
  const filterId = useRef(`goo${Math.random().toString(36).slice(2, 7)}`).current;

  useEffect(() => {
    const stage = stageRef.current!;
    const target = { x: 0, y: 0, active: false };
    const pts = Array.from({ length: 7 }, () => ({ x: 0, y: 0 }));
    const move = (e: PointerEvent) => {
      const r = stage.getBoundingClientRect();
      target.x = e.clientX - r.left - r.width / 2;
      target.y = e.clientY - r.top - r.height / 2;
      target.active = true;
    };
    const leave = () => (target.active = false);
    if (!auto) {
      stage.addEventListener('pointermove', move);
      stage.addEventListener('pointerleave', leave);
    }
    let raf = 0;
    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      const r = stage.getBoundingClientRect();
      let tx = target.x;
      let ty = target.y;
      if (!target.active) {
        tx = Math.cos(t / 900) * r.width * 0.28;
        ty = Math.sin(t / 600) * r.height * 0.22;
      }
      pts.forEach((p, i) => {
        const lead = i === 0 ? { x: tx, y: ty } : pts[i - 1];
        const ease = i === 0 ? 0.2 : 0.35;
        p.x += (lead.x - p.x) * ease;
        p.y += (lead.y - p.y) * ease;
        const el = blobs.current[i];
        if (el) el.style.transform = `translate(${p.x}px, ${p.y}px) scale(${1 - i * 0.09})`;
      });
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      stage.removeEventListener('pointermove', move);
      stage.removeEventListener('pointerleave', leave);
    };
  }, [auto]);

  return (
    <div className="goo-demo" ref={stageRef}>
      <svg width="0" height="0" aria-hidden style={{ position: 'absolute' }}>
        <filter id={filterId}>
          <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
          <feColorMatrix in="blur" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -9" />
        </filter>
      </svg>
      <div className="goo-demo__field" style={{ filter: `url(#${filterId})` }}>
        <span className="goo-demo__pool" />
        {Array.from({ length: 7 }, (_, i) => (
          <span key={i} className="goo-demo__blob" ref={(el) => {
            blobs.current[i] = el;
          }} />
        ))}
      </div>
      {!auto && <span className="goo-demo__hint mono">move your pointer through the pool</span>}
    </div>
  );
}

/* ---------------- FLIP shuffle ---------------- */
const TILES = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
function FlipDemo({ auto }: { auto?: boolean }) {
  const [order, setOrder] = useState(TILES);
  const refs = useRef(new Map<string, HTMLElement>());
  const firsts = useRef(new Map<string, DOMRect>());
  const { reducedMotion } = useSettings();

  const shuffle = () => {
    refs.current.forEach((el, k) => firsts.current.set(k, el.getBoundingClientRect()));
    setOrder((o) => {
      const n = [...o];
      for (let i = n.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [n[i], n[j]] = [n[j], n[i]];
      }
      return n;
    });
  };

  useLayoutEffect(() => {
    if (!firsts.current.size) return;
    const s = spring(210, 19);
    refs.current.forEach((el, k) => {
      const f = firsts.current.get(k);
      if (!f) return;
      const l = el.getBoundingClientRect();
      const dx = f.left - l.left;
      const dy = f.top - l.top;
      if (!dx && !dy) return;
      el.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'none' }], { duration: reducedMotion ? 1 : s.duration, easing: s.easing });
    });
    firsts.current.clear();
  }, [order, reducedMotion]);

  useEffect(() => {
    if (!auto) return;
    const id = setInterval(shuffle, 2600);
    return () => clearInterval(id);
  }, [auto]);

  return (
    <div className={`flip-demo ${auto ? 'is-auto' : ''}`}>
      <div className="flip-demo__grid">
        {order.map((t) => (
          <span key={t} ref={(el) => {
              if (el) refs.current.set(t, el);
              else refs.current.delete(t);
            }} className="flip-demo__tile" style={{ '--h': TILES.indexOf(t) * 38 } as React.CSSProperties}>
            {t}
          </span>
        ))}
      </div>
      {!auto && (
        <div className="controls controls--row">
          <button className="btn" onClick={shuffle}>
            <Glyph.shuffle /> Shuffle
          </button>
          <button className="btn btn--ghost" onClick={() => (refs.current.forEach((el, k) => firsts.current.set(k, el.getBoundingClientRect())), setOrder(TILES))}>
            Sort
          </button>
          <span className="controls__note mono">measure → mutate → invert → play</span>
        </div>
      )}
    </div>
  );
}

/* ---------------- Wallpaper tuner (drives the real desktop) ---------------- */
function WallpaperTuner() {
  const { settings, set, theme } = useSettings();
  const wp = settings.wallpaper;
  const upd = (k: keyof typeof wp, v: number) => set('wallpaper', { ...wp, [k]: v });
  const [peek, setPeek] = useState(false);

  useEffect(() => {
    document.body.classList.toggle('is-peeking', peek);
    return () => document.body.classList.remove('is-peeking');
  }, [peek]);

  const sliders: { k: keyof typeof wp; label: string; min: number; max: number; step: number }[] = [
    { k: 'levels', label: 'Contour levels', min: 4, max: 28, step: 1 },
    { k: 'scale', label: 'Terrain scale', min: 0.4, max: 2.6, step: 0.05 },
    { k: 'speed', label: 'Drift speed', min: 0, max: 5, step: 0.1 },
    { k: 'lift', label: 'Pointer lift', min: 0, max: 1.6, step: 0.05 },
  ];

  return (
    <div className="wp-tuner">
      <div className="controls">
        {sliders.map((s) => (
          <label key={s.k}>
            <span>{s.label}</span>
            <input type="range" min={s.min} max={s.max} step={s.step} value={wp[s.k]} onChange={(e) => upd(s.k, +e.target.value)} />
            <output className="mono">{wp[s.k].toFixed(s.step < 1 ? 2 : 0)}</output>
          </label>
        ))}
      </div>
      <div className="controls controls--row">
        {(['dawn', 'day', 'dusk', 'night'] as const).map((t) => (
          <button key={t} className={`chip ${theme === t ? 'is-on' : ''}`} onClick={() => set('theme', t)}>
            {t}
          </button>
        ))}
        <div className="toolbar__spacer" />
        <button className="btn btn--ghost" onClick={() => set('wallpaper', DEFAULT_WALLPAPER)}>
          <Glyph.restore /> Reset
        </button>
        <button
          className="btn"
          onPointerDown={() => setPeek(true)}
          onPointerUp={() => setPeek(false)}
          onPointerLeave={() => setPeek(false)}
          onKeyDown={(e) => e.key === ' ' && setPeek(true)}
          onKeyUp={() => setPeek(false)}
        >
          Hold to peek
        </button>
      </div>
      <p className="controls__note mono">Every slider writes to a ref the canvas loop reads — no React re-render touches the render loop.</p>
    </div>
  );
}
