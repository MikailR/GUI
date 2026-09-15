import { useEffect, useMemo, useRef, useState } from 'react';
import { experiments, hackathons, papers, posts } from '../content';
import { fuzzyScore } from '../lib/fuzzy';
import { APPS } from './meta';
import { useSettings } from './settings';
import { useOS } from './store';
import { AppIcon, Glyph } from './icons';
import type { AppId } from './types';

interface Result {
  key: string;
  group: string;
  title: string;
  sub: string;
  icon: AppId;
  run: () => void;
}

export function Spotlight({ onOpen }: { onOpen: (id: AppId, payload?: string) => void }) {
  const os = useOS();
  const { set, settings } = useSettings();
  const [q, setQ] = useState('');
  const [index, setIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (os.spotlight) {
      setQ('');
      setIndex(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [os.spotlight]);

  const all = useMemo<Result[]>(
    () => [
      ...(Object.keys(APPS) as AppId[]).map((id) => ({ key: `app:${id}`, group: 'Applications', title: APPS[id].title, sub: APPS[id].blurb, icon: id, run: () => onOpen(id) })),
      ...posts.map((p) => ({ key: p.id, group: 'Writing', title: p.title, sub: `${p.minutes} min read · ${p.tags.join(', ')}`, icon: 'writing' as AppId, run: () => onOpen('writing', p.id) })),
      ...hackathons.map((h) => ({ key: h.id, group: 'Hackathons', title: `${h.project} — ${h.event}`, sub: `${h.placement} · ${h.city} · ${h.date.slice(0, 4)}`, icon: 'hackathons' as AppId, run: () => onOpen('hackathons', h.id) })),
      ...experiments.map((x) => ({ key: x.id, group: 'Lab', title: x.title, sub: x.blurb, icon: 'lab' as AppId, run: () => onOpen('lab', x.id) })),
      ...papers.map((p) => ({ key: p.id, group: 'Papers', title: p.title, sub: `${p.kind} · ${p.date}`, icon: 'papers' as AppId, run: () => onOpen('papers', p.id) })),
      ...(['dawn', 'day', 'dusk', 'night'] as const).map((t) => ({ key: `theme:${t}`, group: 'Actions', title: `Switch wallpaper to ${t}`, sub: 'Appearance', icon: 'settings' as AppId, run: () => set('theme', t) })),
      { key: 'motion', group: 'Actions', title: settings.motion === 'reduced' ? 'Enable full motion' : 'Reduce motion', sub: 'Accessibility', icon: 'settings', run: () => set('motion', settings.motion === 'reduced' ? 'full' : 'reduced') },
      { key: 'empty', group: 'Actions', title: 'Empty Trash', sub: 'Finder', icon: 'trash', run: () => onOpen('trash', 'empty') },
      { key: 'reboot', group: 'Actions', title: 'Restart mikail.os', sub: 'System', icon: 'settings', run: os.reboot },
    ],
    [onOpen, set, settings.motion, os.reboot],
  );

  const results = useMemo(() => {
    if (!q.trim()) {
      return all.filter((r) => r.group === 'Applications' || r.key === posts[0].id || r.key === hackathons[0].id || r.key === 'x-wallpaper');
    }
    return all
      .map((r) => ({ r, s: Math.max(fuzzyScore(q, r.title) * 1.4, fuzzyScore(q, r.sub) * 0.6, fuzzyScore(q, r.group) * 0.5) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 12)
      .map((x) => x.r);
  }, [q, all]);

  useEffect(() => setIndex(0), [q]);
  useEffect(() => {
    listRef.current?.querySelector('.is-active')?.scrollIntoView({ block: 'nearest' });
  }, [index]);

  if (!os.spotlight) return null;

  const run = (r: Result | undefined) => {
    if (!r) return;
    os.setSpotlight(false);
    r.run();
  };

  const grouped: [string, Result[]][] = [];
  for (const r of results) {
    const g = grouped.find(([name]) => name === r.group);
    g ? g[1].push(r) : grouped.push([r.group, [r]]);
  }
  let flat = 0;

  return (
    <div className="spotlight-scrim" onPointerDown={() => os.setSpotlight(false)}>
      <div className="spotlight glass" role="dialog" aria-label="Search" onPointerDown={(e) => e.stopPropagation()}>
        <div className="spotlight__field">
          <Glyph.search width={20} height={20} />
          <input
            ref={inputRef}
            value={q}
            placeholder="Search apps, essays, hackathons, actions…"
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') (e.preventDefault(), setIndex((i) => Math.min(results.length - 1, i + 1)));
              else if (e.key === 'ArrowUp') (e.preventDefault(), setIndex((i) => Math.max(0, i - 1)));
              else if (e.key === 'Enter') run(results[index]);
              else if (e.key === 'Escape') (e.preventDefault(), e.stopPropagation(), os.setSpotlight(false));
            }}
            aria-activedescendant={results[index]?.key}
            aria-controls="spotlight-list"
            spellCheck={false}
          />
          <kbd>esc</kbd>
        </div>
        <div className="spotlight__list" id="spotlight-list" ref={listRef} role="listbox">
          {!results.length && <div className="spotlight__empty">No results for “{q}”. Try “spring”, “berlin” or “night”.</div>}
          {grouped.map(([group, rs]) => (
            <div key={group}>
              <div className="spotlight__group">{q ? group : group === 'Applications' ? 'Applications' : 'Suggested'}</div>
              {rs.map((r) => {
                const i = flat++;
                return (
                  <button
                    key={r.key}
                    id={r.key}
                    role="option"
                    aria-selected={i === index}
                    className={`spotlight__item ${i === index ? 'is-active' : ''}`}
                    onPointerMove={() => i !== index && setIndex(i)}
                    onClick={() => run(r)}
                  >
                    <AppIcon app={r.icon} size={26} />
                    <span className="spotlight__title">{r.title}</span>
                    <span className="spotlight__sub">{r.sub}</span>
                    {i === index && <kbd>↩</kbd>}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
