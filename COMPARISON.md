# Comparison — five mini operating systems

Same brief. Five models. Short takes after build + skim of each direction.

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

## Pick guide
- Want **classic FE-engineer wow + toys** → `fable-5.1` or `opus-5`
- Want **tight product metaphor** → `grok-4.6`
- Want **editorial / type-led** → `gpt-6-astra`
- Want **design-process provenance** → `claude-design`
