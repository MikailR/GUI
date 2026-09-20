import type { TrashItem } from '../os/types'

/* ---------------------------------------------------------------- About */

export const ABOUT = {
  name: 'Mikail',
  role: 'Software engineer · interfaces, motion, rendering',
  location: 'Helsinki · UTC+3',
  tagline: 'I build interfaces that feel like software, not web pages.',
  bio: [
    'Eight years on the pointy end of the stack: design systems, editors, canvases, and interaction work where four milliseconds is the whole story. I care about motion that explains, keyboards that work, and materials that stay legible when the wallpaper fights back.',
    'Currently leading front-end on a collaborative whiteboard. Before that: a fintech design system used by forty teams, and a season of e-ink dashboards that taught me more about rendering than any browser did.',
  ],
  now: [
    { label: 'Building', value: 'a canvas renderer that survives 10k nodes' },
    { label: 'Reading', value: 'about CRDTs, slowly' },
    { label: 'Listening', value: 'to a lot of Floating Points' },
    { label: 'Learning', value: 'to ski, badly' },
  ],
  skills: [
    'TypeScript',
    'React',
    'Canvas & WebGL',
    'CSS architecture',
    'Motion design',
    'Accessibility',
    'Performance profiling',
    'Design systems',
    'Vite',
    'Node',
  ],
  links: [
    { label: 'GitHub', href: 'https://github.com/MikailR', glyph: 'github' },
    { label: 'Email', href: 'mailto:hi@example.com', glyph: 'mail' },
    { label: 'Bluesky', href: 'https://bsky.app/', glyph: 'butterfly' },
  ],
} as const

/* ------------------------------------------------------------ Hackathons */

export type Placement = 'Winner' | 'Runner-up' | 'Finalist' | 'Best UI' | 'Crowd favourite'

export interface Hackathon {
  id: string
  event: string
  date: string
  project: string
  place: Placement
  blurb: string
  detail: string[]
  stack: string[]
  hours: number
  team: number
  /** Hue used for the project's glass tile. */
  hue: number
}

export const HACKATHONS: Hackathon[] = [
  {
    id: 'marginalia',
    event: 'Junction 2026',
    date: '2026-06-13',
    project: 'Marginalia',
    place: 'Winner',
    blurb: 'A shared reading layer that turns any PDF into a live, annotated group chat.',
    detail: [
      'Every highlight becomes a thread anchored to the text, and every cursor is visible to the room. I built the realtime cursor sync and a custom PDF text-layer renderer that keeps selection accurate at every zoom level.',
      'The judges’ favourite detail was the “quiet mode”: annotations fade to a faint glass tint until you hover, so the document stays readable when forty people are marking it up.',
    ],
    stack: ['React', 'WebRTC', 'pdf.js', 'CRDT'],
    hours: 48,
    team: 4,
    hue: 212,
  },
  {
    id: 'tapestry',
    event: 'Hack the North',
    date: '2026-01-31',
    project: 'Tapestry',
    place: 'Best UI',
    blurb: 'Visual git history as a woven fabric. Each branch is a thread, merges are knots.',
    detail: [
      'Drag a knot to time-travel the repository; the working tree updates underneath in a sandboxed checkout. The whole visualisation is a single canvas with a custom hit-test map.',
      'Written in 36 hours with three people and one shared bug: we all thought rebase was somebody else’s job.',
    ],
    stack: ['Canvas', 'TypeScript', 'isomorphic-git'],
    hours: 36,
    team: 3,
    hue: 286,
  },
  {
    id: 'ledgerlight',
    event: 'ETHGlobal Lisbon',
    date: '2025-10-18',
    project: 'Ledgerlight',
    place: 'Finalist',
    blurb: 'A wallet UI that explains every transaction in plain language before you sign.',
    detail: [
      'Progressive disclosure done properly: a one-line summary, then the parties, then the raw calldata, each layer a sheet that slides over the last. Nothing is hidden, nothing is shouted.',
    ],
    stack: ['Next.js', 'wagmi', 'Framer Motion'],
    hours: 40,
    team: 2,
    hue: 160,
  },
  {
    id: 'slowfall',
    event: 'Nordic Game Jam',
    date: '2025-04-05',
    project: 'Slowfall',
    place: 'Crowd favourite',
    blurb: 'A one-button browser game about a leaf. A 2KB shader and a spring simulation.',
    detail: [
      'Hold to catch the wind, release to fall. The leaf’s motion is a damped spring driven by a noise field, and the entire game fits in a tweet-sized fragment shader plus a page of JavaScript.',
    ],
    stack: ['WebGL', 'GLSL', 'Vanilla JS'],
    hours: 48,
    team: 1,
    hue: 36,
  },
  {
    id: 'quietroom',
    event: 'HackZurich',
    date: '2024-09-21',
    project: 'Quietroom',
    place: 'Runner-up',
    blurb: 'Meeting-room booking that runs on a €30 e-ink display: 1-bit dithered React.',
    detail: [
      'I built the rendering pipeline: React renders to a canvas, the canvas is ordered-dithered to one bit, and the result is pushed to a Raspberry Pi over the network at two frames a minute. It looks like paper and costs nothing to run.',
    ],
    stack: ['React', 'Node', 'Raspberry Pi'],
    hours: 40,
    team: 4,
    hue: 8,
  },
  {
    id: 'parallax',
    event: 'Junction 2024',
    date: '2024-11-09',
    project: 'Parallax',
    place: 'Winner',
    blurb: 'An accessibility overlay that re-renders any page as a keyboard-first outline.',
    detail: [
      'Shipped as a Chrome extension during the event. It walks the accessibility tree, not the DOM, so it sees what a screen reader sees, and renders it as a high-contrast document you can navigate entirely with the arrow keys.',
    ],
    stack: ['Chrome MV3', 'TypeScript', 'Shadow DOM'],
    hours: 48,
    team: 3,
    hue: 248,
  },
]

/* --------------------------------------------------------------- Writing */

export interface Post {
  slug: string
  title: string
  date: string
  tag: string
  readMins: number
  summary: string
  /**
   * Paragraphs. Prefix conventions:
   *   "## "  heading · "> " pull quote · "```…```" code block
   */
  body: string[]
}

export const POSTS: Post[] = [
  {
    slug: 'glass-that-earns-its-blur',
    title: 'Glass that earns its blur',
    date: '2026-08-11',
    tag: 'Materials',
    readMins: 6,
    summary:
      'Liquid glass is not a blur radius. It is a set of promises about what sits above what, and a rim that tells you where the edge is.',
    body: [
      'Frosted glass is the fastest way to make a UI look expensive and the fastest way to make it unreadable. The difference is whether the blur is doing a job. Apple’s recent material does three jobs at once, and most imitations only do the first.',
      '## Job one: hierarchy',
      'Translucency says “this sits above the thing behind it, and the thing behind is still there.” That is useful for a menu bar, a dock, a floating toolbar. It is useless for a document body, because nothing behind a document is worth remembering. So the windows on this site keep their chrome translucent and their content calm.',
      '## Job two: the edge',
      'The part people miss is the rim. A real pane of glass is brightest at its edges, where light enters and bends. The material here draws a one-pixel gradient ring that catches light on the top-left and bottom-right, plus a soft inner band. Take the rim away and the surface reads as a grey rectangle. Put it back and it reads as an object.',
      '```\n.glass::before {\n  padding: 1px;\n  background: linear-gradient(135deg, white, transparent 46%, transparent 58%, white);\n  mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);\n  mask-composite: exclude;\n}\n```',
      '## Job three: vibrancy',
      'The `saturate()` in the backdrop filter is what keeps the wallpaper colours alive through the glass instead of turning them grey. It costs nothing extra: the filter chain is already running.',
      '> Blur radius is a design decision, not a default. 12px says “sheet of paper”. 30px says “thick pane”.',
      'Every backdrop-filter layer is a separate compositing pass. Six is fine on any phone made this decade. Sixty is not. Keep glass on chrome, keep content opaque, and never blur inside a scroll container.',
    ],
  },
  {
    slug: 'the-layout-thrash-you-can-hear',
    title: 'The layout thrash you can hear',
    date: '2026-05-14',
    tag: 'Performance',
    readMins: 5,
    summary:
      'Why a 3ms forced reflow feels worse than a 30ms task, and the profiling habit that finally fixed it for me.',
    body: [
      'There is a category of jank that does not show up as a long task. The main thread is barely busy, the flame chart is mostly idle, and yet the drag handle stutters like it is running on a potato. It took me embarrassingly long to learn that this is almost always a forced synchronous layout inside an event handler.',
      '## Read, then write. Never interleave.',
      'Batch every DOM read before the first DOM write in a frame. The moment you read `offsetWidth` after touching a style, the browser has to flush the whole pending layout to answer you, and it does that synchronously, inside your pointermove handler, sixty times a second.',
      '```\n// bad: read after write, every frame\nel.style.transform = `translate(${x}px, 0)`\nconst w = el.getBoundingClientRect().width\n\n// good: measure once, then only write\nconst w = el.getBoundingClientRect().width // on pointerdown\nel.style.transform = `translate(${x}px, 0)` // on pointermove\n```',
      'The window manager on this very site follows that rule. Measurements happen once on pointerdown, the drag loop only writes transforms, and the store is updated when the pointer is released.',
      '> If a frame budget is 16ms, a 3ms reflow is a 20% tax you pay on every single frame. A 30ms task, by contrast, is a one-off.',
    ],
  },
  {
    slug: 'dock-math',
    title: 'The math behind the Dock',
    date: '2026-03-02',
    tag: 'Motion',
    readMins: 4,
    summary:
      'Magnification is not a hover state. It is a Gaussian falloff over pointer distance, and that is what makes it feel physical.',
    body: [
      'Most dock clones scale the hovered icon and maybe its two neighbours. Real magnification is continuous: every icon scales as a smooth function of its distance to the cursor, so moving one pixel changes every icon by a tiny amount. That continuity is what your eye reads as “physical”.',
      '```\nconst scale = (d: number) =>\n  1 + MAX * Math.exp(-(d * d) / (2 * SIGMA * SIGMA))\n```',
      'With a sigma of roughly 1.6 icon widths and a max of 0.5, the curve is wide enough that three or four icons participate, and narrow enough that the icon under the cursor is clearly the star. The Dock at the bottom of this page uses exactly that function.',
      '## Width, not just scale',
      'The subtle part is that the icons must also take up more horizontal space as they grow, otherwise they overlap and the dock does not breathe. Animate width alongside transform and the neighbours slide away naturally.',
      'Small thing. Nobody will consciously notice it. Everybody will feel it.',
    ],
  },
  {
    slug: 'phones-are-not-small-desktops',
    title: 'Phones are not small desktops',
    date: '2025-11-20',
    tag: 'Mobile',
    readMins: 4,
    summary:
      'A window manager on a 390px screen is a party trick. The honest move is to become a different operating system.',
    body: [
      'Every “OS-shaped” personal site hits the same wall: the desktop metaphor collapses on a phone. Tiny floating windows with 8px title bars are not charming, they are a support ticket. So this site does the thing the real platforms do. Below 820px it stops being macOS and becomes iOS.',
      '## Same apps, different shell',
      'The content apps are shell-agnostic components. On the desktop they render inside a resizable window with a unified toolbar. On the phone they render full-screen with a large title, a glass back pill, and a home indicator you can drag. The data, the routes, the Lab experiments: identical.',
      '> If your components need to know whether they are in a window, they are not components yet.',
      'The bonus is that the phone build is honest about touch. Every target is at least 44 points. The home screen is a grid you can actually hit with a thumb, not a scaled-down desktop you squint at.',
    ],
  },
  {
    slug: 'why-an-os',
    title: 'Why my site is a fake operating system',
    date: '2025-08-30',
    tag: 'Meta',
    readMins: 3,
    summary:
      'Portfolios are lists. Desktops are places. A short defence of building the thing you actually wanted to build.',
    body: [
      'A portfolio site has one job: prove you can build the thing. A grid of cards proves you can copy a template. A working window manager, with focus rings and keyboard shortcuts and a dock that magnifies, proves you understand the browser as a runtime.',
      'It is also just more fun. People double-click the Trash. They try ⌘W. They drag a window off the edge to see what happens. Those little experiments are the most honest kind of engagement a personal site can get.',
      '> Build the thing you would want to poke at.',
      'So: welcome to the desktop. Esc closes the window you are reading this in. Try ⌘K.',
    ],
  },
]

/* ---------------------------------------------------------------- Papers */

export interface Paper {
  id: string
  title: string
  venue: string
  year: number
  kind: 'analysis' | 'talk' | 'field notes' | 'survey'
  authors: string
  abstract: string
  tags: string[]
  pages: number
}

export const PAPERS: Paper[] = [
  {
    id: 'frame-pacing',
    title: 'Perceived latency of drag interactions under variable frame pacing',
    venue: 'Self-published analysis',
    year: 2026,
    kind: 'analysis',
    authors: 'M. (solo)',
    abstract:
      'I measured how 120 participants rated the “smoothness” of a draggable card across seven frame-pacing profiles. Dropped frames are rated far worse than uniformly slower frames of the same total duration; a stable 40fps beat a jittery 60fps in every condition.',
    tags: ['UX research', 'performance'],
    pages: 11,
  },
  {
    id: 'cost-of-glass',
    title: 'The cost of a pane: frame budgets for translucent window chrome',
    venue: 'Frontend meetup, Helsinki',
    year: 2026,
    kind: 'talk',
    authors: 'M.',
    abstract:
      'Backdrop blur is the most expensive pixel on the web. Numbers from six devices, a budget table, and three cheats that keep glass under 4ms a frame: keep it on chrome, never inside scrollers, and let the wallpaper do the colour work.',
    tags: ['backdrop-filter', 'performance', 'materials'],
    pages: 24,
  },
  {
    id: 'focus-dies',
    title: 'Where keyboard focus goes to die: a survey of 200 modals',
    venue: 'Accessibility write-up',
    year: 2025,
    kind: 'survey',
    authors: 'M.',
    abstract:
      'Only 41% of sampled modals returned focus to the trigger on close. 17% trapped focus incorrectly. The write-up includes a minimal, dependency-free focus-trap that passes all of the tested cases.',
    tags: ['a11y', 'survey'],
    pages: 7,
  },
  {
    id: 'scroll-driven',
    title: 'Notes on scroll-driven animations in production',
    venue: 'Engineering notes',
    year: 2025,
    kind: 'field notes',
    authors: 'M.',
    abstract:
      'Field notes from shipping CSS scroll-timeline in a marketing site with 2M monthly visits. Covers progressive enhancement, the Safari fallback, and the one layout bug that cost a weekend.',
    tags: ['CSS', 'field notes'],
    pages: 5,
  },
  {
    id: 'reach-maps',
    title: 'Fitts on a phone: reach maps for one-handed sheet dismissal',
    venue: 'Self-published analysis',
    year: 2024,
    kind: 'analysis',
    authors: 'M.',
    abstract:
      'Where a close button should go if the user is holding a 6.1-inch phone in the right hand. Spoiler: not the top-left corner, and probably not a button at all.',
    tags: ['mobile', 'ergonomics', 'gestures'],
    pages: 9,
  },
]

/* ----------------------------------------------------------------- Trash */

export const TRASH_ITEMS: TrashItem[] = [
  { id: 't1', name: 'redesign-v3-final-FINAL.fig', kind: 'design', size: '148 MB', deleted: '2026-08-02', note: 'It was not final.' },
  { id: 't2', name: 'jquery-plugin-ideas', kind: 'folder', size: '2.1 MB', deleted: '2026-07-19', note: '2014 called.' },
  { id: 't3', name: 'useEverything.ts', kind: 'code', size: '41 KB', deleted: '2026-06-30', note: 'One hook. 900 lines. No.' },
  { id: 't4', name: 'glassmorphism-card-grid.html', kind: 'code', size: '12 KB', deleted: '2026-06-02', note: 'We do not speak of this.' },
  { id: 't5', name: 'cover-letter-draft-7.md', kind: 'doc', size: '6 KB', deleted: '2026-05-11' },
  { id: 't6', name: 'Bitcoin Miner.app', kind: 'app', size: '319 MB', deleted: '2026-03-03', note: 'Definitely a joke.' },
  { id: 't7', name: 'hero-parallax-v2.mov', kind: 'image', size: '412 MB', deleted: '2026-02-14' },
  { id: 't8', name: 'centered-div.css', kind: 'code', size: '1 KB', deleted: '2026-01-28', note: 'Achieved. Retired.' },
]
