export interface Hack {
  name: string
  place: string
  date: string
  event: string
  blurb: string
  stack: string[]
  team: number
}

export const hackathons: Hack[] = [
  {
    name: 'Latent Desk',
    place: '1st place',
    date: '2025-10-12',
    event: 'Lisbon AI Weekend',
    blurb: 'A spatial canvas for long LLM conversations. Threads become windows; windows remember. 36 hours, three people, one very tired GPU.',
    stack: ['React', 'WebGL', 'Postgres', 'pgvector'],
    team: 3,
  },
  {
    name: 'Metronome',
    place: 'Finalist',
    date: '2025-03-22',
    event: 'Stage & Screen Hack',
    blurb: 'Collaborative timing tool for theatre crews. I built the sync engine on WebRTC data channels with a drift-corrected clock.',
    stack: ['TypeScript', 'WebRTC', 'Rust'],
    team: 4,
  },
  {
    name: 'Papercut',
    place: '2nd place',
    date: '2024-11-09',
    event: 'Junction Helsinki',
    blurb: 'Turn a photographed receipt into a shared expense ledger. The trick was making the OCR corrections feel like editing a spreadsheet.',
    stack: ['SvelteKit', 'Tesseract', 'SQLite'],
    team: 2,
  },
  {
    name: 'Harbour',
    place: 'Best design',
    date: '2024-06-01',
    event: 'Web Summit Hack',
    blurb: 'A calm dashboard for small ports: tide, wind, arrivals. Mostly an excuse to draw tide curves with a single path element.',
    stack: ['React', 'D3', 'Deno'],
    team: 3,
  },
  {
    name: 'Ghostwriter',
    place: 'Honourable mention',
    date: '2023-09-16',
    event: 'HackZurich',
    blurb: 'A text editor where suggestions arrive as marginalia, never inline. The judges liked the restraint. So did I.',
    stack: ['Vue', 'CodeMirror', 'FastAPI'],
    team: 4,
  },
]

export interface Post {
  slug: string
  title: string
  date: string
  minutes: number
  dek: string
  body: string[]
}

export const posts: Post[] = [
  {
    slug: 'windows-that-remember',
    title: 'On windows that remember',
    date: '2026-08-14',
    minutes: 6,
    dek: 'Why the best software UI is furniture: it stays where you put it, ages gracefully, and never asks you to log in.',
    body: [
      'A desk is good because it is boring. You put a lamp on the left and tomorrow the lamp is still on the left. Nobody has to tell you where the lamp is. Most software does not offer this courtesy. It reflows, it re-ranks, it helpfully rearranges itself overnight because a metric went up somewhere.',
      'The window manager is the last place where most people still get to arrange their own space. A browser tab strip is a compromise; a stack of windows on a desktop is a decision. When I open this site on my laptop the About window is exactly where I dragged it a week ago, because I saved the coordinates to local storage and did nothing clever with them.',
      'There is a design instinct that says persistence is a burden: what if the user leaves a mess? But a mess you made yourself is a map. The tidy grid that greets you fresh every morning is a hotel room. I would rather build homes.',
      'So this site is a small argument. It is an OS-shaped portfolio not because the metaphor is cute, but because a desktop is the most honest way I know to say: here are some things I made, put them wherever you like, I will keep them there.',
    ],
  },
  {
    slug: 'the-dock-is-a-promise',
    title: 'The dock is a promise',
    date: '2026-05-02',
    minutes: 4,
    dek: 'Every persistent surface is a contract with the user about what will still be there tomorrow.',
    body: [
      'A dock is not navigation. Navigation answers "where can I go?"; a dock answers "what is running, and what do I reach for most?" The difference is the running indicator: that small dot is the entire product.',
      'When designers remove the dot, they usually do it for aesthetic reasons and the dock becomes a row of pretty buttons. The buttons still work, but the promise is gone. You can no longer glance and know the state of your machine.',
      'I think about this a lot when building dashboards. Most of them are docks without dots. They show what exists, not what is happening.',
    ],
  },
  {
    slug: 'motion-that-explains',
    title: 'Motion that explains, motion that decorates',
    date: '2026-01-19',
    minutes: 8,
    dek: 'A working taxonomy for deciding which animations earn their frame budget.',
    body: [
      'Every animation on a screen is doing one of three jobs: explaining where something came from, confirming that something happened, or decorating. The first two are worth almost any cost. The third is worth a little, once, and then it is worth less each time it plays.',
      'A window that scales up from its dock icon explains. A button that dips on press confirms. A gradient that breathes on the hero forever decorates, and by the third visit it is wallpaper in the bad sense.',
      'The test I use: if the animation were removed, would the user have to think harder? If yes, keep it and tune it. If no, ask whether it is beautiful enough to be furniture. Most are not.',
      'This site has one decorative animation: the sun in the wallpaper drifts a few pixels over a minute. I kept it because it is slow enough to be weather rather than a notification.',
    ],
  },
  {
    slug: 'container-queries-are-a-window-manager',
    title: 'Container queries are a window manager',
    date: '2025-11-03',
    minutes: 5,
    dek: 'Once components respond to their box instead of the viewport, resizing a window stops being a layout bug.',
    body: [
      'For years responsive design meant "responsive to the browser". The moment you put two panels side by side, that model breaks: the viewport is wide but each panel is narrow, and your media queries lie to you.',
      'Container queries fix the lie. Every window on this site is a container. The Writing app shows two panes when its window is wide and a single list when it is narrow, and the same code runs on the phone as a full-screen sheet with no special casing.',
      'It is a small thing that makes the whole metaphor hold together. Resize a window and the app inside behaves like an app, not like a web page being squeezed.',
    ],
  },
]

export interface Experiment {
  id: string
  title: string
  note: string
  demo: 'orbit' | 'wave' | 'conic' | 'grid' | 'cursor' | 'spring'
  year: string
}

export const experiments: Experiment[] = [
  { id: 'orbit', title: 'Orbits without JS', note: 'Three satellites on offset-path, phase-shifted with animation-delay.', demo: 'orbit', year: '2026' },
  { id: 'wave', title: 'Audio-ish bars', note: 'Twelve bars, one keyframe, staggered by nth-child. Looks like sound, costs nothing.', demo: 'wave', year: '2026' },
  { id: 'conic', title: 'Conic loader', note: 'A conic-gradient masked to a ring. Rotates the gradient, not the element.', demo: 'conic', year: '2025' },
  { id: 'grid', title: 'Breathing grid', note: 'A 6x6 grid pulsing along a diagonal via calc() on row and column.', demo: 'grid', year: '2025' },
  { id: 'cursor', title: 'Typewriter that knows when to stop', note: 'steps() timing plus a blinking caret that parks at the end.', demo: 'cursor', year: '2024' },
  { id: 'spring', title: 'Linear() spring', note: 'A real spring curve baked into the linear() easing function. No library.', demo: 'spring', year: '2024' },
]

export interface Paper {
  title: string
  venue: string
  year: string
  kind: 'analysis' | 'reading note' | 'talk'
  abstract: string
  tags: string[]
}

export const papers: Paper[] = [
  {
    title: 'Where do users put their windows? A 30-day trace of one desktop',
    venue: 'Self-published analysis',
    year: '2026',
    kind: 'analysis',
    abstract: 'I logged every window move on my own machine for a month. Windows cluster in three zones; 71% of moves are corrections of less than 40px; maximised windows are almost never un-maximised. Implications for default placement.',
    tags: ['telemetry', 'window management', 'n=1'],
  },
  {
    title: 'Notes on "The Humane Interface" twenty-five years on',
    venue: 'Reading note',
    year: '2025',
    kind: 'reading note',
    abstract: 'Raskin argued against modes and for persistence. Modern tab-based software is mostly modes with persistence bolted on. A fair reappraisal of what held up and what did not.',
    tags: ['HCI', 'Raskin', 'modes'],
  },
  {
    title: 'The cost of a spring: measuring frame budgets for animated window chrome',
    venue: 'Frontend meetup, Lisbon',
    year: '2025',
    kind: 'talk',
    abstract: 'Backdrop blur is the most expensive pixel on the web. Numbers from six devices, a budget table, and three cheats that keep glass under 4ms a frame.',
    tags: ['performance', 'backdrop-filter', 'motion'],
  },
  {
    title: 'Fitts on a phone: reach maps for one-handed sheet dismissal',
    venue: 'Self-published analysis',
    year: '2024',
    kind: 'analysis',
    abstract: 'Where a close button should go if the user is holding a 6.1 inch phone in the right hand. Spoiler: not the top-left corner, and probably not a button at all.',
    tags: ['mobile', 'ergonomics', 'gestures'],
  },
]

export interface TrashItem {
  id: string
  name: string
  kind: string
  deleted: string
  size: string
}

export const trashSeed: TrashItem[] = [
  { id: 't1', name: 'jquery.parallax-hero.js', kind: 'Plugin, 2014', deleted: '2019-02-11', size: '38 KB' },
  { id: 't2', name: 'portfolio-v3-final-FINAL.sketch', kind: 'Sketch file', deleted: '2021-07-30', size: '412 MB' },
  { id: 't3', name: 'redux-boilerplate', kind: 'Folder', deleted: '2022-01-05', size: '1.2 GB' },
  { id: 't4', name: 'hamburger-menu-animation.gif', kind: 'GIF', deleted: '2023-03-19', size: '6.4 MB' },
  { id: 't5', name: 'startup-idea-notes.md', kind: 'Markdown', deleted: '2024-10-02', size: '2 KB' },
  { id: 't6', name: 'carousel (autoplay)', kind: 'Component', deleted: '2025-05-14', size: '91 KB' },
]
