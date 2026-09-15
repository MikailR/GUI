import { useEffect, useRef, useState } from 'react'
import { APPS, type AppId } from './registry'
import { hackathons, posts } from '../data/content'
import { useOS } from '../os/store'

interface Line {
  kind: 'in' | 'out' | 'err'
  text: string
}

const BANNER = `Mikail OS shell (msh) 0.1 — type 'help' to see what humours you.`

export function Terminal() {
  const os = useOS()
  const [lines, setLines] = useState<Line[]>([{ kind: 'out', text: BANNER }])
  const [cmd, setCmd] = useState('')
  const [hist, setHist] = useState<string[]>([])
  const [hi, setHi] = useState(-1)
  const input = useRef<HTMLInputElement>(null)
  const end = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = end.current?.parentElement
    if (el) el.scrollTop = el.scrollHeight
  }, [lines])

  const print = (text: string, kind: Line['kind'] = 'out') => setLines((l) => [...l, { kind, text }])

  const run = (raw: string) => {
    const [name, ...args] = raw.trim().split(/\s+/)
    if (!name) return
    setLines((l) => [...l, { kind: 'in', text: raw }])
    switch (name) {
      case 'help':
        print(['help          this list', 'ls            list apps', 'open <app>    open a window (about, lab, writing…)', 'close <app>   close a window', 'cat about.md  who is this', 'hack          hackathon results', 'posts         essay titles', 'wall <name>   dusk | night | dawn', 'neofetch      system info', 'clear         clear screen', 'whoami, date, uptime, exit'].join('\n'))
        break
      case 'ls':
        print(APPS.map((a) => `${a.code}.app`.padEnd(10) + a.title).join('\n'))
        break
      case 'open': {
        const a = APPS.find((x) => x.id === args[0] || x.code === args[0])
        if (!a) return print(`open: no app named '${args[0] ?? ''}'`, 'err')
        os.open(a.id)
        print(`opening ${a.title}…`)
        break
      }
      case 'close': {
        const a = APPS.find((x) => x.id === args[0] || x.code === args[0])
        if (!a) return print(`close: no app named '${args[0] ?? ''}'`, 'err')
        os.close(a.id as AppId)
        break
      }
      case 'cat':
        if (args[0] === 'about.md') print('# Mikail\nFront-end engineer in Lisbon. Builds interfaces that feel like places.\nStack: React, TypeScript, WebGL. Weekends: Rust, bread.')
        else print(`cat: ${args[0] ?? ''}: No such file`, 'err')
        break
      case 'hack':
        print(hackathons.map((h) => `${h.date}  ${h.place.padEnd(19)} ${h.name} @ ${h.event}`).join('\n'))
        break
      case 'posts':
        print(posts.map((p) => `${p.date}  ${p.title}`).join('\n'))
        break
      case 'wall':
        if (args[0] === 'dusk' || args[0] === 'night' || args[0] === 'dawn') {
          os.setSettings({ wallpaper: args[0] })
          print(`wallpaper → ${args[0]}`)
        } else print('usage: wall dusk|night|dawn', 'err')
        break
      case 'neofetch':
        print(
          [
            '   ____   mikail@os',
            '  / __ \\  ---------',
            ' / / / /  OS: Mikail OS 0.1 "Dusk"',
            '/ /_/ /   Shell: msh 0.1',
            '\\____/    WM: react-reducer-wm',
            `          Windows: ${os.state.wins.length} open`,
            `          Res: ${window.innerWidth}x${window.innerHeight}`,
            '          Font: Space Grotesk / Instrument Serif',
          ].join('\n'),
        )
        break
      case 'whoami':
        print('guest (no login required)')
        break
      case 'date':
        print(new Date().toString())
        break
      case 'uptime':
        print(`${Math.round(performance.now() / 1000)}s since boot`)
        break
      case 'clear':
        setLines([])
        break
      case 'exit':
        os.close('terminal')
        break
      case 'sudo':
        print('nice try.', 'err')
        break
      default:
        print(`msh: command not found: ${name}`, 'err')
    }
  }

  return (
    <div className="term" onClick={() => input.current?.focus()}>
      {lines.map((l, i) => (
        <pre key={i} className={`term-line ${l.kind}`}>
          {l.kind === 'in' ? <span className="term-ps">mikail@os ~ % </span> : null}
          {l.text}
        </pre>
      ))}
      <form
        className="term-input"
        onSubmit={(e) => {
          e.preventDefault()
          run(cmd)
          if (cmd.trim()) setHist((h) => [cmd, ...h].slice(0, 50))
          setHi(-1)
          setCmd('')
        }}
      >
        <span className="term-ps">mikail@os ~ % </span>
        <input
          ref={input}
          value={cmd}
          autoFocus
          spellCheck={false}
          autoCapitalize="off"
          aria-label="command"
          onChange={(e) => setCmd(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowUp') {
              e.preventDefault()
              const n = Math.min(hist.length - 1, hi + 1)
              setHi(n)
              setCmd(hist[n] ?? '')
            } else if (e.key === 'ArrowDown') {
              e.preventDefault()
              const n = Math.max(-1, hi - 1)
              setHi(n)
              setCmd(n === -1 ? '' : hist[n])
            } else if (e.key === 'Tab') {
              e.preventDefault()
              const m = APPS.find((a) => a.id.startsWith(cmd.replace(/^open\s+/, '')))
              if (m && cmd.startsWith('open ')) setCmd(`open ${m.id}`)
            }
          }}
        />
      </form>
      <div ref={end} />
    </div>
  )
}
