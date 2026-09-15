import type { WallpaperId } from "../types";

export function Wallpaper({ id }: { id: WallpaperId }) {
  return (
    <div className={`wallpaper wallpaper-${id}`} aria-hidden>
      {id === "helios" && <HeliosSky />}
      {id === "polar" && <PolarSky />}
      {id === "noir" && <NoirSky />}
      <div className="wp-grain" />
      <div className="wp-vignette" />
    </div>
  );
}

function HeliosSky() {
  return (
    <svg className="wp-svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id="sky" cx="70%" cy="78%" r="85%">
          <stop offset="0" stopColor="#3a1840" />
          <stop offset="0.35" stopColor="#1a0c28" />
          <stop offset="1" stopColor="#07040f" />
        </radialGradient>
        <radialGradient id="sun" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#ffe7b0" />
          <stop offset="0.35" stopColor="#f0a14a" />
          <stop offset="0.7" stopColor="#c45c2a" />
          <stop offset="1" stopColor="rgba(120,30,20,0)" />
        </radialGradient>
        <radialGradient id="bloom" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="rgba(255,180,90,.55)" />
          <stop offset="1" stopColor="rgba(255,120,40,0)" />
        </radialGradient>
      </defs>
      <rect width="1600" height="900" fill="url(#sky)" />
      <ellipse className="wp-bloom" cx="1180" cy="720" rx="520" ry="280" fill="url(#bloom)" />
      <circle className="wp-sun" cx="1180" cy="760" r="170" fill="url(#sun)" />
      <ellipse
        cx="800"
        cy="760"
        rx="720"
        ry="90"
        fill="none"
        stroke="rgba(255,210,150,.16)"
        strokeWidth="1.2"
      />
      <ellipse
        cx="800"
        cy="760"
        rx="520"
        ry="58"
        fill="none"
        stroke="rgba(255,210,150,.12)"
        strokeWidth="1"
      />
      <ellipse
        cx="800"
        cy="760"
        rx="320"
        ry="28"
        fill="none"
        stroke="rgba(255,210,150,.18)"
        strokeWidth="1"
      />
      {stars()}
    </svg>
  );
}

function PolarSky() {
  return (
    <svg className="wp-svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="polar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#07141c" />
          <stop offset="1" stopColor="#02080c" />
        </linearGradient>
        <filter id="aurora" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="42" />
        </filter>
      </defs>
      <rect width="1600" height="900" fill="url(#polar)" />
      <g filter="url(#aurora)">
        <ellipse cx="420" cy="240" rx="520" ry="160" fill="rgba(64, 220, 190, 0.55)" />
        <ellipse cx="860" cy="200" rx="460" ry="130" fill="rgba(110, 150, 255, 0.48)" />
        <ellipse cx="1180" cy="280" rx="380" ry="120" fill="rgba(70, 255, 210, 0.35)" />
      </g>
      {stars()}
    </svg>
  );
}

function NoirSky() {
  return (
    <svg className="wp-svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
      <rect width="1600" height="900" fill="#050507" />
      <line x1="80" y1="620" x2="1520" y2="620" stroke="rgba(212,175,90,.45)" strokeWidth="1" />
      <circle cx="1280" cy="210" r="46" fill="#e8e2d4" opacity="0.85" />
      <circle cx="1266" cy="198" r="46" fill="#050507" />
      {stars(0.4)}
    </svg>
  );
}

function stars(opacity = 0.7) {
  const pts = [
    [120, 80],
    [240, 160],
    [400, 60],
    [560, 140],
    [710, 40],
    [890, 110],
    [1040, 70],
    [1400, 130],
    [150, 300],
    [980, 240],
    [1320, 40],
    [300, 40],
    [640, 280],
    [1480, 320],
  ];
  return pts.map(([x, y], i) => (
    <circle
      key={i}
      cx={x}
      cy={y}
      r={i % 3 === 0 ? 1.4 : 0.8}
      fill="#fff7e6"
      opacity={opacity * (i % 2 === 0 ? 0.9 : 0.45)}
    />
  ));
}
