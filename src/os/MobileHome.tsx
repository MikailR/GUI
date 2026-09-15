import { IconFor } from "../apps/icons";
import { APP_META } from "../data/content";
import { APP_ORDER } from "../types";
import { useOS } from "./OSContext";

export function MobileHome() {
  const { openApp, windows, isMobile, focusedId } = useOS();
  if (!isMobile) return null;
  const top = windows.find((w) => w.id === focusedId && !w.minimized);
  if (top) return null;

  return (
    <div className="mobile-home">
      <div className="lock-clock">
        <Clock />
      </div>
      <div className="home-grid">
        {APP_ORDER.map((id) => (
          <button key={id} type="button" className="home-app" onClick={() => openApp(id)}>
            <IconFor id={id} />
            <span>{APP_META[id].title}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function Clock() {
  const now = new Date();
  const time = new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  }).format(now);
  const date = new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(now);
  return (
    <>
      <div className="lock-time">{time}</div>
      <div className="lock-date">{date}</div>
    </>
  );
}
