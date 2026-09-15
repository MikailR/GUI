import type { AppId } from "../types";

export const PERSON = {
  name: "Mikail",
  role: "Front-end engineer",
  location: "Lisbon · remote",
  mark: "M.",
  now: [
    { k: "Building", v: "Helios, a personal operating environment" },
    { k: "Advising", v: "Two product teams on interaction & type" },
    { k: "Writing", v: "A series on windows as a medium" },
  ],
  skills: [
    "CSS as a material",
    "TypeScript",
    "Motion",
    "Design systems",
    "Accessibility",
    "Type",
    "Tooling",
    "Prototyping",
  ],
  quote: "Interfaces should have a temperature.",
  bio: [
    "Mikail treats interfaces like rooms: they need light, weight, and the occasional secret drawer. He designs systems that feel inevitable, then writes the CSS that makes them so.",
    "He has shipped design-engineering at a payments studio, spent a year inside a research lab that should have shipped, and keeps a private museum of discarded UI ideas — some of which live in the Trash.",
  ],
};

export type Hackathon = {
  id: string;
  event: string;
  city: string;
  date: string;
  year: string;
  award: string;
  project: string;
  blurb: string;
  stack: string[];
};

export const HACKATHONS: Hackathon[] = [
  {
    id: "eth-ist",
    event: "ETHGlobal Istanbul",
    city: "Istanbul",
    date: "Nov 2024",
    year: "24",
    award: "1st · Best Design",
    project: "Ledger Light",
    blurb:
      "A tactile explorer for on-chain provenance. Paper-like surfaces, a physical scroll, and receipts you can almost fold.",
    stack: ["React", "R3F", "Solidity"],
  },
  {
    id: "sf-dw",
    event: "SF Design Week Hack",
    city: "San Francisco",
    date: "Jun 2024",
    year: "24",
    award: "Audience award",
    project: "After Hours",
    blurb:
      "A night-mode reading OS. One column, one lamp, and a clock that refuses to hurry you.",
    stack: ["Vite", "CSS", "IndexedDB"],
  },
  {
    id: "hackmit",
    event: "HackMIT",
    city: "Cambridge",
    date: "Oct 2023",
    year: "23",
    award: "Finalist",
    project: "Paper Trails",
    blurb:
      "Spatial annotations for PDFs. Marginalia that remember where your hands were.",
    stack: ["Canvas", "TS", "PDF.js"],
  },
  {
    id: "lhd",
    event: "Local Hack Day",
    city: "Lisbon",
    date: "Dec 2022",
    year: "22",
    award: "2nd overall",
    project: "Busker",
    blurb:
      "Live-captioned street audio map. The city as a score, with type as the notation.",
    stack: ["WebAudio", "MapLibre", "Whisper"],
  },
];

export type Essay = {
  slug: string;
  title: string;
  dek: string;
  date: string;
  minutes: number;
  body: string[];
};

export const ESSAYS: Essay[] = [
  {
    slug: "window-is-the-page",
    title: "The window is the page",
    dek: "Portfolios keep flattening themselves into grids. The desktop already solved navigation.",
    date: "12 Aug 2025",
    minutes: 6,
    body: [
      "A website is not a poster. It is a place you inhabit, however briefly, and places have furniture. The window — draggable, closeable, slightly too large — is the most honest piece of furniture the personal computer ever produced.",
      "When we rebuilt the web in cards and columns we gained shareability and lost rooms. Everything became a hallway. Helios is an argument that a personal site can be a machine you sit down at, not a brochure you skim.",
      "Windows carry state the way a desk carries paper. You leave them out. You stack them. You close the ones that are finished. That is not nostalgia; it is a model of attention that matches how people actually work.",
      "The trick is not to clone macOS. It is to keep the verbs: open, focus, put aside, throw away. The rest is taste — temperature of the glass, the weight of a title bar, whether the dock breathes when you pass it.",
    ],
  },
  {
    slug: "hover-is-a-material",
    title: "Hover is a material",
    dek: "If it only works on tap, it was never finished.",
    date: "3 Mar 2025",
    minutes: 5,
    body: [
      "Hover is not decoration. It is the moment a surface admits it can be touched. Engineers who ship identical tap and hover states are working in one material and pretending it is two.",
      "A dock that magnifies is not cute. It is spatial feedback: you are here, this is larger because you are closer. The same is true of a title bar that brightens, a traffic light that reveals its glyph, a clock that becomes a calendar.",
      "On mobile, hover has to become something else — press, sheet, the slight overscroll. The mistake is to shrink the desktop until the verbs break. Build a second room with the same language.",
      "I keep a private rule: if I cannot describe the hover in a sentence that does not include the word 'nice', it is not a material yet.",
    ],
  },
  {
    slug: "desktop-for-one",
    title: "A desktop for one",
    dek: "Personal software should feel slightly too specific.",
    date: "19 Nov 2024",
    minutes: 7,
    body: [
      "The best personal sites are a little embarrassing. They overfit. They have a temperature the owner would not ship to a client. That is the point.",
      "Helios is tuned to one person: the amber of a Lisbon evening, a serif that pretends to be a display face, a trash can of projects that almost happened. None of this generalizes, and trying would make it a template.",
      "I want visitors to feel they have sat down at someone else's machine while they were in the other room. Not a brand system. A desk.",
      "If you copy this, change the weather. Change the type. Throw something away.",
    ],
  },
  {
    slug: "notes-on-density",
    title: "Notes on density",
    dek: "Empty space is not luxury if nothing was considered.",
    date: "2 Jul 2024",
    minutes: 4,
    body: [
      "Luxury in UI is often a euphemism for not having enough to say. Density, done well, is hospitality: everything you need is within reach, labeled, quiet.",
      "A menu bar is dense. A dock is dense. A window that holds an essay and a clock and three traffic lights is dense. The opposite of clutter is not whitespace; it is hierarchy you can feel with your thumb.",
      "I measure density by how many times a visitor has to ask where they are. Helios tries to answer before the question forms: you are on a machine. That window is the thing you opened. The dock is still there.",
    ],
  },
];

export type Paper = {
  id: string;
  title: string;
  venue: string;
  year: string;
  abstract: string;
  tags: string[];
};

export const PAPERS: Paper[] = [
  {
    id: "fitts",
    title: "Fitts' Law at 2× density",
    venue: "Self-published analysis",
    year: "2025",
    abstract:
      "A small study of pointer targets on high-DPI laptops when chrome is hairline and icons sit at 44px. Throughput drops when hit areas follow the drawing, not the finger. Recommends invisible padding as a first-class layout primitive.",
    tags: ["HCI", "pointing", "layout"],
  },
  {
    id: "windows",
    title: "The persistence of windows",
    venue: "Notes from a residency",
    year: "2024",
    abstract:
      "Why overlapping rectangles remain a better model of personal work than infinite canvas or single-column feeds. Argues for z-order as a mnemonic, not a leftover from the 1980s.",
    tags: ["systems", "history", "attention"],
  },
  {
    id: "scroll",
    title: "Scroll as a material",
    venue: "Internal memo",
    year: "2024",
    abstract:
      "Scroll is not overflow. It is a texture with weight, bounce, and a memory of where you were. Compares native, CSS, and custom scrollers on feeling of arrival.",
    tags: ["motion", "css", "feel"],
  },
  {
    id: "glass",
    title: "On glass, and when to refuse it",
    venue: "Workshop talk",
    year: "2023",
    abstract:
      "Backdrop-filter is a lighting instrument. Used everywhere it becomes weather. A rubric for frosting only the surfaces that sit above a scene, and keeping the scene itself opaque.",
    tags: ["visual", "css", "restraint"],
  },
];

export type TrashItem = {
  id: string;
  name: string;
  kind: string;
  date: string;
  note: string;
};

export const TRASH_ITEMS: TrashItem[] = [
  {
    id: "nft",
    name: "gallery.nft.tsx",
    kind: "Abandoned prototype",
    date: "2021",
    note: "A minting flow with very sincere gradients. Never again.",
  },
  {
    id: "notion-blog",
    name: "blog-from-notion.md",
    kind: "Bad idea",
    date: "2022",
    note: "The CMS was a spreadsheet with opinions.",
  },
  {
    id: "crm",
    name: "personal-crm.app",
    kind: "Overfit",
    date: "2023",
    note: "A relationship tracker that made friendship feel like Jira.",
  },
  {
    id: "dao",
    name: "readme-dao.pdf",
    kind: "The era",
    date: "2022",
    note: "Governance for a newsletter. The newsletter was fine.",
  },
];

export const FORTUNES = [
  "A title bar is a handle for attention.",
  "If the hover needs a tooltip, the icon is lying.",
  "Glass is lighting, not a personality.",
  "Ship the temperature you would keep for yourself.",
  "Minimize is not close. People forget this.",
  "The dock should breathe. The content should not.",
  "Esc is the most honest keyboard shortcut.",
];

export const APP_META: Record<
  AppId,
  { title: string; subtitle: string; w: number; h: number }
> = {
  about: { title: "About", subtitle: "Mikail", w: 740, h: 600 },
  hackathons: { title: "Hackathons", subtitle: "Field notes", w: 700, h: 580 },
  writing: { title: "Writing", subtitle: "Essays", w: 720, h: 620 },
  lab: { title: "Lab", subtitle: "Experiments", w: 760, h: 560 },
  papers: { title: "Papers", subtitle: "Analyses", w: 700, h: 580 },
  trash: { title: "Trash", subtitle: "Discarded", w: 540, h: 420 },
  terminal: { title: "Terminal", subtitle: "helios", w: 640, h: 440 },
  settings: { title: "Settings", subtitle: "Appearance", w: 540, h: 560 },
};

export const DESKTOP_ICONS: { id: AppId | "readme"; label: string; app: AppId }[] =
  [
    { id: "about", label: "About", app: "about" },
    { id: "hackathons", label: "Hackathons", app: "hackathons" },
    { id: "writing", label: "Writing", app: "writing" },
    { id: "lab", label: "Lab", app: "lab" },
    { id: "papers", label: "Papers", app: "papers" },
    { id: "readme", label: "Read Me", app: "writing" },
    { id: "terminal", label: "Terminal", app: "terminal" },
    { id: "trash", label: "Trash", app: "trash" },
  ];
