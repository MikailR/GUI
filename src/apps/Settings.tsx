import { cx } from "../lib/cx";
import type { AccentId, WallpaperId } from "../types";
import { useOS } from "../os/OSContext";

const WALLS: { id: WallpaperId; name: string; note: string }[] = [
  { id: "helios", name: "Helios", note: "ember on indigo" },
  { id: "polar", name: "Polar", note: "a cold aurora" },
  { id: "noir", name: "Noir", note: "one gold line" },
];

const ACCENTS: { id: AccentId; name: string }[] = [
  { id: "ember", name: "Ember" },
  { id: "violet", name: "Violet" },
  { id: "ice", name: "Ice" },
];

export function Settings() {
  const { wallpaper, setWallpaper, accent, setAccent, magnify, setMagnify } = useOS();
  return (
    <div className="app-settings">
      <header className="app-lead">
        <p className="eyebrow">Appearance</p>
        <h1>The weather on this machine.</h1>
      </header>
      <section>
        <h3>Wallpaper</h3>
        <div className="wall-picks">
          {WALLS.map((w) => (
            <button
              key={w.id}
              type="button"
              className={cx("wall-pick", wallpaper === w.id && "on")}
              onClick={() => setWallpaper(w.id)}
            >
              <span className={`wall-thumb wallpaper-${w.id}`} />
              <b>{w.name}</b>
              <i>{w.note}</i>
            </button>
          ))}
        </div>
      </section>
      <section>
        <h3>Accent</h3>
        <div className="accent-picks">
          {ACCENTS.map((a) => (
            <button
              key={a.id}
              type="button"
              className={cx("accent-pick", `accent-${a.id}`, accent === a.id && "on")}
              onClick={() => setAccent(a.id)}
            >
              {a.name}
            </button>
          ))}
        </div>
      </section>
      <section className="toggle-row">
        <div>
          <h3>Dock magnification</h3>
          <p className="muted">Icons lean toward the pointer. Desktop only.</p>
        </div>
        <button
          type="button"
          className={cx("toggle", magnify && "on")}
          aria-pressed={magnify}
          onClick={() => setMagnify(!magnify)}
        >
          <span />
        </button>
      </section>
    </div>
  );
}
