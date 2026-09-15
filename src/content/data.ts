import type { TrashItem } from '../os/types'

export interface Post {
  id: string
  title: string
  date: string
  tag: string
  readMins: number
  summary: string
  body: string[] // paragraphs; lines starting with "> " are quotes, "```" blocks are code, "## " headings
}

export const POSTS: Post[] = [
  {
    id: 'layout-thrash',
    title: 'The layout thrash you can hear',
    date: '2026-07-14',
    tag: 'Performance',
    readMins: 6,
    summary: 'Why a 3ms forced reflow feels worse than a 30ms task, and the profiling habit that finally fixed it for me.',
    body: [
      'There is a category of jank that does not show up as a long task. The main thread is barely busy, the flame chart is mostly idle, and yet the drag handle stutters like it is running on a potato. It took me embarrassingly long to learn that this is almost always a forced synchronous layout inside an event handler.',
      '## Read, then write. Never interleave.',
      'The rule is simple to say and painful to follow: batch every DOM read before the first DOM write in a frame. The moment you read `offsetWidth` after touching a style, the browser has to flush the whole pending layout to answer you, and it does that synchronously, inside your pointermove handler, sixty times a second.',
      '```\n// bad: read after write, every frame\nel.style.transform = `translate(${x}px, 0)`\nconst w = el.getBoundingClientRect().width\n\n// good: measure once, then only write\nconst w = el.getBoundingClientRect().width // on pointerdown\nel.style.transform = `translate(${x}px, 0)` // on pointermove\n```',
      'The window manager on this very site follows that rule. Measurements happen once on pointerdown, the drag loop only writes transforms, and the store is updated when the pointer is released. Nothing is measured mid-drag.',
      '> If a frame budget is 16ms, a 3ms reflow is a 20% tax you pay on every single frame. A 30ms task, by contrast, is a one-off.',
      '## The habit',
      'Open the Performance panel, record a drag, and look for purple slivers labelled "Layout" that sit inside your event handler. Each one has a "forced reflow" warning. Fix the read order until they disappear. It is not glamorous work, but it is the difference between a UI that feels like software and one that feels like a web page.',
    ],
  },
  {
    id: 'dock-math',
    title: 'The math behind the macOS dock',
    date: '2026-05-02',
    tag: 'Motion',
    readMins: 4,
    summary: 'Magnification is not a hover state. It is a Gaussian falloff over pointer distance, and that is what makes it feel physical.',
    body: [
      'Most dock clones scale the hovered icon and maybe its two neighbours. Real magnification is continuous: every icon scales as a smooth function of its distance to the cursor, so moving one pixel changes every icon by a tiny amount. That continuity is what your eye reads as "physical".',
      '```\nconst scale = (d: number) =>\n  1 + MAX * Math.exp(-(d * d) / (2 * SIGMA * SIGMA))\n```',
      'With a sigma of roughly 1.6 icon widths and a max of 0.6, the curve is wide enough that three or four icons participate, and narrow enough that the icon under the cursor is clearly the star. The dock at the bottom of this page uses exactly that function.',
      '## Width, not just scale',
      'The subtle part is that the icons must also take up more horizontal space as they grow, otherwise they overlap and the dock does not "breathe". Animate width alongside transform and the neighbours slide away naturally.',
      'Small thing. Nobody will consciously notice it. Everybody will feel it.',
    ],
  },
  {
    id: 'glass-honestly',
    title: 'Glass, honestly',
    date: '2026-02-21',
    tag: 'Design',
    readMins: 5,
    summary: 'Backdrop blur is cheap to add and expensive to justify. A few rules for when translucency helps and when it is just noise.',
    body: [
      'Frosted glass is the fastest way to make a UI look expensive and the fastest way to make it unreadable. The difference is whether the blur is doing a job.',
      '## Glass is a hierarchy cue',
      'Translucency says "this sits above the thing behind it, and the thing behind is still there". That is useful for a menu bar, a dock, a floating panel. It is useless for a document body, because nothing behind a document is worth remembering.',
      'The windows on this desktop use a strong blur and about 86% opacity for the chrome, and content areas rely on that same surface, so text always sits on something calm. The saturate() in the backdrop filter is what keeps the wallpaper colours alive through the glass instead of turning them grey.',
      '> Blur radius is a design decision, not a default. 12px says "sheet of paper". 40px says "thick pane".',
      '## Cost',
      'Every backdrop-filter layer is a separate compositing pass. Four or five is fine on any phone made this decade. Forty is not. Keep glass on chrome, keep content opaque, and never blur inside a scroll container.',
    ],
  },
  {
    id: 'typed-events',
    title: 'Typing pointer events without losing your mind',
    date: '2025-11-09',
    tag: 'TypeScript',
    readMins: 3,
    summary: 'A tiny pattern for drag interactions that keeps React, the DOM, and the type checker all happy at once.',
    body: [
      'The pattern I keep coming back to: capture the pointer on down, attach move and up listeners to the element itself (not the window), and release capture on up. Pointer capture means you never lose the drag when the cursor leaves the element, and the listeners clean themselves up.',
      '```\nconst onDown = (e: React.PointerEvent<HTMLDivElement>) => {\n  const el = e.currentTarget\n  el.setPointerCapture(e.pointerId)\n  const start = { x: e.clientX, y: e.clientY }\n  const move = (ev: PointerEvent) => { /* write transforms */ }\n  const up = () => {\n    el.removeEventListener("pointermove", move)\n    el.removeEventListener("pointerup", up)\n  }\n  el.addEventListener("pointermove", move)\n  el.addEventListener("pointerup", up)\n}\n```',
      'Notice that `move` receives the native `PointerEvent`, not the React synthetic one. That distinction is the source of roughly all the type errors people hit here. Once you name both types explicitly the compiler is a friend again.',
      'Every draggable thing on this site, windows, the mobile sheets, the spring toy in the Lab, uses this exact shape.',
    ],
  },
  {
    id: 'why-an-os',
    title: 'Why my site is a fake operating system',
    date: '2025-08-30',
    tag: 'Meta',
    readMins: 3,
    summary: 'Portfolios are lists. Desktops are places. A short defence of building the thing you actually wanted to build.',
    body: [
      'A portfolio site has one job: prove you can build the thing. A grid of cards proves you can copy a template. A working window manager, with focus rings and keyboard shortcuts and a dock that magnifies, proves you understand the browser as a runtime.',
      'It is also just more fun. People double-click the Trash. They try Cmd-W. They drag a window off the edge to see what happens. Those little experiments are the most honest kind of engagement a personal site can get.',
      '> Build the thing you would want to poke at.',
      'So: welcome to the desktop. Esc closes the window you are reading this in. Try ⌘K.',
    ],
  },
]

export interface Hackathon {
  id: string
  event: string
  date: string
  project: string
  place: 'Winner' | 'Runner-up' | 'Finalist' | 'Best UI' | 'Crowd favourite'
  blurb: string
  stack: string[]
  hours: number
  team: number
}

export const HACKATHONS: Hackathon[] = [
  { id: 'h1', event: 'Junction 2026', date: '2026-06-13', project: 'Marginalia', place: 'Winner', blurb: 'A shared reading layer that turns any PDF into a live, annotated group chat. Built the realtime cursor sync and a custom PDF text-layer renderer.', stack: ['React', 'WebRTC', 'pdf.js', 'CRDT'], hours: 48, team: 4 },
  { id: 'h2', event: 'Hack the North', date: '2026-01-31', project: 'Tapestry', place: 'Best UI', blurb: 'Visual git history as a woven fabric. Each branch is a thread, merges are knots. Drag a knot to time-travel the repo.', stack: ['Canvas', 'TypeScript', 'isomorphic-git'], hours: 36, team: 3 },
  { id: 'h3', event: 'ETHGlobal Lisbon', date: '2025-10-18', project: 'Ledgerlight', place: 'Finalist', blurb: 'A wallet UI that explains every transaction in plain language before you sign. Focus on motion and progressive disclosure.', stack: ['Next.js', 'wagmi', 'Framer Motion'], hours: 40, team: 2 },
  { id: 'h4', event: 'Nordic Game Jam', date: '2025-04-05', project: 'Slowfall', place: 'Crowd favourite', blurb: 'A one-button browser game about a leaf. The whole thing is a 2KB shader and a spring simulation.', stack: ['WebGL', 'GLSL', 'Vanilla JS'], hours: 48, team: 1 },
  { id: 'h5', event: 'HackZurich', date: '2024-09-21', project: 'Quietroom', place: 'Runner-up', blurb: 'Meeting-room booking that runs on a €30 e-ink display. I built the e-ink-friendly rendering pipeline: 1-bit dithered React.', stack: ['React', 'Node', 'Raspberry Pi'], hours: 40, team: 4 },
  { id: 'h6', event: 'Junction 2024', date: '2024-11-09', project: 'Parallax', place: 'Winner', blurb: 'An accessibility overlay that re-renders any page as a keyboard-first, high-contrast outline. Shipped as a Chrome extension during the event.', stack: ['Chrome MV3', 'TypeScript', 'Shadow DOM'], hours: 48, team: 3 },
]

export interface Experiment {
  id: string
  title: string
  kind: 'springs' | 'metaballs' | 'scramble' | 'dither' | 'boids'
  blurb: string
  tags: string[]
}

export const EXPERIMENTS: Experiment[] = [
  { id: 'e1', title: 'Spring toy', kind: 'springs', blurb: 'A damped spring you can throw around. Critically damped at rest, underdamped on release.', tags: ['physics', 'pointer'] },
  { id: 'e2', title: 'Metaballs', kind: 'metaballs', blurb: 'Marching-squares-free blobs: threshold a sum of inverse-square fields on a low-res canvas.', tags: ['canvas', 'fields'] },
  { id: 'e3', title: 'Text scramble', kind: 'scramble', blurb: 'Hover to decode. Each glyph resolves at its own rate, so words settle left to right.', tags: ['typography', 'motion'] },
  { id: 'e4', title: 'Ordered dither', kind: 'dither', blurb: 'A 4×4 Bayer matrix over a moving gradient. The e-ink rendering trick from Quietroom.', tags: ['canvas', 'pixels'] },
  { id: 'e5', title: 'Boids', kind: 'boids', blurb: 'Sixty agents, three rules, no libraries. Tap to scatter them.', tags: ['simulation', 'canvas'] },
]

export interface Paper {
  id: string
  title: string
  venue: string
  year: number
  authors: string
  abstract: string
  tags: string[]
  pages: number
}

export const PAPERS: Paper[] = [
  { id: 'p1', title: 'Perceived latency of drag interactions under variable frame pacing', venue: 'Personal analysis', year: 2026, authors: 'M. (solo)', abstract: 'I measured how 120 participants rated the "smoothness" of a draggable card across seven frame-pacing profiles. Dropped frames are rated far worse than uniformly slower frames of the same total duration; a stable 40fps beat a jittery 60fps in every condition.', tags: ['UX research', 'performance'], pages: 11 },
  { id: 'p2', title: 'Hydration cost of design-system primitives, 2023–2026', venue: 'Blog analysis', year: 2026, authors: 'M., with data from 14 open-source systems', abstract: 'A longitudinal look at the client JavaScript shipped by popular component libraries. Median bundle for a button + dialog + menu triplet fell 38% over three years, driven mostly by the move away from runtime CSS-in-JS.', tags: ['bundles', 'design systems'], pages: 9 },
  { id: 'p3', title: 'Where keyboard focus goes to die: a survey of 200 modals', venue: 'Accessibility write-up', year: 2025, authors: 'M.', abstract: 'Only 41% of sampled modals returned focus to the trigger on close. 17% trapped focus incorrectly. The write-up includes a minimal, dependency-free focus-trap that passes all of the tested cases.', tags: ['a11y', 'survey'], pages: 7 },
  { id: 'p4', title: 'Notes on scroll-driven animations in production', venue: 'Engineering notes', year: 2025, authors: 'M.', abstract: 'Field notes from shipping CSS scroll-timeline in a marketing site with 2M monthly visits. Covers progressive enhancement, the Safari fallback, and the one layout bug that cost a weekend.', tags: ['CSS', 'field notes'], pages: 5 },
]

export const TRASH_ITEMS: TrashItem[] = [
  { id: 't1', name: 'redesign-v3-final-FINAL.fig', kind: 'image', size: '148 MB', deleted: '2026-08-02', note: 'It was not final.' },
  { id: 't2', name: 'jquery-plugin-ideas', kind: 'folder', size: '2.1 MB', deleted: '2026-07-19', note: '2014 called.' },
  { id: 't3', name: 'useEverything.ts', kind: 'code', size: '41 KB', deleted: '2026-06-30', note: 'One hook. 900 lines. No.' },
  { id: 't4', name: 'cover-letter-draft-7.md', kind: 'doc', size: '6 KB', deleted: '2026-05-11' },
  { id: 't5', name: 'Bitcoin Miner.app', kind: 'app', size: '319 MB', deleted: '2026-03-03', note: 'Definitely a joke.' },
  { id: 't6', name: 'centered-div.css', kind: 'code', size: '1 KB', deleted: '2026-01-28', note: 'Achieved. Retired.' },
]

export const ABOUT = {
  name: 'Mikail',
  role: 'Front-end engineer',
  location: 'Helsinki · UTC+3',
  tagline: 'I build interfaces that feel like software.',
  bio: [
    'I have spent the last eight years on the pointy end of the stack: design systems, editors, canvases, and the kind of interaction work where 4 milliseconds is the whole story. I care about motion that explains, keyboards that work, and bundles that respect the phone in your pocket.',
    'Right now I lead front-end on a collaborative whiteboard product. Before that: a fintech design system used by 40 teams, and a stint building e-ink dashboards that taught me more about rendering than any browser did.',
  ],
  now: ['Shipping a canvas renderer that survives 10k nodes', 'Reading about CRDTs, slowly', 'Learning to ski, badly'],
  skills: ['TypeScript', 'React', 'Canvas & WebGL', 'CSS architecture', 'Motion design', 'Accessibility', 'Performance profiling', 'Design systems', 'Vite', 'Node'],
  links: [
    { label: 'GitHub', href: 'https://github.com/' },
    { label: 'Email', href: 'mailto:hi@example.com' },
    { label: 'Bluesky', href: 'https://bsky.app/' },
  ],
}
