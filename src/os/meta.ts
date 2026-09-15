import type { AppId, AppMeta } from './types';

export const APPS: Record<AppId, AppMeta> = {
  about: { id: 'about', title: 'About Mikail', short: 'About', size: [640, 520], min: [360, 320], blurb: 'Who, what, and currently' },
  hackathons: { id: 'hackathons', title: 'Hackathons', size: [880, 560], min: [420, 340], blurb: 'Wins, finals and weekends without sleep' },
  writing: { id: 'writing', title: 'Writing', size: [900, 600], min: [380, 340], blurb: 'Essays on interfaces and the web' },
  lab: { id: 'lab', title: 'Lab', size: [820, 580], min: [380, 360], blurb: 'Live experiments you can poke' },
  papers: { id: 'papers', title: 'Papers', size: [780, 620], min: [380, 380], blurb: 'Analyses, studies, retrospectives' },
  trash: { id: 'trash', title: 'Trash', size: [620, 440], min: [360, 300], blurb: 'Things that did not make the cut' },
  terminal: { id: 'terminal', title: 'Terminal', size: [640, 400], min: [340, 220], blurb: 'mikail@os — try `help`' },
  settings: { id: 'settings', title: 'Settings', size: [620, 520], min: [360, 360], blurb: 'Wallpaper, accent, motion, keys' },
};

export const DESKTOP_ICONS: AppId[] = ['about', 'hackathons', 'writing', 'lab', 'papers', 'terminal', 'trash'];
export const DOCK_APPS: AppId[] = ['about', 'hackathons', 'writing', 'lab', 'papers', 'terminal', 'settings'];
