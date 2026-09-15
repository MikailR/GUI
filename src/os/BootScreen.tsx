import { useEffect, useState } from "react";
import { useOS } from "./OSContext";

export function BootScreen() {
  const { bootDone, booted } = useOS();
  const [pct, setPct] = useState(0);

  useEffect(() => {
    if (booted) return;
    const start = performance.now();
    const dur = 2200;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - (1 - t) * (1 - t);
      setPct(Math.round(eased * 100));
      if (t < 1) raf = requestAnimationFrame(tick);
      else bootDone();
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [booted, bootDone]);

  if (booted) return null;

  return (
    <button type="button" className="boot" onClick={bootDone} aria-label="Skip boot">
      <div className="boot-mark">
        <svg viewBox="0 0 72 72" className="boot-sun" aria-hidden>
          <circle cx="36" cy="36" r="16" fill="#f0a14a" />
          <circle cx="36" cy="36" r="28" fill="none" stroke="rgba(240,161,74,.35)" strokeWidth="1.5" />
        </svg>
        <div className="boot-word">Helios</div>
        <div className="boot-sub">a personal operating environment</div>
      </div>
      <div className="boot-bar" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <span style={{ width: `${pct}%` }} />
      </div>
      <div className="boot-hint">click to skip</div>
    </button>
  );
}
