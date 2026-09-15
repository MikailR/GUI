// All placeholder content lives here. Swap freely — the OS doesn't care.

export const profile = {
  name: 'Mikail',
  handle: '@mikail',
  role: 'Front-end engineer',
  location: 'Istanbul ⇄ Berlin',
  tagline: 'I build interfaces that feel like they were always there.',
  bio: [
    'I’m a front-end engineer who likes the uncomfortable middle of the stack — where design systems meet render loops, and a 16ms budget is a creative constraint rather than a limit.',
    'Lately that means rendering pipelines for data-heavy tools, motion systems that respect reduced-motion users, and accessibility work that nobody notices because it simply works.',
    'Outside of work I enter hackathons for the deadline adrenaline, write about browser internals, and keep a lab of small experiments that are occasionally useful.',
  ],
  specs: [
    ['Runtime', 'TypeScript, React, a stubborn love of plain CSS'],
    ['Graphics', 'Canvas 2D, WebGL, SVG filters, a little WebGPU'],
    ['Memory', 'Remembers every easing curve, forgets lunch'],
    ['Display', 'Pixel-peeper, 2× minimum'],
    ['Uptime', '9 years shipping to production'],
  ] as [string, string][],
  now: [
    { k: 'Building', v: 'A virtualised timeline for a video-editing startup' },
    { k: 'Reading', v: '“The Nature of Code” — again, slower this time' },
    { k: 'Learning', v: 'WebGPU compute shaders; Turkish calligraphy' },
    { k: 'Listening', v: 'Nils Frahm, Altın Gün, the fan of this laptop' },
  ],
  timeline: [
    { year: '2024 —', title: 'Staff Front-end Engineer', org: 'Framecut', note: 'Timeline editor, render scheduler, design system v3.' },
    { year: '2021 — 24', title: 'Senior Engineer', org: 'Parcel & Pine', note: 'Logistics dashboards streaming 40k rows/s to the DOM without tears.' },
    { year: '2019 — 21', title: 'UI Engineer', org: 'Oda Studio', note: 'Interactive editorial for newsrooms; three awards, one broken CMS.' },
    { year: '2017 — 19', title: 'Web Developer', org: 'Freelance', note: 'Agencies, museums, a very insistent bakery.' },
  ],
  links: [
    { label: 'GitHub', value: 'github.com/mikail', href: '#' },
    { label: 'Email', value: 'hello@mikail.dev', href: '#' },
    { label: 'Mastodon', value: '@mikail@hachyderm.io', href: '#' },
    { label: 'CV', value: 'mikail-cv-2026.pdf', href: '#' },
  ],
};

export type Placement = '1st' | '2nd' | '3rd' | 'Finalist' | 'Special';

export interface Hackathon {
  id: string;
  event: string;
  city: string;
  date: string; // ISO
  placement: Placement;
  prize?: string;
  project: string;
  pitch: string;
  detail: string;
  stack: string[];
  team: number;
  hours: number;
  hue: number;
}

export const hackathons: Hackathon[] = [
  {
    id: 'h-2026-berlin',
    event: 'Berlin Hack & Tell: Signals',
    city: 'Berlin',
    date: '2026-06-14',
    placement: '1st',
    prize: '€5,000 + residency',
    project: 'Murmur',
    pitch: 'Live captions that show *how* something was said — pitch, pace and pause — rendered as typography.',
    detail:
      'We piped Web Audio analyser data into a variable-font axis map so loud words get heavier and hesitant words drift. Deaf and hard-of-hearing judges said it was the first captioning they could “hear”. Built the render loop on OffscreenCanvas so it held 60fps on a mid-range Android.',
    stack: ['Web Audio', 'Variable fonts', 'OffscreenCanvas', 'Whisper.cpp'],
    team: 3,
    hours: 36,
    hue: 22,
  },
  {
    id: 'h-2026-ist',
    event: 'Istanbul Civic Hackathon',
    city: 'Istanbul',
    date: '2026-02-21',
    placement: '2nd',
    prize: 'Municipality pilot',
    project: 'Ferry Pulse',
    pitch: 'A crowding forecast for Bosphorus ferries, shown as a tide chart commuters actually read.',
    detail:
      'Scraped turnstile data, trained a tiny gradient-boosted model, and spent the remaining 20 hours on the chart. The municipality is piloting it on two piers. The tide metaphor tested better than every bar chart we tried.',
    stack: ['React', 'D3 scales', 'Service Worker', 'LightGBM'],
    team: 4,
    hours: 48,
    hue: 200,
  },
  {
    id: 'h-2025-ams',
    event: 'Amsterdam A11y Jam',
    city: 'Amsterdam',
    date: '2025-10-04',
    placement: '1st',
    prize: 'Best overall',
    project: 'Tabula',
    pitch: 'Screen-reader-first data tables: sonified trends and a keyboard grammar for pivoting.',
    detail:
      'A table you can listen to. Arrow keys walk cells, Shift+arrows play a pitch sweep across a row, and “/” opens a spoken query bar. Everything progressive-enhances from a plain <table>.',
    stack: ['ARIA grid', 'Web Audio', 'Lit', 'Playwright'],
    team: 2,
    hours: 24,
    hue: 140,
  },
  {
    id: 'h-2025-sf',
    event: 'Frontier Browser Hack',
    city: 'San Francisco',
    date: '2025-05-17',
    placement: 'Finalist',
    project: 'Paperweight',
    pitch: 'A devtools panel that shows the physical “weight” of every DOM subtree — layout cost as mass.',
    detail:
      'Hooked PerformanceObserver and layout-shift entries into a Matter.js scene; heavy components literally sink. Didn’t win, but two browser engineers asked for the repo.',
    stack: ['DevTools API', 'Matter.js', 'PerformanceObserver'],
    team: 3,
    hours: 30,
    hue: 280,
  },
  {
    id: 'h-2024-lis',
    event: 'Lisbon Creative Code Weekend',
    city: 'Lisbon',
    date: '2024-11-09',
    placement: 'Special',
    prize: 'Jury’s “Most Joyful”',
    project: 'Azulejo',
    pitch: 'Generative tile patterns you compose by humming. Printed 200 of them on real ceramic.',
    detail:
      'Pitch detection picks a symmetry group, rhythm picks the stroke. We shipped a kiosk, a print pipeline, and a very tired kiln technician.',
    stack: ['Canvas', 'SVG', 'Pitchy', 'Plotter'],
    team: 2,
    hours: 40,
    hue: 210,
  },
  {
    id: 'h-2024-ber',
    event: 'JSConf Hack Day',
    city: 'Berlin',
    date: '2024-06-02',
    placement: '3rd',
    project: 'Undo Everything',
    pitch: 'A time-travel layer for any form on the web, shipped as a 3kb bookmarklet.',
    detail:
      'MutationObserver + input events recorded as a persistent tree, scrubbable with a timeline. The demo was a job application form restored after a tab crash, which got a round of applause from people who had lived it.',
    stack: ['MutationObserver', 'IndexedDB', 'Vanilla JS'],
    team: 1,
    hours: 12,
    hue: 50,
  },
  {
    id: 'h-2023-ldn',
    event: 'London Climate Hack',
    city: 'London',
    date: '2023-09-23',
    placement: '1st',
    prize: '£3,000',
    project: 'Kilowatt Weather',
    pitch: 'A grid-carbon forecast styled as a weather app, nudging when to run the dishwasher.',
    detail:
      'The whole product was one screen and one notification. Restraint won it — the judges’ note said “finally, a climate app that doesn’t make me feel guilty.”',
    stack: ['Preact', 'Carbon Intensity API', 'Web Push'],
    team: 3,
    hours: 24,
    hue: 160,
  },
  {
    id: 'h-2023-ist',
    event: 'Boğaziçi Game Jam',
    city: 'Istanbul',
    date: '2023-03-11',
    placement: '2nd',
    project: 'Simit Rush',
    pitch: 'A one-thumb browser game about delivering simit across seven hills before they go stale.',
    detail:
      'Custom 2D physics, a procedural hill generator, and a soundtrack recorded on a phone at Karaköy pier. Still gets a few hundred plays a week.',
    stack: ['Canvas', 'TypeScript', 'Howler'],
    team: 4,
    hours: 48,
    hue: 35,
  },
];

export interface Post {
  id: string;
  title: string;
  date: string;
  minutes: number;
  tags: string[];
  dek: string;
  body: Block[];
}

export type Block =
  | { t: 'p'; text: string }
  | { t: 'h'; text: string }
  | { t: 'quote'; text: string }
  | { t: 'code'; lang: string; text: string }
  | { t: 'list'; items: string[] };

export const posts: Post[] = [
  {
    id: 'p-windows',
    title: 'Your website is a window manager now',
    date: '2026-08-30',
    minutes: 6,
    tags: ['interfaces', 'react'],
    dek: 'Notes from building this site: z-order is state, focus is a stack, and drag should never touch React.',
    body: [
      { t: 'p', text: 'Every desktop metaphor on the web eventually has to answer one boring question: who owns the pixels while you are dragging? The honest answer is “not your framework.”' },
      { t: 'p', text: 'This site keeps window geometry in a reducer — open, focus, minimize, snap — but while a pointer is down, the title bar writes transforms straight to the element inside a single rAF. React only hears about it on pointerup. The result is one commit per drag instead of sixty per second.' },
      { t: 'code', lang: 'ts', text: "onPointerMove(e) {\n  next = clamp(start + (e.clientX - origin));\n  frame ||= requestAnimationFrame(() => {\n    el.style.transform = `translate3d(${next.x}px, ${next.y}px, 0)`;\n    frame = 0;\n  });\n}" },
      { t: 'h', text: 'Focus is a stack, not a number' },
      { t: 'p', text: 'Storing a z-index per window invites collisions. Storing an ordered array of ids makes focus a move-to-end, closing a filter, and ⌥` cycling an index into the same array. The z-index becomes derived data, which is the only kind of data that never goes stale.' },
      { t: 'quote', text: 'If a value can be computed from the stack, it should not be stored next to it.' },
      { t: 'p', text: 'Animations use the Web Animations API with a spring baked into a CSS linear() easing. No animation library, no per-frame JavaScript, and prefers-reduced-motion collapses everything to a crossfade.' },
    ],
  },
  {
    id: 'p-16ms',
    title: 'Sixteen milliseconds is a design material',
    date: '2026-05-12',
    minutes: 8,
    tags: ['performance', 'craft'],
    dek: 'Treating the frame budget like paper size: a constraint you design into, not a number you apologise for.',
    body: [
      { t: 'p', text: 'Designers get a canvas size. Engineers get a frame budget. Both are rectangles; one is measured in time.' },
      { t: 'p', text: 'When I plan an interaction now, I literally sketch the frame: 4ms input, 6ms script, 3ms style and layout, the rest for paint and a margin for the garbage collector’s bad days. If an idea doesn’t fit, the idea changes — not the budget.' },
      { t: 'h', text: 'Three habits' },
      { t: 'list', items: ['Read layout once, write many — batch getBoundingClientRect calls at the start of the frame.', 'Animate only transform and opacity unless you can prove otherwise in the Performance panel.', 'Put a slow CPU throttle on during design review, not just during QA.'] },
      { t: 'p', text: 'The surprising part is that constraints like this make work more expressive. A motion system that must run on a four-year-old phone ends up simpler, and simple motion reads as confident.' },
    ],
  },
  {
    id: 'p-a11y-motion',
    title: 'Reduced motion is not no motion',
    date: '2026-01-19',
    minutes: 5,
    tags: ['accessibility', 'motion'],
    dek: 'Swapping spatial movement for opacity keeps meaning without triggering vestibular discomfort.',
    body: [
      { t: 'p', text: 'The laziest implementation of prefers-reduced-motion is `* { animation: none !important }`. It is also the one that removes the only cue telling a user that a panel opened.' },
      { t: 'p', text: 'Motion communicates causality: this came from there. Vestibular triggers are mostly about large spatial movement, parallax and zoom. Opacity and small colour changes can usually stay.' },
      { t: 'quote', text: 'Design the reduced version first. The full version is the one with extra frosting.' },
      { t: 'p', text: 'On this site, windows zoom out of their icons with a spring. With reduced motion on, they fade in place in 120ms. Same story, shorter sentence.' },
    ],
  },
  {
    id: 'p-contours',
    title: 'Drawing a living topographic map in 90 lines',
    date: '2025-11-02',
    minutes: 7,
    tags: ['canvas', 'generative'],
    dek: 'Marching squares over simplex noise, a pointer that raises mountains, and why the wallpaper runs at 30fps on purpose.',
    body: [
      { t: 'p', text: 'The wallpaper behind this text is a height field: layered simplex noise, sampled on a coarse grid, with contour lines extracted by marching squares for a dozen elevation levels.' },
      { t: 'p', text: 'Your cursor adds a gaussian hill to the field. Every fifth contour is an index line, drawn heavier, like a real survey map. That one detail does more for the “map” feeling than any colour choice.' },
      { t: 'code', lang: 'ts', text: 'const h = fbm(x * scale, y * scale, t) + lift * Math.exp(-d2 / r2);' },
      { t: 'p', text: 'It renders at a throttled 30fps, pauses when the tab is hidden, and draws a single static frame if you prefer reduced motion. Wallpapers should be the calmest thing on screen.' },
    ],
  },
  {
    id: 'p-css',
    title: 'In defence of the cascade',
    date: '2025-07-08',
    minutes: 4,
    tags: ['css', 'opinion'],
    dek: 'Container queries, :has() and @layer quietly fixed the problems we built whole toolchains to avoid.',
    body: [
      { t: 'p', text: 'For a decade we treated the cascade as a bug. Scoped styles, atomic classes, CSS-in-JS — all reasonable answers to a language that had no answer of its own.' },
      { t: 'p', text: 'Then the language answered. Every app on this site uses container queries, so the same component looks right in a 360px phone sheet and a 900px desktop window without knowing which it is in.' },
      { t: 'list', items: ['@layer makes specificity an explicit decision.', ':has() removes half the state you were syncing into class names.', 'Container queries make components honest about their own size.'] },
    ],
  },
];

export interface Experiment {
  id: string;
  title: string;
  year: string;
  blurb: string;
  tags: string[];
  demo?: 'spring' | 'wallpaper' | 'goo' | 'flip';
}

export const experiments: Experiment[] = [
  { id: 'x-wallpaper', title: 'Contour Field', year: '2026', blurb: 'The wallpaper you’re looking at. Tweak it live — changes apply to the desktop behind this window.', tags: ['canvas', 'noise'], demo: 'wallpaper' },
  { id: 'x-spring', title: 'Spring Tuner', year: '2026', blurb: 'Drag the puck. Stiffness and damping produce the same curves used for every window animation here.', tags: ['physics', 'motion'], demo: 'spring' },
  { id: 'x-goo', title: 'Gooey Cursor', year: '2025', blurb: 'An SVG feColorMatrix threshold turns blurred circles into liquid. No canvas, no WebGL.', tags: ['svg', 'filters'], demo: 'goo' },
  { id: 'x-flip', title: 'FLIP Shuffle', year: '2025', blurb: 'First, Last, Invert, Play: list reorders that animate from layout without a library.', tags: ['layout', 'waapi'], demo: 'flip' },
  { id: 'x-dither', title: 'Bayer Camera', year: '2024', blurb: 'Webcam feed through an ordered-dither shader. Looks like a 1991 newspaper.', tags: ['webgl'] },
  { id: 'x-fonts', title: 'Breathing Type', year: '2024', blurb: 'Variable font weight driven by microphone RMS — the precursor to Murmur.', tags: ['type', 'audio'] },
];

export interface Paper {
  id: string;
  title: string;
  kind: string;
  date: string;
  pages: number;
  abstract: string;
  sections: { h: string; p: string }[];
  figure: { caption: string; unit: string; data: { label: string; value: number }[]; kind: 'bar' | 'line' };
}

export const papers: Paper[] = [
  {
    id: 'a-inp',
    title: 'Where Interaction Latency Actually Goes',
    kind: 'Analysis',
    date: '2026-04',
    pages: 3,
    abstract:
      'We traced 2.1M Interaction to Next Paint events across four production React apps. Median INP was dominated not by event handlers but by the style-and-layout phase triggered after state commits, suggesting that render memoisation is often optimising the wrong phase.',
    sections: [
      { h: '1. Method', p: 'Long Animation Frame entries were joined to INP events by timestamp and attributed per script. Sessions from low-end Android devices were oversampled 4× to reflect the long tail.' },
      { h: '2. Findings', p: 'Handler time was 18% of p75 INP. Style recalculation and layout accounted for 46%, largely from class toggles on high-level containers invalidating deep subtrees.' },
      { h: '3. Recommendations', p: 'Prefer targeted attribute selectors and content-visibility on offscreen regions; measure with LoAF script attribution before reaching for memo().' },
    ],
    figure: {
      caption: 'Fig. 1 — Share of p75 INP by phase (%)',
      unit: '%',
      kind: 'bar',
      data: [
        { label: 'Input delay', value: 21 },
        { label: 'Handlers', value: 18 },
        { label: 'Style + layout', value: 46 },
        { label: 'Paint', value: 15 },
      ],
    },
  },
  {
    id: 'a-bundle',
    title: 'Five Years of a Design System Bundle',
    kind: 'Retrospective',
    date: '2025-12',
    pages: 3,
    abstract:
      'A longitudinal look at the compressed size of a component library across 214 releases. Size grew steadily until a migration to CSS layers and native popover removed 38% of runtime code in a single quarter.',
    sections: [
      { h: '1. Data', p: 'Every tagged release was rebuilt in a pinned toolchain and measured as brotli-compressed ESM for a representative five-component page.' },
      { h: '2. Inflection', p: 'The drop in Q3 2025 coincides with removing a positioning engine in favour of the Popover API and anchor positioning, plus the retirement of a runtime theming layer.' },
      { h: '3. Takeaway', p: 'The platform shipped the features we had been bundling. Auditing dependencies against Baseline each year is now part of our release checklist.' },
    ],
    figure: {
      caption: 'Fig. 1 — Compressed bundle size by year (kB)',
      unit: 'kB',
      kind: 'line',
      data: [
        { label: '2021', value: 41 },
        { label: '2022', value: 52 },
        { label: '2023', value: 63 },
        { label: '2024', value: 71 },
        { label: '2025', value: 44 },
        { label: '2026', value: 39 },
      ],
    },
  },
  {
    id: 'a-motion',
    title: 'Do Users Notice Springs?',
    kind: 'Study',
    date: '2025-06',
    pages: 3,
    abstract:
      'A small preference study (n = 64) comparing spring-based and cubic-bezier transitions for panel open. Participants did not reliably identify the difference, yet rated spring variants as “more responsive” in 71% of paired trials.',
    sections: [
      { h: '1. Design', p: 'Within-subjects, randomised order, identical durations. Participants completed a navigation task and rated perceived responsiveness on a 7-point scale.' },
      { h: '2. Results', p: 'Springs were preferred in 71% of pairs; conscious identification was near chance (54%). Effect was strongest on touch devices.' },
      { h: '3. Limits', p: 'Small, self-selected sample of design-literate participants. Replication with a general audience is planned.' },
    ],
    figure: {
      caption: 'Fig. 1 — Pairs preferring spring, by device (%)',
      unit: '%',
      kind: 'bar',
      data: [
        { label: 'Touch', value: 79 },
        { label: 'Trackpad', value: 70 },
        { label: 'Mouse', value: 64 },
      ],
    },
  },
];

export interface TrashItem {
  id: string;
  name: string;
  kind: 'zip' | 'js' | 'txt' | 'img' | 'fig' | 'folder';
  size: string;
  deleted: string;
  note: string;
}

export const trashItems: TrashItem[] = [
  { id: 't1', name: 'portfolio-v1-bootstrap.zip', kind: 'zip', size: '14.2 MB', deleted: '2019-02-11', note: 'A hero image of a laptop on a desk, a carousel, and the words “passionate about pixels”. We move on.' },
  { id: 't2', name: 'carousel-final-FINAL-v3.js', kind: 'js', size: '48 KB', deleted: '2020-08-30', note: '1,400 lines of jQuery. It auto-played. It had no pause button. I’m sorry.' },
  { id: 't3', name: 'idea — blockchain for houseplants.txt', kind: 'txt', size: '2 KB', deleted: '2022-01-04', note: 'Each watering is a transaction. The fern did not need a ledger. The fern needed water.' },
  { id: 't4', name: 'Untitled design (47).fig', kind: 'fig', size: '3.1 MB', deleted: '2023-05-19', note: 'Forty-seven iterations of a button. Version 12 was the right one.' },
  { id: 't5', name: 'screenshot 2024-03-02 at 03.14.22.png', kind: 'img', size: '812 KB', deleted: '2024-03-02', note: 'A console full of hydration errors, taken at 3am as “evidence”.' },
  { id: 't6', name: 'node_modules', kind: 'folder', size: '1.8 GB', deleted: '2025-10-10', note: 'Heaviest object in the known universe. Took eleven minutes to delete.' },
];
