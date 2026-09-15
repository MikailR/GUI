import { useEffect, useRef, useState } from 'react'
import { useOS } from '../os/store'
import { APPS } from '../os/apps'
import type { AppId } from '../os/types'
import { ABOUT, EXPERIMENTS, HACKATHONS, POSTS } from '../content/data'

type Line = { kind: 'in' | 'out' | 'err'; text: string }

const FILES: Record<string, string> = {
  'about.md': `# ${ABOUT.name}\n${ABOUT.role} · ${ABOUT.location}\n\n${ABOUT.bio[0]}`,
  'now.txt': ABOUT.now.map((n) => `- ${n}`).join('\n'),
  'hackathons.csv': ['date,event,project,place', ...HACKATHONS.map((h) => `${h.date},${h.event},${h.project},${h.place}`)].join('\n'),
  'posts.txt': POSTS.map((p) => `${p.date}  ${p.title}`).join('\n'),
  'lab.txt': EXPERIMENTS.map((e) => `${e.id}  ${e.title} — ${e.blurb}`).join('\n'),
  '.secret': 'Nice. There is nothing here, but I respect the instinct.',
}
const COMMANDS = ['help', 'ls', 'cat', 'open', 'whoami', 'neofetch', 'clear', 'date', 'echo', 'theme', 'uptime', 'pwd', 'exit', 'sudo']
const OPENABLE = Object.keys(APPS) as AppId[]

const NEOFETCH = String.raw`
  __  __   Mikail OS 1.0 "Dusk"
 |  \/  |  ─────────────────────
 | \  / |  Host:     a personal site
 | |\/| |  Kernel:   React 19 / Vite
 | |  | |  Shell:    fake-zsh
 |_|  |_|  WM:       mikail-wm (custom)
           Theme:    __THEME__
           Uptime:   __UPTIME__
           Packages: 2 (react, react-dom)
`.trim()

export default function Terminal() {
  const os = useOS()
  const [lines, setLines] = useState<Line[]>([
    { kind: 'out', text: 'Mikail OS fake-zsh · type `help` to get started.' },
  ])
  const [input, setInput] = useState('')
  const [hist, setHist] = useState<string[]>([])
  const [hi, setHi] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const endRef = useRef<HTMLDivElement>(null)
  const start = useRef(Date.now())

  useEffect(() => { endRef.current?.scrollIntoView({ block: 'end' }) }, [lines])

  const uptime = () => {
    const s = Math.floor((Date.now() - start.current) / 1000)
    return `${Math.floor(s / 60)}m ${s % 60}s`
  }

  const run = (raw: string): Line[] => {
    const [cmd, ...args] = raw.trim().split(/\s+/)
    const out = (text: string): Line[] => [{ kind: 'out', text }]
    const err = (text: string): Line[] => [{ kind: 'err', text }]
    switch (cmd) {
      case '': return []
      case 'help': return out(['Available commands:', '  help            this', '  ls              list files', '  cat <file>      read a file', '  open <app>      open a window (' + OPENABLE.join(', ') + ')', '  theme dusk|dawn switch theme', '  neofetch        system info, but pretty', '  whoami · date · uptime · pwd · echo · clear · exit'].join('\n'))
      case 'ls': return out(Object.keys(FILES).filter((f) => args.includes('-a') || !f.startsWith('.')).join('   '))
      case 'cat': {
        if (!args[0]) return err('cat: missing file')
        const f = FILES[args[0]]
        return f === undefined ? err(`cat: ${args[0]}: No such file`) : out(f)
      }
      case 'open': {
        const id = args[0] as AppId
        if (!id) return err('open: which app?')
        if (!OPENABLE.includes(id)) return err(`open: unknown app "${id}"`)
        os.open(id)
        return out(`Opening ${APPS[id].title}…`)
      }
      case 'whoami': return out('guest (but you can call yourself whatever you like)')
      case 'pwd': return out('/Users/mikail/Desktop')
      case 'date': return out(new Date().toString())
      case 'uptime': return out(`up ${uptime()}, 1 user, load average: 0.00 (it is a website)`)
      case 'echo': return out(args.join(' '))
      case 'theme': {
        if (args[0] === 'dusk' || args[0] === 'dawn') { os.setTheme(args[0]); return out(`Theme set to ${args[0]}.`) }
        return err('usage: theme dusk|dawn')
      }
      case 'neofetch': return out(NEOFETCH.replace('__THEME__', os.state.theme).replace('__UPTIME__', uptime()))
      case 'sudo': return err('guest is not in the sudoers file. This incident will be reported to nobody.')
      case 'exit': {
        const w = os.state.windows.find((x) => x.app === 'terminal')
        if (w) os.close(w.id)
        return []
      }
      case 'clear': return []
      default: return err(`zsh: command not found: ${cmd}`)
    }
  }

  const submit = () => {
    const raw = input
    setInput('')
    setHi(-1)
    if (raw.trim()) setHist((h) => [raw, ...h].slice(0, 50))
    if (raw.trim() === 'clear') { setLines([]); return }
    setLines((l) => [...l, { kind: 'in', text: raw }, ...run(raw)])
  }

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') submit()
    else if (e.key === 'ArrowUp') { e.preventDefault(); const n = Math.min(hist.length - 1, hi + 1); setHi(n); setInput(hist[n] ?? '') }
    else if (e.key === 'ArrowDown') { e.preventDefault(); const n = Math.max(-1, hi - 1); setHi(n); setInput(n < 0 ? '' : hist[n]) }
    else if (e.key === 'Tab') {
      e.preventDefault()
      const parts = input.split(' ')
      const pool = parts.length > 1 ? (parts[0] === 'open' ? OPENABLE : Object.keys(FILES)) : COMMANDS
      const m = pool.filter((c) => c.startsWith(parts[parts.length - 1]))
      if (m.length === 1) { parts[parts.length - 1] = m[0]; setInput(parts.join(' ') + ' ') }
      else if (m.length > 1) setLines((l) => [...l, { kind: 'out', text: m.join('   ') }])
    } else if (e.key === 'c' && e.ctrlKey) { setInput(''); setLines((l) => [...l, { kind: 'in', text: input + '^C' }]) }
    else if (e.key === 'l' && e.ctrlKey) { e.preventDefault(); setLines([]) }
  }

  return (
    <div className="app scroll" style={{ background: 'rgba(0,0,0,0.45)', flexDirection: 'column', padding: '10px 14px', fontFamily: 'var(--mono)', fontSize: 12.5, lineHeight: 1.5, cursor: 'text' }} onClick={() => inputRef.current?.focus()}>
      {lines.map((l, i) => (
        <div key={i} style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', color: l.kind === 'err' ? '#ff7b72' : l.kind === 'in' ? 'var(--text)' : '#b8e0c8' }}>
          {l.kind === 'in' && <span style={{ color: 'var(--accent)' }}>guest@mikail ~ % </span>}
          {l.text}
        </div>
      ))}
      <div style={{ display: 'flex' }}>
        <span style={{ color: 'var(--accent)', whiteSpace: 'pre' }}>guest@mikail ~ % </span>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKey}
          autoFocus
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          style={{ flex: 1, background: 'none', border: 0, outline: 0, fontFamily: 'inherit', fontSize: 'inherit', color: 'inherit', padding: 0, caretColor: 'var(--accent)' }}
          aria-label="Terminal input"
        />
      </div>
      <div ref={endRef} />
    </div>
  )
}
