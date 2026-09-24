# mikail.xyz — temporary holding page

Matte dark / liquid-glass-lite **holding page** for [mikail.xyz](https://mikail.xyz) while the full personal-OS desktop release is finished.

Taste reference: [liquid-glass-v2](https://mikailr.github.io/GUI/previews/liquid-glass-v2/) (blur panel, squircle mark). Content shaped from the GUI handoff `profile-stub.json`.

This is **not** the OS window-manager site and **not** a Win98 prototype. One quiet screen: name, headline, short builder line, one redesign teaser, real links only.

## Open locally

```bash
cd mikail-holding
python3 -m http.server 8765
# → http://localhost:8765
```

Or open `index.html` directly (relative assets; works offline aside from the Inter webfont).

## Contents

| Path | Role |
|---|---|
| `index.html` | Markup |
| `styles.css` | Matte stage + frosted card |
| `app.js` | Tiny date stamp |
| `assets/portrait-seed.svg` | Squircle avatar (handoff seed) |
| `assets/favicon.svg` | Squircle mark |
| `profile-stub.json` | ContentClient-shaped stub (email null; avatarMediaId kept) |

## Demo / preview host

https://mikailr.github.io/GUI/previews/holding/

Does **not** touch mikail.xyz production.

## Taste / content rules

- Matte dark void, soft indigo/blue glows, frosted panel, squircle portrait
- Headline from stub: *I build small systems and swap the skin later.*
- One teaser only: desktop & simple modes / multiplexer + swappable shells
- CTAs: GitHub, Lab (GUI board), live demos — no email (null in stub), no notify-me
- No green accents, no particle wallpaper, no Win98 chrome
