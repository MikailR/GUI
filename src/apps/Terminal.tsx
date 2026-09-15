import { useEffect, useRef, useState, type ReactNode } from 'react';
import { experiments, hackathons, papers, posts, profile } from '../content';
import { APPS } from '../os/meta';
import { ACCENTS, useSettings } from '../os/settings';
import { useOS, useWin } from '../os/store';
import type { AppId, ThemeName } from '../os/types';

type Line = { id: number; node: ReactNode };

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const FS: Record<string, string[]> = {
  '~': ['about.txt', 'writing/', 'lab/', 'papers/', 'hackathons.csv', '.secrets'],
  '~/writing': posts.map((p) => `${slug(p.title)}.md`),
  '~/lab': experiments.map((x) => `${slug(x.title)}/`),
  '~/papers': papers.map((p) => `${slug(p.title)}.pdf`),
};

const COMMANDS = ['help', 'whoami', 'ls', 'cd', 'cat', 'open', 'neofetch', 'theme', 'accent', 'hackathons', 'date', 'echo', 'history', 'clear', 'exit', 'sudo', 'pwd'];

const NEOFETCH_ART = String.raw`
   ███╗   ███╗
   ████╗ ████║
   ██╔████╔██║
   ██║╚██╔╝██║
   ██║ ╚═╝ ██║
   ╚═╝     ╚═╝`;

let lineSeq = 0;

export function Terminal() {
  const os = useOS();
  const { mobile } = useWin();
  const { set, theme, settings } = useSettings();
  const [lines, setLines] = useState<Line[]>(() => [
    { id: lineSeq++, node: <span className="t-dim">Last login: {new Date().toDateString()} on ttys001</span> },
    {
      id: lineSeq++,
      node: (
        <span>
          Welcome to <b className="t-accent">mikail.os</b>. Type <b>help</b> to see what this shell can do. Tab completes.
        </span>
      ),
    },
  ]);
  const [input, setInput] = useState('');
  const [cwd, setCwd] = useState('~');
  const [history, setHistory] = useState<string[]>([]);
  const [hIndex, setHIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [lines]);

  useEffect(() => {
    if (!mobile) inputRef.current?.focus();
  }, [mobile]);

  const print = (...nodes: ReactNode[]) => setLines((l) => [...l, ...nodes.map((node) => ({ id: lineSeq++, node }))]);

  const resolveOpen = (arg: string): [AppId, string?] | null => {
    const a = arg.replace(/^~\//, '').replace(/\/$/, '');
    if ((Object.keys(APPS) as AppId[]).includes(a as AppId)) return [a as AppId];
    const base = a.split('/').pop()!.replace(/\.(md|pdf)$/, '');
    const post = posts.find((p) => slug(p.title) === base);
    if (post) return ['writing', post.id];
    const paper = papers.find((p) => slug(p.title) === base);
    if (paper) return ['papers', paper.id];
    const exp = experiments.find((x) => slug(x.title) === base);
    if (exp) return ['lab', exp.id];
    if (a === 'about.txt') return ['about'];
    if (a === 'hackathons.csv') return ['hackathons'];
    return null;
  };

  const run = (raw: string) => {
    const cmdline = raw.trim();
    print(<Prompt cwd={cwd} cmd={cmdline} />);
    if (!cmdline) return;
    setHistory((h) => [...h, cmdline]);
    setHIndex(-1);
    const [cmd, ...args] = cmdline.split(/\s+/);
    const arg = args.join(' ');

    switch (cmd) {
      case 'help':
        print(
          <div className="t-help">
            {[
              ['whoami', 'the short version'],
              ['ls [dir]', 'list files'],
              ['cd <dir>', 'change directory'],
              ['cat <file>', 'read a file'],
              ['open <app|file>', 'open in a window'],
              ['hackathons', 'results as a table'],
              ['neofetch', 'system info, with feeling'],
              ['theme <dawn|day|dusk|night|auto>', 'change wallpaper'],
              ['accent <name>', ACCENTS.map((a) => a.name.toLowerCase()).join(' | ')],
              ['history · clear · exit', ''],
            ].map(([c, d]) => (
              <div key={c}>
                <b>{c}</b>
                <span className="t-dim">{d}</span>
              </div>
            ))}
          </div>,
        );
        break;
      case 'whoami':
        print(
          <span>
            <b className="t-accent">{profile.name}</b> — {profile.role.toLowerCase()} in {profile.location}. {profile.tagline}
          </span>,
        );
        break;
      case 'pwd':
        print(cwd.replace('~', '/home/mikail'));
        break;
      case 'ls': {
        const dir = arg ? (arg.startsWith('~') ? arg : `${cwd === '~' ? '~' : cwd}/${arg}`).replace(/\/$/, '') : cwd;
        const entries = FS[dir];
        if (!entries) print(<span className="t-err">ls: {arg}: No such file or directory</span>);
        else
          print(
            <div className="t-ls">
              {entries
                .filter((e) => args.includes('-a') || !e.startsWith('.'))
                .map((e) => (
                  <span key={e} className={e.endsWith('/') ? 't-dir' : ''}>
                    {e}
                  </span>
                ))}
            </div>,
          );
        break;
      }
      case 'cd': {
        const target = !arg || arg === '~' ? '~' : arg === '..' ? '~' : `~/${arg.replace(/^~\//, '').replace(/\/$/, '')}`;
        if (FS[target]) setCwd(target);
        else print(<span className="t-err">cd: no such directory: {arg}</span>);
        break;
      }
      case 'cat': {
        const file = arg.replace(/^~\//, '');
        const path = cwd === '~' ? file : `${cwd.slice(2)}/${file}`;
        if (path === 'about.txt') profile.bio.forEach((p) => print(p));
        else if (path === '.secrets') print(<span className="t-warn">permission denied. the secret is: ship it, then polish it.</span>);
        else if (path === 'hackathons.csv') {
          print('date,event,placement,project');
          hackathons.forEach((h) => print(`${h.date},${h.event},${h.placement},${h.project}`));
        } else {
          const hit = resolveOpen(path);
          if (hit?.[0] === 'writing') {
            const p = posts.find((x) => x.id === hit[1])!;
            print(<b># {p.title}</b>, <span className="t-dim">{p.dek}</span>, <span className="t-dim">→ open {path} to read it properly</span>);
          } else if (hit?.[0] === 'papers') print(<span className="t-err">cat: {file}: binary file (try `open`)</span>);
          else print(<span className="t-err">cat: {arg || '(missing operand)'}: No such file</span>);
        }
        break;
      }
      case 'open': {
        const hit = arg ? resolveOpen(cwd === '~' || arg.includes('/') ? arg : `${cwd.slice(2)}/${arg}`) : null;
        if (!hit) print(<span className="t-err">open: can’t find “{arg}”. try: open lab</span>);
        else {
          print(<span className="t-dim">opening {APPS[hit[0]].title}…</span>);
          os.open(hit[0], { payload: hit[1] });
        }
        break;
      }
      case 'hackathons':
        print(
          <table className="t-table">
            <tbody>
              {hackathons.map((h) => (
                <tr key={h.id}>
                  <td className="t-dim">{h.date}</td>
                  <td className={h.placement === '1st' ? 't-accent' : ''}>{h.placement}</td>
                  <td>{h.project}</td>
                  <td className="t-dim">{h.city}</td>
                </tr>
              ))}
            </tbody>
          </table>,
        );
        break;
      case 'neofetch':
        print(
          <div className="t-neofetch">
            <pre className="t-accent">{NEOFETCH_ART}</pre>
            <div>
              <div>
                <b className="t-accent">mikail</b>@<b className="t-accent">os</b>
              </div>
              <div className="t-dim">-----------</div>
              {[
                ['OS', 'mikail.os 26.9 (Contour)'],
                ['Host', navigator.userAgent.includes('Mobile') ? 'Pocket edition' : 'Desktop edition'],
                ['Kernel', 'React 19 + a reducer'],
                ['Uptime', `${Math.round(performance.now() / 1000)}s`],
                ['Shell', 'tsh 1.0 (typescript shell)'],
                ['Resolution', `${window.innerWidth}×${window.innerHeight} @${window.devicePixelRatio}x`],
                ['Theme', `${theme} · accent ${ACCENTS.find((a) => a.value === settings.accent)?.name ?? 'custom'}`],
                ['Windows', String(os.state.order.length)],
              ].map(([k, v]) => (
                <div key={k}>
                  <b className="t-accent">{k}</b>: {v}
                </div>
              ))}
              <div className="t-swatches">
                {['#ff6b5f', '#ffc14d', '#35cc56', '#6cb8ee', '#a88cf5', settings.accent].map((c, i) => (
                  <i key={i} style={{ background: c }} />
                ))}
              </div>
            </div>
          </div>,
        );
        break;
      case 'theme': {
        const t = arg as ThemeName | 'auto';
        if (['dawn', 'day', 'dusk', 'night', 'auto'].includes(t)) {
          set('theme', t);
          print(<span className="t-dim">wallpaper → {t}</span>);
        } else print(<span className="t-err">usage: theme dawn|day|dusk|night|auto</span>);
        break;
      }
      case 'accent': {
        const a = ACCENTS.find((x) => x.name.toLowerCase() === arg.toLowerCase());
        if (a) {
          set('accent', a.value);
          print(<span style={{ color: a.value }}>accent → {a.name}</span>);
        } else print(<span className="t-err">usage: accent {ACCENTS.map((x) => x.name.toLowerCase()).join('|')}</span>);
        break;
      }
      case 'date':
        print(new Date().toString());
        break;
      case 'echo':
        print(arg);
        break;
      case 'history':
        history.forEach((h, i) => print(<span className="t-dim">{String(i + 1).padStart(4)} {h}</span>));
        break;
      case 'clear':
        setLines([]);
        break;
      case 'exit':
        os.close('terminal');
        break;
      case 'sudo':
      case 'rm':
        if (/rm\s+-rf/.test(cmdline)) {
          document.body.classList.add('is-shaking');
          setTimeout(() => document.body.classList.remove('is-shaking'), 600);
          print(<span className="t-warn">Nice try. This OS is read-only and emotionally resilient.</span>);
        } else print(<span className="t-warn">mikail is not in the sudoers file. This incident will be reported.</span>);
        break;
      default:
        print(<span className="t-err">tsh: command not found: {cmd}. try `help`</span>);
    }
  };

  const complete = () => {
    const parts = input.split(/\s+/);
    if (parts.length === 1) {
      const m = COMMANDS.filter((c) => c.startsWith(parts[0]));
      if (m.length === 1) setInput(`${m[0]} `);
      else if (m.length > 1) print(<Prompt cwd={cwd} cmd={input} />, <span className="t-dim">{m.join('  ')}</span>);
      return;
    }
    const last = parts[parts.length - 1];
    const pool = [...(FS[cwd] ?? []), ...(parts[0] === 'open' ? Object.keys(APPS) : [])];
    const m = pool.filter((e) => e.startsWith(last));
    if (m.length === 1) setInput([...parts.slice(0, -1), m[0]].join(' '));
    else if (m.length > 1) print(<Prompt cwd={cwd} cmd={input} />, <span className="t-dim">{m.join('  ')}</span>);
  };

  return (
    <div className="terminal" onClick={() => window.getSelection()?.isCollapsed && inputRef.current?.focus()}>
      <div className="terminal__scroll" ref={scrollRef}>
        {lines.map((l) => (
          <div key={l.id} className="t-line">
            {l.node}
          </div>
        ))}
        <form
          className="t-line t-input"
          onSubmit={(e) => {
            e.preventDefault();
            run(input);
            setInput('');
          }}
        >
          <PromptPrefix cwd={cwd} />
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Tab') {
                e.preventDefault();
                complete();
              } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                const i = hIndex === -1 ? history.length - 1 : Math.max(0, hIndex - 1);
                if (history[i] !== undefined) (setHIndex(i), setInput(history[i]));
              } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (hIndex === -1) return;
                const i = hIndex + 1;
                if (i >= history.length) (setHIndex(-1), setInput(''));
                else (setHIndex(i), setInput(history[i]));
              } else if (e.key === 'l' && e.ctrlKey) {
                e.preventDefault();
                setLines([]);
              }
            }}
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            aria-label="Terminal input"
            enterKeyHint="send"
          />
        </form>
        {mobile && (
          <div className="t-quick">
            {['help', 'neofetch', 'ls', 'hackathons', 'theme night', 'open lab'].map((c) => (
              <button key={c} onClick={() => run(c)}>
                {c}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function PromptPrefix({ cwd }: { cwd: string }) {
  return (
    <span className="t-prompt">
      <span className="t-accent">mikail@os</span> <span className="t-dir">{cwd}</span> <span className="t-dim">%</span>{' '}
    </span>
  );
}

function Prompt({ cwd, cmd }: { cwd: string; cmd: string }) {
  return (
    <span>
      <PromptPrefix cwd={cwd} />
      {cmd}
    </span>
  );
}
