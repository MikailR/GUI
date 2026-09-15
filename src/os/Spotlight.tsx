import { useEffect, useMemo, useRef, useState } from "react";
import { ESSAYS, HACKATHONS, PAPERS, APP_META } from "../data/content";
import { APP_ORDER } from "../types";
import { useOS } from "./OSContext";

type Hit = { kind: string; title: string; hint: string; run: () => void };

export function Spotlight() {
  const { spotlight, setSpotlight, openApp } = useOS();
  const [q, setQ] = useState("");
  const [i, setI] = useState(0);
  const input = useRef<HTMLInputElement>(null);

  const hits = useMemo<Hit[]>(() => {
    const needle = q.trim().toLowerCase();
    const apps: Hit[] = APP_ORDER.map((id) => ({
      kind: "App",
      title: APP_META[id].title,
      hint: APP_META[id].subtitle,
      run: () => openApp(id),
    }));
    const writing: Hit[] = ESSAYS.map((e) => ({
      kind: "Writing",
      title: e.title,
      hint: e.dek,
      run: () => openApp("writing"),
    }));
    const hacks: Hit[] = HACKATHONS.map((h) => ({
      kind: "Hackathon",
      title: h.project,
      hint: `${h.event} · ${h.award}`,
      run: () => openApp("hackathons"),
    }));
    const papers: Hit[] = PAPERS.map((p) => ({
      kind: "Paper",
      title: p.title,
      hint: `${p.venue} · ${p.year}`,
      run: () => openApp("papers"),
    }));
    const all = [...apps, ...writing, ...hacks, ...papers];
    if (!needle) return apps;
    return all.filter(
      (h) =>
        h.title.toLowerCase().includes(needle) ||
        h.hint.toLowerCase().includes(needle) ||
        h.kind.toLowerCase().includes(needle),
    );
  }, [q, openApp]);

  useEffect(() => {
    if (spotlight) {
      setQ("");
      setI(0);
      requestAnimationFrame(() => input.current?.focus());
    }
  }, [spotlight]);

  useEffect(() => setI(0), [q]);

  if (!spotlight) return null;

  const go = (hit: Hit) => {
    hit.run();
    setSpotlight(false);
  };

  return (
    <div className="spot-scrim" onMouseDown={() => setSpotlight(false)}>
      <div
        className="spotlight"
        role="dialog"
        aria-label="Spotlight"
        onMouseDown={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setI((n) => Math.min(hits.length - 1, n + 1));
          }
          if (e.key === "ArrowUp") {
            e.preventDefault();
            setI((n) => Math.max(0, n - 1));
          }
          if (e.key === "Enter" && hits[i]) go(hits[i]);
        }}
      >
        <input
          ref={input}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search Helios"
          aria-label="Search Helios"
        />
        <ul>
          {hits.length === 0 && <li className="spot-empty">Nothing on this machine.</li>}
          {hits.slice(0, 8).map((h, idx) => (
            <li key={h.kind + h.title}>
              <button
                type="button"
                className={idx === i ? "is-active" : undefined}
                onMouseEnter={() => setI(idx)}
                onClick={() => go(h)}
              >
                <span className="spot-kind">{h.kind}</span>
                <span className="spot-title">{h.title}</span>
                <span className="spot-hint">{h.hint}</span>
              </button>
            </li>
          ))}
        </ul>
        <div className="spot-foot">
          <span>↑↓ to move</span>
          <span>⏎ open</span>
          <span>esc close</span>
        </div>
      </div>
    </div>
  );
}
