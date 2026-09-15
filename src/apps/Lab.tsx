import { useEffect, useRef, useState } from "react";

export function Lab() {
  const [tab, setTab] = useState<"spring" | "type" | "glass">("spring");
  return (
    <div className="app-lab">
      <header className="app-lead">
        <p className="eyebrow">Lab</p>
        <h1>Things that have to be felt.</h1>
      </header>
      <div className="lab-tabs" role="tablist">
        {(
          [
            ["spring", "Spring"],
            ["type", "Optical size"],
            ["glass", "Glass"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            className={tab === id ? "on" : undefined}
            onClick={() => setTab(id)}
          >
            {label}
          </button>
        ))}
      </div>
      {tab === "spring" && <SpringPad />}
      {tab === "type" && <TypePad />}
      {tab === "glass" && <GlassPad />}
    </div>
  );
}

function SpringPad() {
  const stage = useRef<HTMLDivElement>(null);
  const ball = useRef<HTMLDivElement>(null);
  const st = useRef({ x: 0, y: 0, vx: 0, vy: 0, down: false, lx: 0, ly: 0 });

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const s = st.current;
      const el = ball.current;
      const box = stage.current;
      if (el && box && !s.down) {
        s.vx += -s.x * 0.06;
        s.vy += -s.y * 0.06;
        s.vx *= 0.88;
        s.vy *= 0.88;
        s.x += s.vx;
        s.y += s.vy;
        const maxX = box.clientWidth / 2 - 28;
        const maxY = box.clientHeight / 2 - 28;
        if (Math.abs(s.x) > maxX) {
          s.x = Math.sign(s.x) * maxX;
          s.vx *= -0.6;
        }
        if (Math.abs(s.y) > maxY) {
          s.y = Math.sign(s.y) * maxY;
          s.vy *= -0.6;
        }
        el.style.transform = `translate(${s.x}px, ${s.y}px)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="lab-block">
      <p className="muted">Drag the mass. Let go. Springs remember.</p>
      <div
        ref={stage}
        className="spring-stage"
        onPointerDown={(e) => {
          const s = st.current;
          s.down = true;
          s.lx = e.clientX;
          s.ly = e.clientY;
          (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          const s = st.current;
          if (!s.down) return;
          s.x += e.clientX - s.lx;
          s.y += e.clientY - s.ly;
          s.vx = (e.clientX - s.lx) * 0.6;
          s.vy = (e.clientY - s.ly) * 0.6;
          s.lx = e.clientX;
          s.ly = e.clientY;
          if (ball.current) ball.current.style.transform = `translate(${s.x}px, ${s.y}px)`;
        }}
        onPointerUp={() => {
          st.current.down = false;
        }}
      >
        <div className="spring-rest" />
        <div ref={ball} className="spring-ball" />
      </div>
    </div>
  );
}

function TypePad() {
  const [opsz, setOpsz] = useState(72);
  const [wght, setWght] = useState(500);
  return (
    <div className="lab-block">
      <p className="muted">Fraunces was drawn to change with size. Move the optical size.</p>
      <div
        className="type-specimen"
        style={{ fontSize: `${Math.max(28, opsz * 0.7)}px`, fontVariationSettings: `"opsz" ${opsz}, "wght" ${wght}` }}
      >
        Helios
      </div>
      <label className="lab-slider">
        Optical size {opsz}
        <input type="range" min={9} max={144} value={opsz} onChange={(e) => setOpsz(Number(e.target.value))} />
      </label>
      <label className="lab-slider">
        Weight {wght}
        <input type="range" min={300} max={700} value={wght} onChange={(e) => setWght(Number(e.target.value))} />
      </label>
    </div>
  );
}

function GlassPad() {
  const [blur, setBlur] = useState(28);
  const [sat, setSat] = useState(140);
  return (
    <div className="lab-block">
      <p className="muted">Glass is lighting. Too much and the weather takes over.</p>
      <div className="glass-stage">
        <div className="glass-scene" />
        <div
          className="glass-pane"
          style={{ backdropFilter: `blur(${blur}px) saturate(${sat}%)` }}
        >
          {blur}px · {sat}%
        </div>
      </div>
      <label className="lab-slider">
        Blur
        <input type="range" min={0} max={60} value={blur} onChange={(e) => setBlur(Number(e.target.value))} />
      </label>
      <label className="lab-slider">
        Saturate
        <input type="range" min={40} max={220} value={sat} onChange={(e) => setSat(Number(e.target.value))} />
      </label>
    </div>
  );
}
