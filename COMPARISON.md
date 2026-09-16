# Comparison — bakeoff + Win98×XP iteration

Same brief. Five frozen benchmarks, plus a nostalgia iteration. Short takes after build + skim of each direction.

## grok-4.6 (Grok CLI · grok-4.6)
**Helios OS** — dusk-indigo desktop with an ember sun, glass windows, Fraunces + Outfit type, macOS dock/menu bar, Spotlight, boot splash, and a dedicated mobile home. Feels cohesive and “productized”; the strongest single-metaphor commitment of the set. Slightly safer/editorial than wild.

## fable-5.1 (Claude Code · claude-fable-5-1)
Aurora wallpaper under frosted chrome, dawn/dusk themes, Gaussian dock magnification, genie minimize, Terminal with `neofetch`, and a dense Lab of live experiments (metaballs, boids, dither…). Most playful systems polish — the one that most wants you to *fidget* with the OS itself.

## opus-5 (Claude Code · claude-opus-5)
`mikail.os` with dusk/dawn/day sky layers, Spotlight, toasts, full window manager, and a real mobile sheet shell. Biggest CSS surface area (~63kB) and a very complete chrome set. Direction is tasteful and deep; layered wallpaper work stands out.

## gpt-6-astra (Codex · gpt-6-astra)
Warm olive/paper editorial desktop with custom self-hosted fonts, illustrated computer art, and content-forward Writing/Hackathons/Lab pages. Feels more like a designed *room* than a clone of macOS — distinctive typography and quieter chrome. Fewer OS toys than Fable/Opus, stronger art direction in the content panes.

## claude-design (Claude Code + Design MCP · fable-5.1)
Warm-nocturnal desk guided by Claude Design MCP: mockup-first (desktop + phone frames), oklch amber/sage tokens, Instrument Serif / Space Grotesk / JetBrains Mono, smoked-glass windows, contour-ring wallpaper. Clearest “design system before code” story — see branch `PROTOTYPE.md` for the MCP influence trail. Motion (framer-motion) and chrome feel intentional.

## win98-xp (Codex · gpt-6-astra · iteration)
**Curiosity XP** — deliberate Windows 98×XP hybrid: gray bevels, Luna blue titlebars, green Start, original bliss-inspired SVG hills. Unified Lab Explorer with **22** live experiments collected from all five prior prototypes. Mobile is a true phone-OS (home icon grid → full-screen activities with Back), not a shrunk window manager. Keeps Astra’s content hierarchy under nostalgic chrome.

## Pick guide
- Want **classic FE-engineer wow + toys** → `fable-5.1` or `opus-5`
- Want **tight product metaphor** → `grok-4.6`
- Want **editorial / type-led** → `gpt-6-astra`
- Want **design-process provenance** → `claude-design`
- Want **Win98/XP nostalgia + unified Lab** → `win98-xp`
