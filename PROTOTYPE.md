# PROTOTYPE — claude-design

**Model:** `claude-fable-5-1` (Claude Fable 5.1), driving the Claude Design MCP (`https://api.anthropic.com/v1/design/mcp`) for direction exploration, then implementing in Vite + React + TypeScript.

**Visual direction (assumed, since the run was autonomous):** a warm-nocturnal desk at dusk. A CSS-only wallpaper of a violet-to-ember sky, a half-set amber sun and drifting topographic contour rings; smoked-glass windows with hairline rings and monochrome traffic lights that only take colour on hover; Instrument Serif for display type, Space Grotesk for UI, JetBrains Mono for chrome labels like `abt.app`. The dock is macOS-language (magnification, running dots) but with its own tile system; on phones the same window store renders as stacked sheets with an app switcher.

## Run

```bash
npm install
npm run build     # must succeed
npm run dev       # or: npm run preview after build
```

## How Design MCP shaped the result

1. **Direction before code.** `get_claude_design_prompt` and the `frontend-design` skill set the rules that governed every later choice: commit to one bold direction, oklch accents sharing chroma/lightness (amber `oklch(0.80 0.14 75)` and sage `oklch(0.80 0.14 180)`), toned rather than pure blacks and whites, no hand-drawn complex SVGs (all icon glyphs are circles, rects and strokes; the "PDF" thumbnails are striped placeholders), no emoji, and a warning against generic fonts, which is why the type stack is Instrument Serif / Space Grotesk / JetBrains Mono rather than Inter.
2. **A rendered mockup as the contract.** Before writing React, a two-frame canvas (`Mikail OS Direction.dc.html`, desktop 1440×900 and phone 390×844) was written to a Claude Design project and rendered via `render_preview`, then screenshotted with headless Chrome. That image fixed the wallpaper recipe (gradient stops, sun clip-path, contour ring spacing, grain), the window chrome (40px title bar, lights left, `code.app · n of m` right), the desktop icon column on the right, the dock proportions, and the mobile idea of sheets that peek out behind the top sheet. The production CSS tokens were transcribed from that file almost line for line.
3. **Content-first framing.** The prompt's "no filler, every element earns its place" pushed the apps toward fewer, denser artefacts: a timeline of five hackathons with dates and stacks, four full essays with a two-pane reader driven by container queries, six live CSS experiments, four papers with abstracts, a trash table you can actually empty.
4. **Verify loop.** The design prompt's render → gate → fresh-eyes loop was applied to the built app: desktop and mobile screenshots were taken from the Vite preview with headless Chrome and used to correct spacing and hierarchy before finishing.

Design project (editor link, may require access): https://claude.ai/design/p/286cf514-066f-47df-ad66-5325f34786f5?file=Mikail+OS+Direction.dc.html

## Key files

| File | Role |
| --- | --- |
| `src/os/store.tsx` | Window-manager reducer: open/close/focus/minimise/maximise/move/resize/tile/cycle, settings, trash, persistence |
| `src/os/Window.tsx` | Glass window: pointer-capture drag, edge/corner resize, spring enter/exit, maximise transition |
| `src/os/Dock.tsx` | Dock with motion-value magnification and running indicators |
| `src/os/Desktop.tsx` | Desktop shell and keyboard shortcuts (Esc, ⌘/Ctrl W/M/↑/`/K/T, Alt 1–7, ?) |
| `src/os/MenuBar.tsx` | Working menus (Go, Window: tile/cycle/reset, app menu), clock |
| `src/os/Launcher.tsx` | ⌘K launcher over apps, essays, wallpapers and commands |
| `src/os/Mobile.tsx` | Phone shell: home grid, stacked sheets with drag-to-home, app switcher with live previews |
| `src/os/Wallpaper.tsx` + `src/styles.css` | Layered CSS wallpaper (three variants), glass chrome, mobile shell |
| `src/apps/*.tsx`, `src/apps.css` | Eight apps with container-query layouts and CSS-only lab demos |
| `src/data/content.ts` | Placeholder content written to read as real |
