import { useEffect, useState } from 'react';
import { useSettings } from './settings';

const LINES = [
  'mounting /home/mikail',
  'calibrating contour field · 14 levels',
  'baking spring curves into linear()',
  'hydrating dock',
  'restoring window stack',
  'ready.',
];

export function Boot({ onDone }: { onDone: () => void }) {
  const { reducedMotion } = useSettings();
  const [progress, setProgress] = useState(0);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const total = reducedMotion ? 700 : 2100;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      // ease-in-out with a little stall near 70%, like every progress bar ever
      const t = Math.min(1, (now - start) / total);
      const eased = t < 0.6 ? 1.15 * t : t < 0.75 ? 0.69 + (t - 0.6) * 0.3 : 0.735 + (t - 0.75) * 1.06;
      setProgress(Math.min(1, eased));
      if (t < 1) raf = requestAnimationFrame(tick);
      else setLeaving(true);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reducedMotion]);

  useEffect(() => {
    if (!leaving) return;
    const t = setTimeout(onDone, reducedMotion ? 150 : 750);
    return () => clearTimeout(t);
  }, [leaving, onDone, reducedMotion]);

  useEffect(() => {
    const skip = () => setLeaving(true);
    window.addEventListener('keydown', skip);
    return () => window.removeEventListener('keydown', skip);
  }, []);

  const shown = Math.min(LINES.length, Math.floor(progress * LINES.length) + 1);

  return (
    <div className={`boot ${leaving ? 'is-leaving' : ''}`} onPointerDown={() => setLeaving(true)} role="status" aria-label="Starting mikail.os">
      <div className="boot__center">
        <svg className="boot__mark" viewBox="0 0 120 120" aria-hidden>
          {[52, 42, 32].map((r, i) => (
            <circle key={r} cx="60" cy="60" r={r} className="boot__ring" style={{ animationDelay: `${i * 120}ms` }} />
          ))}
          <path d="M38 80V42l22 22 22-22v38" className="boot__m" />
        </svg>
        <div className="boot__name">
          mikail<span>.os</span>
        </div>
        <div className="boot__bar">
          <i style={{ transform: `scaleX(${progress})` }} />
        </div>
        <ol className="boot__log">
          {LINES.slice(0, shown).map((l, i) => (
            <li key={l} className={i === shown - 1 ? 'is-current' : ''}>
              {l}
            </li>
          ))}
        </ol>
      </div>
      <div className="boot__skip">press any key to skip</div>
    </div>
  );
}
