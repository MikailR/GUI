# Comparison — bakeoff + Windows and Liquid Glass iterations

Same brief. Five frozen benchmarks, plus two nostalgia iterations and one Apple Liquid Glass iteration. Short takes after build + skim of each direction.

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

## win98-classic (Codex CLI · gpt-6-astra · iteration)
**Mikail’s Personal Computer** — classic 98 gray bevels, navy active captions, teal dither, original pixel-grid icons, and a gray Start button. A unified Explorer Lab collects 22 locally implemented experiments. Mobile opens on a dimensional handheld-style surface with inset teal panels and raised icon wells; apps become full-screen activities with Back. Build and render checks pass; browser interaction validation was blocked by the execution sandbox.

## liquid-glass (Cursor Cloud Agent · claude-fable-5-1 · iteration)
**Mikail OS — Liquid Glass** — commits to Apple's current material on both form factors: a transparent Tahoe-style menu bar with working menus and a Control Center, a floating glass Dock with Gaussian magnification, frosted windows with a masked specular rim and a calmer content surface, Spotlight, and four generative canvas wallpapers. Below 820px it stops pretending to be a desktop and becomes iOS: glass widgets, a squircle home grid, full-screen apps with collapsing large titles and floating **‹ Home / ‹ Back / ×** pills, hash-mirrored history. The Lab is eight material and motion toys (glass workbench with edge refraction, liquid lens, spring → `linear()` baker). Most disciplined material system of the set; the wallpaper ribbons are the one place it flirts with generic.

## Pick guide
- Want **classic FE-engineer wow + toys** → `fable-5.1` or `opus-5`
- Want **tight product metaphor** → `grok-4.6`
- Want **editorial / type-led** → `gpt-6-astra`
- Want **design-process provenance** → `claude-design`
- Want **Win98/XP nostalgia + unified Lab** → `win98-xp`

- Want **classic Windows 98 + a tactile mobile home** → `win98-classic`
- Want **Apple Liquid Glass + a real iOS phone shell** → `liquid-glass`
