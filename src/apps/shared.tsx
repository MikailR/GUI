import { useEffect, useRef, type ReactNode } from 'react';
import { useWin } from '../os/store';

/** Run `cb` whenever something asks this (already open) window to show a payload. */
export function usePayload(cb: (payload: string) => void) {
  const { payload, payloadSeq } = useWin();
  const cbRef = useRef(cb);
  cbRef.current = cb;
  useEffect(() => {
    if (payload) cbRef.current(payload);
  }, [payload, payloadSeq]);
}

export function Segmented<T extends string>({ value, options, onChange, label }: { value: T; options: { value: T; label: ReactNode }[]; onChange: (v: T) => void; label: string }) {
  const index = Math.max(0, options.findIndex((o) => o.value === value));
  return (
    <div className="seg" role="tablist" aria-label={label} style={{ '--n': options.length, '--i': index } as React.CSSProperties}>
      <span className="seg__thumb" aria-hidden />
      {options.map((o) => (
        <button key={o.value} role="tab" aria-selected={o.value === value} className={o.value === value ? 'is-on' : ''} onClick={() => onChange(o.value)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function formatDate(iso: string, opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' }) {
  const d = new Date(iso.length === 7 ? `${iso}-01` : iso);
  return d.toLocaleDateString('en-GB', opts);
}

/** Deterministic tiny contour-art cover, used for cards and thumbnails. */
export function ContourArt({ seed, hue, className }: { seed: string; hue: number; className?: string }) {
  let h = 0;
  for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const cx = 30 + (h % 140);
  const cy = 20 + ((h >> 8) % 60);
  const rings = Array.from({ length: 9 }, (_, i) => i);
  return (
    <svg className={className} viewBox="0 0 200 100" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <rect width="200" height="100" fill={`hsl(${hue} 45% 22%)`} />
      <rect width="200" height="100" fill={`url(#g${h})`} />
      <defs>
        <radialGradient id={`g${h}`} cx={cx / 200} cy={cy / 100} r="0.9">
          <stop offset="0" stopColor={`hsl(${hue} 80% 68%)`} stopOpacity=".85" />
          <stop offset="1" stopColor={`hsl(${(hue + 40) % 360} 60% 30%)`} stopOpacity="0" />
        </radialGradient>
      </defs>
      {rings.map((i) => (
        <ellipse
          key={i}
          cx={cx + Math.sin(i + h) * i * 1.6}
          cy={cy + Math.cos(i * 0.7 + h) * i}
          rx={10 + i * 13}
          ry={7 + i * 9}
          fill="none"
          stroke={`hsl(${hue} 90% 88%)`}
          strokeOpacity={i % 4 === 1 ? 0.55 : 0.22}
          strokeWidth={i % 4 === 1 ? 1.1 : 0.6}
          transform={`rotate(${(h % 40) - 20} ${cx} ${cy})`}
        />
      ))}
    </svg>
  );
}
