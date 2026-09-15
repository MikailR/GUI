import { useId, type SVGProps } from 'react';
import type { AppId } from './types';

const SQUIRCLE = 'M32 2C8.5 2 2 8.5 2 32s6.5 30 30 30 30-6.5 30-30S55.5 2 32 2Z';

function gearPath(cx: number, cy: number, teeth: number, rOuter: number, rInner: number) {
  const pts: string[] = [];
  const step = (Math.PI * 2) / teeth;
  for (let i = 0; i < teeth; i++) {
    const a = i * step;
    const k = [
      [a - step * 0.22, rInner],
      [a - step * 0.12, rOuter],
      [a + step * 0.12, rOuter],
      [a + step * 0.22, rInner],
      [a + step * 0.5, rInner],
    ];
    for (const [ang, r] of k) pts.push(`${(cx + Math.cos(ang) * r).toFixed(2)} ${(cy + Math.sin(ang) * r).toFixed(2)}`);
  }
  return `M${pts.join('L')}Z`;
}
const GEAR = gearPath(32, 32, 9, 20, 15.5);

function Base({ id, from, to, children }: { id: string; from: string; to: string; children: React.ReactNode }) {
  return (
    <>
      <defs>
        <linearGradient id={`${id}bg`} x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0" stopColor={from} />
          <stop offset="1" stopColor={to} />
        </linearGradient>
        <linearGradient id={`${id}hl`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".55" />
          <stop offset=".5" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <clipPath id={`${id}clip`}>
          <path d={SQUIRCLE} />
        </clipPath>
      </defs>
      <path d={SQUIRCLE} fill={`url(#${id}bg)`} />
      <g clipPath={`url(#${id}clip)`}>{children}</g>
      <path d={SQUIRCLE} fill="none" stroke={`url(#${id}hl)`} strokeWidth="1.2" />
    </>
  );
}

export function AppIcon({ app, size = 56, full, ...rest }: { app: AppId; size?: number; full?: boolean } & SVGProps<SVGSVGElement>) {
  const uid = useId().replace(/:/g, '');
  const common = { width: size, height: size, viewBox: '0 0 64 64', 'aria-hidden': true, ...rest } as const;

  switch (app) {
    case 'about':
      return (
        <svg {...common}>
          <Base id={uid} from="#ffd8b0" to="#e8673f">
            {[34, 26, 18, 10].map((r, i) => (
              <circle key={r} cx="48" cy="54" r={r} fill="none" stroke="#fff" strokeOpacity={0.12 + i * 0.05} strokeWidth="1.2" />
            ))}
            <path d="M18 45V21.5l14 14 14-14V45" fill="none" stroke="#2a1633" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="46" cy="16" r="3" fill="#2a1633" />
          </Base>
        </svg>
      );
    case 'hackathons':
      return (
        <svg {...common}>
          <defs>
            <linearGradient id={`${uid}gold`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#fff1b8" />
              <stop offset=".5" stopColor="#f5c04e" />
              <stop offset="1" stopColor="#c9832a" />
            </linearGradient>
          </defs>
          <Base id={uid} from="#7c5cf0" to="#281766">
            <path d="M0 50 64 26v38H0z" fill="#000" opacity=".18" />
            <path d="M23 17h18v9c0 6.5-4 11-9 11s-9-4.5-9-11z" fill={`url(#${uid}gold)`} />
            <path d="M23 20h-5c0 6 2.5 9 6.5 9.5M41 20h5c0 6-2.5 9-6.5 9.5" fill="none" stroke={`url(#${uid}gold)`} strokeWidth="2.6" strokeLinecap="round" />
            <path d="M29.5 37h5l1 6h-7z" fill="#e0a23e" />
            <rect x="23" y="43" width="18" height="5" rx="1.6" fill={`url(#${uid}gold)`} />
            <path d="m32 21 1.5 3.1 3.4.5-2.5 2.3.6 3.4-3-1.6-3 1.6.6-3.4-2.5-2.3 3.4-.5z" fill="#fff" opacity=".85" />
          </Base>
        </svg>
      );
    case 'writing':
      return (
        <svg {...common}>
          <Base id={uid} from="#fffaf0" to="#e6d6ba">
            {[18, 26, 34, 42, 50].map((y) => (
              <path key={y} d={`M8 ${y}h48`} stroke="#6b8cc7" strokeOpacity=".35" strokeWidth="1" />
            ))}
            <path d="M15 4v58" stroke="#e05a5a" strokeOpacity=".55" strokeWidth="1.2" />
            <g transform="rotate(38 34 34)">
              <path d="M28 8h12v22l-6 20-6-20z" fill="#262033" />
              <path d="M28 30h12l-6 20z" fill="#d9a441" />
              <path d="M34 34v14" stroke="#262033" strokeWidth="1.2" />
              <circle cx="34" cy="35" r="1.8" fill="#262033" />
              <path d="M30 8h2v21h-2z" fill="#fff" opacity=".18" />
            </g>
          </Base>
        </svg>
      );
    case 'lab':
      return (
        <svg {...common}>
          <Base id={uid} from="#3cc4b0" to="#0c4b57">
            <path d="M26.5 13h11M28 13v13L17.5 45a4 4 0 0 0 3.5 6h22a4 4 0 0 0 3.5-6L36 26V13" fill="#fff" fillOpacity=".16" stroke="#f3fffb" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M21.5 38h21l4.2 7.4A4 4 0 0 1 43 51H21a4 4 0 0 1-3.6-5.6z" fill="#d7f56c" />
            <circle cx="28" cy="44" r="2.2" fill="#0c4b57" opacity=".35" />
            <circle cx="35.5" cy="46.5" r="1.4" fill="#0c4b57" opacity=".35" />
            <circle cx="33" cy="31" r="1.6" fill="#f3fffb" />
            <circle cx="30" cy="22" r="1.1" fill="#f3fffb" opacity=".8" />
          </Base>
        </svg>
      );
    case 'papers':
      return (
        <svg {...common}>
          <Base id={uid} from="#dfe7f5" to="#8fa2c6">
            <rect x="20" y="13" width="30" height="38" rx="3" fill="#fff" opacity=".55" transform="rotate(8 35 32)" />
            <rect x="15" y="12" width="30" height="40" rx="3" fill="#fff" />
            <path d="M20 19h14M20 23h20M20 27h17" stroke="#9aa6bd" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M21 45V40M26.5 45V34M32 45v-7M37.5 45V31" stroke="#3a6fd8" strokeWidth="3.4" strokeLinecap="round" />
          </Base>
        </svg>
      );
    case 'terminal':
      return (
        <svg {...common}>
          <Base id={uid} from="#3a3a46" to="#0f0f14">
            <path d="M0 0h64v14H0z" fill="#fff" opacity=".06" />
            <circle cx="11" cy="8" r="1.8" fill="#ff6b5f" />
            <circle cx="17" cy="8" r="1.8" fill="#ffc14d" />
            <circle cx="23" cy="8" r="1.8" fill="#35cc56" />
            <path d="m17 26 9 7-9 7" fill="none" stroke="#9ef0a8" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M30 42h15" stroke="#9ef0a8" strokeWidth="3.4" strokeLinecap="round" />
          </Base>
        </svg>
      );
    case 'settings':
      return (
        <svg {...common}>
          <defs>
            <linearGradient id={`${uid}g`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#f7f8fb" />
              <stop offset="1" stopColor="#9aa1af" />
            </linearGradient>
          </defs>
          <Base id={uid} from="#b9bfcc" to="#555c6c">
            <path d={GEAR} fill={`url(#${uid}g)`} stroke="#3b404c" strokeOpacity=".35" />
            <circle cx="32" cy="32" r="8" fill="#4a505e" />
            <circle cx="32" cy="32" r="4" fill="#c7ccd6" />
          </Base>
        </svg>
      );
    case 'trash':
      return (
        <svg {...common}>
          <defs>
            <linearGradient id={`${uid}t`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#dfe4ec" stopOpacity=".75" />
              <stop offset=".5" stopColor="#fff" stopOpacity=".92" />
              <stop offset="1" stopColor="#cdd3dd" stopOpacity=".75" />
            </linearGradient>
          </defs>
          {full && (
            <g>
              <path d="M19 16c3-5 9-4 11-1 3-4 9-4 11 0 4-1 6 3 4 6H19c-3-1-2-4 0-5z" fill="#f8f3e8" stroke="#b9ae98" strokeWidth=".8" />
              <path d="M25 13l3 4M36 12l-2 5M30 11v4" stroke="#b9ae98" strokeWidth=".8" />
            </g>
          )}
          <path d="M14 18h36l-3.6 38a4 4 0 0 1-4 3.6H21.6a4 4 0 0 1-4-3.6z" fill={`url(#${uid}t)`} stroke="#fff" strokeOpacity=".9" />
          {[22, 27, 32, 37, 42].map((x, i) => (
            <path key={x} d={`M${x} 23 ${x + (i - 2) * 0.6} 55`} stroke="#8a93a3" strokeOpacity=".45" strokeWidth="1.4" strokeLinecap="round" />
          ))}
          <rect x="12" y="15" width="40" height="5" rx="2.5" fill="#eef1f6" stroke="#9aa2b1" strokeOpacity=".5" />
        </svg>
      );
  }
}

export function FileIcon({ kind, size = 40 }: { kind: string; size?: number }) {
  const colors: Record<string, string> = { zip: '#b58cf5', js: '#f2d14b', txt: '#9aa6bd', img: '#5fbf9a', fig: '#f2766b', folder: '#6aa9ee' };
  const c = colors[kind] ?? '#9aa6bd';
  if (kind === 'folder') {
    return (
      <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden>
        <path d="M4 12a3 3 0 0 1 3-3h11l4 4h19a3 3 0 0 1 3 3v3H4z" fill={c} opacity=".75" />
        <path d="M4 17h40v21a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3z" fill={c} />
        <path d="M4 17h40v3H4z" fill="#fff" opacity=".25" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden>
      <path d="M11 4h18l10 10v28a2 2 0 0 1-2 2H11a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" fill="#fbfbfd" stroke="#c9cfd9" />
      <path d="M29 4v8a2 2 0 0 0 2 2h8" fill="#e8ebf1" stroke="#c9cfd9" />
      <rect x="9" y="30" width="30" height="9" rx="2" fill={c} />
      <text x="24" y="37" textAnchor="middle" fontSize="6.5" fontWeight="700" fill="#fff" fontFamily="ui-monospace, monospace">
        {kind.toUpperCase()}
      </text>
    </svg>
  );
}

type G = SVGProps<SVGSVGElement>;
const g = (d: React.ReactNode) =>
  function Glyph(p: G) {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden {...p}>
        {d}
      </svg>
    );
  };

export const Glyph = {
  search: g(<><circle cx="7" cy="7" r="4.5" /><path d="m10.5 10.5 3 3" /></>),
  sliders: g(<><path d="M2 5h7M13 5h1M2 11h1M7 11h7" /><circle cx="11" cy="5" r="2" /><circle cx="5" cy="11" r="2" /></>),
  wifi: g(<><path d="M1.5 6a9.5 9.5 0 0 1 13 0M4 8.7a6 6 0 0 1 8 0M6.4 11.3a2.4 2.4 0 0 1 3.2 0" /><circle cx="8" cy="13.4" r=".6" fill="currentColor" /></>),
  battery: g(<><rect x="1.5" y="4.5" width="11.5" height="7" rx="2" /><path d="M14.5 7v2" /><rect x="3" y="6" width="7" height="4" rx=".8" fill="currentColor" stroke="none" /></>),
  chevronRight: g(<path d="m6 3 5 5-5 5" />),
  chevronLeft: g(<path d="m10 3-5 5 5 5" />),
  chevronDown: g(<path d="m3 6 5 5 5-5" />),
  grid: g(<><rect x="2" y="2" width="5" height="5" rx="1" /><rect x="9" y="2" width="5" height="5" rx="1" /><rect x="2" y="9" width="5" height="5" rx="1" /><rect x="9" y="9" width="5" height="5" rx="1" /></>),
  list: g(<path d="M2 4h12M2 8h12M2 12h12" />),
  close: g(<path d="m4 4 8 8M12 4l-8 8" />),
  plus: g(<path d="M8 3v10M3 8h10" />),
  minus: g(<path d="M3 8h10" />),
  sun: g(<><circle cx="8" cy="8" r="3" /><path d="M8 1v1.5M8 13.5V15M1 8h1.5M13.5 8H15M3 3l1 1M12 12l1 1M3 13l1-1M12 4l1-1" /></>),
  moon: g(<path d="M13 9.5A5.5 5.5 0 1 1 6.5 3a4.5 4.5 0 0 0 6.5 6.5z" />),
  sparkle: g(<path d="M8 1.5 9.4 6.6 14.5 8 9.4 9.4 8 14.5 6.6 9.4 1.5 8l5.1-1.4z" />),
  medal: g(<><circle cx="8" cy="10" r="4" /><path d="M5.5 1.5 8 6l2.5-4.5" /></>),
  mapPin: g(<><path d="M8 14.5s5-4.3 5-8.5a5 5 0 0 0-10 0c0 4.2 5 8.5 5 8.5z" /><circle cx="8" cy="6" r="1.7" /></>),
  clock: g(<><circle cx="8" cy="8" r="6.5" /><path d="M8 4.5V8l2.5 1.5" /></>),
  users: g(<><circle cx="6" cy="5.5" r="2.5" /><path d="M1.5 14a4.5 4.5 0 0 1 9 0M11 3.2a2.5 2.5 0 0 1 0 4.6M12.5 9.6A4.5 4.5 0 0 1 14.5 14" /></>),
  external: g(<path d="M9 2.5h4.5V7M13.5 2.5 7 9M11.5 10v3a1 1 0 0 1-1 1h-7a1 1 0 0 1-1-1V5.5a1 1 0 0 1 1-1h3" />),
  shuffle: g(<path d="M1.5 4.5h3c3 0 4 7 7 7h3M12.5 9.5l2 2-2 2M1.5 11.5h3c1.2 0 2-1 2.7-2.2M9 6.5c.7-1.1 1.4-2 2.5-2h3M12.5 2.5l2 2-2 2" />),
  zoomIn: g(<><circle cx="7" cy="7" r="4.5" /><path d="m10.5 10.5 3 3M5 7h4M7 5v4" /></>),
  zoomOut: g(<><circle cx="7" cy="7" r="4.5" /><path d="m10.5 10.5 3 3M5 7h4" /></>),
  sidebar: g(<><rect x="1.5" y="2.5" width="13" height="11" rx="2" /><path d="M6 2.5v11" /></>),
  keyboard: g(<><rect x="1" y="3.5" width="14" height="9" rx="1.5" /><path d="M4 6.5h.01M7 6.5h.01M10 6.5h.01M12.5 6.5h.01M4.5 9.5h7" /></>),
  restore: g(<path d="M3 8a5 5 0 1 0 1.5-3.5M3 2.5V5h2.5" />),
};

export function Logo({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <path d="M12 1.5c-8 0-10.5 2.5-10.5 10.5S4 22.5 12 22.5 22.5 20 22.5 12 20 1.5 12 1.5Z" fill="currentColor" opacity=".16" />
      <path d="M6.5 17V8l5.5 5.5L17.5 8v9" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
