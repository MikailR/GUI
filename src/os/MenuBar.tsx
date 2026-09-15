import { useEffect, useState } from "react";
import { APP_META } from "../data/content";
import { useOS } from "./OSContext";

export function MenuBar() {
  const {
    focusedId,
    windows,
    isMobile,
    setSpotlight,
    heliosMenu,
    setHeliosMenu,
    clockOpen,
    setClock,
    openApp,
    reboot,
  } = useOS();
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const t = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(t);
  }, []);

  const focused = windows.find((w) => w.id === focusedId && !w.minimized);
  const appName = focused ? APP_META[focused.appId].title : "Helios";
  const time = new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(now);

  return (
    <header className="menubar" onPointerDown={(e) => e.stopPropagation()}>
      <div className="menubar-left">
        <button
          type="button"
          className="menubar-helios"
          aria-label="Helios menu"
          aria-expanded={heliosMenu}
          onClick={() => setHeliosMenu(!heliosMenu)}
        >
          <SunMark />
        </button>
        {heliosMenu && (
          <div className="popover menu-pop">
            <button type="button" onClick={() => { setHeliosMenu(false); openApp("about"); }}>
              About Mikail
            </button>
            <button type="button" onClick={() => { setHeliosMenu(false); openApp("settings"); }}>
              System Settings…
            </button>
            <button type="button" onClick={() => { setHeliosMenu(false); setSpotlight(true); }}>
              Spotlight
              <kbd>⌘ Space</kbd>
            </button>
            <hr />
            <button type="button" onClick={() => { setHeliosMenu(false); reboot(); }}>
              Restart Helios
            </button>
          </div>
        )}
        <span className="menubar-app">{isMobile ? "Helios" : appName}</span>
        {!isMobile && (
          <nav className="menubar-items" aria-label="App menu">
            <span>File</span>
            <span>Edit</span>
            <span>View</span>
            <span>Window</span>
          </nav>
        )}
      </div>
      <div className="menubar-right">
        <button
          type="button"
          className="icon-btn"
          aria-label="Spotlight"
          onClick={() => setSpotlight(true)}
        >
          <SearchGlyph />
        </button>
        <span className="menubar-status" aria-hidden>
          <WifiGlyph />
          <BatteryGlyph />
        </span>
        <button
          type="button"
          className="menubar-clock"
          aria-expanded={clockOpen}
          onClick={() => setClock(!clockOpen)}
        >
          {time}
        </button>
        {clockOpen && <Calendar now={now} />}
      </div>
    </header>
  );
}

function Calendar({ now }: { now: Date }) {
  const y = now.getFullYear();
  const m = now.getMonth();
  const first = new Date(y, m, 1).getDay();
  const days = new Date(y, m + 1, 0).getDate();
  const label = new Intl.DateTimeFormat(undefined, { month: "long", year: "numeric" }).format(now);
  const cells = Array.from({ length: first + days }, (_, i) => (i < first ? null : i - first + 1));
  return (
    <div className="popover calendar-pop">
      <div className="cal-label">{label}</div>
      <div className="cal-grid">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <span key={d + i} className="cal-dow">
            {d}
          </span>
        ))}
        {cells.map((d, i) => (
          <span key={i} className={d === now.getDate() ? "cal-day is-today" : "cal-day"}>
            {d ?? ""}
          </span>
        ))}
      </div>
    </div>
  );
}

function SunMark() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
      <circle cx="7" cy="7" r="4.2" fill="currentColor" />
    </svg>
  );
}
function SearchGlyph() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" aria-hidden>
      <circle cx="7" cy="7" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
function WifiGlyph() {
  return (
    <svg width="14" height="12" viewBox="0 0 14 12" aria-hidden>
      <path
        d="M1 4.2c3.4-3.2 8.6-3.2 12 0M3.2 6.6c2.2-2 5.4-2 7.6 0M5.4 9c1-.9 2.2-.9 3.2 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}
function BatteryGlyph() {
  return (
    <svg width="18" height="10" viewBox="0 0 18 10" aria-hidden>
      <rect x="0.6" y="0.6" width="14.8" height="8.8" rx="2" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <rect x="2.2" y="2.2" width="10.2" height="5.6" rx="1" fill="currentColor" />
      <path d="M16.4 3.2v3.6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
