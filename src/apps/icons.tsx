import type { ReactNode } from "react";
import type { AppId } from "../types";

function Tile({
  id,
  from,
  to,
  children,
}: {
  id: string;
  from: string;
  to: string;
  children: ReactNode;
}) {
  return (
    <svg viewBox="0 0 64 64" className="app-icon" aria-hidden>
      <defs>
        <linearGradient id={`g-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={from} />
          <stop offset="1" stopColor={to} />
        </linearGradient>
        <linearGradient id={`h-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="rgba(255,255,255,.45)" />
          <stop offset="0.45" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" fill={`url(#g-${id})`} />
      <rect
        width="64"
        height="64"
        rx="16"
        fill={`url(#h-${id})`}
        style={{ mixBlendMode: "soft-light" }}
      />
      <rect
        x="0.6"
        y="0.6"
        width="62.8"
        height="62.8"
        rx="15.4"
        fill="none"
        stroke="rgba(255,255,255,.28)"
        strokeWidth="1.2"
      />
      {children}
    </svg>
  );
}

export function AboutIcon() {
  return (
    <Tile id="about" from="#f3c27a" to="#c45c2a">
      <circle cx="32" cy="28" r="11" fill="none" stroke="#fff8ea" strokeWidth="2.2" />
      <path
        d="M18 50c3.2-9 10-14 14-14s10.8 5 14 14"
        fill="none"
        stroke="#fff8ea"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </Tile>
  );
}

export function HackathonsIcon() {
  return (
    <Tile id="hack" from="#c9a2ff" to="#5b3ad4">
      <path
        d="M20 22h24v6c0 8-5.2 14-12 16-6.8-2-12-8-12-16z"
        fill="none"
        stroke="#f4ecff"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path d="M32 44v8M24 52h16" stroke="#f4ecff" strokeWidth="2.2" strokeLinecap="round" />
    </Tile>
  );
}

export function WritingIcon() {
  return (
    <Tile id="write" from="#f2e6d0" to="#b08968">
      <rect x="18" y="14" width="24" height="34" rx="2.5" fill="none" stroke="#3a2416" strokeWidth="2" />
      <path d="M24 24h12M24 30h12M24 36h8" stroke="#3a2416" strokeWidth="2" strokeLinecap="round" />
    </Tile>
  );
}

export function LabIcon() {
  return (
    <Tile id="lab" from="#7ee0c8" to="#1f7a72">
      <path
        d="M26 16h12M28 16v10l-8 16c-1 2 .4 6 6 6h12c5.6 0 7-4 6-6l-8-16V16"
        fill="none"
        stroke="#e8fff8"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <circle cx="34" cy="42" r="2.2" fill="#e8fff8" />
    </Tile>
  );
}

export function PapersIcon() {
  return (
    <Tile id="papers" from="#e8b089" to="#8a3d2a">
      <path
        d="M20 16h16l8 8v24H20z"
        fill="none"
        stroke="#fff1e6"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M36 16v8h8" fill="none" stroke="#fff1e6" strokeWidth="2" />
      <path d="M26 34h12M26 40h8" stroke="#fff1e6" strokeWidth="2" strokeLinecap="round" />
    </Tile>
  );
}

export function TrashIcon({ empty = false }: { empty?: boolean }) {
  return (
    <Tile id="trash" from="#9aa3b2" to="#3d4450">
      <path
        d="M22 24h20l-1.6 22H23.6z"
        fill="none"
        stroke="#eef2f7"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M20 24h24M28 24v-4h8v4" stroke="#eef2f7" strokeWidth="2" strokeLinecap="round" />
      {!empty && (
        <path d="M28 30v10M32 30v10M36 30v10" stroke="#eef2f7" strokeWidth="1.8" strokeLinecap="round" />
      )}
    </Tile>
  );
}

export function TerminalIcon() {
  return (
    <Tile id="term" from="#1d2420" to="#0b100e">
      <rect x="12" y="16" width="40" height="32" rx="4" fill="none" stroke="#9ff2c3" strokeWidth="2" />
      <path d="M20 28l6 4-6 4M30 36h10" stroke="#9ff2c3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Tile>
  );
}

export function SettingsIcon() {
  return (
    <Tile id="set" from="#d8dee8" to="#6b7380">
      <circle cx="32" cy="32" r="8" fill="none" stroke="#1c2128" strokeWidth="2.2" />
      <path
        d="M32 14v6M32 44v6M14 32h6M44 32h6M19.5 19.5l4.2 4.2M40.3 40.3l4.2 4.2M19.5 44.5l4.2-4.2M40.3 23.7l4.2-4.2"
        stroke="#1c2128"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </Tile>
  );
}

export function ReadmeIcon() {
  return (
    <Tile id="readme" from="#f7f0c8" to="#c9a227">
      <path d="M22 18h20v28H22z" fill="none" stroke="#3b2e08" strokeWidth="2" />
      <path d="M27 26h10M27 32h10M27 38h6" stroke="#3b2e08" strokeWidth="2" strokeLinecap="round" />
    </Tile>
  );
}

export const APP_ICONS: Record<AppId, (p?: { empty?: boolean }) => ReactNode> = {
  about: () => <AboutIcon />,
  hackathons: () => <HackathonsIcon />,
  writing: () => <WritingIcon />,
  lab: () => <LabIcon />,
  papers: () => <PapersIcon />,
  trash: (p) => <TrashIcon empty={p?.empty} />,
  terminal: () => <TerminalIcon />,
  settings: () => <SettingsIcon />,
};

export function IconFor({
  id,
  empty,
}: {
  id: AppId | "readme";
  empty?: boolean;
}) {
  if (id === "readme") return <ReadmeIcon />;
  if (id === "trash") return <TrashIcon empty={empty} />;
  return <>{APP_ICONS[id]()}</>;
}
