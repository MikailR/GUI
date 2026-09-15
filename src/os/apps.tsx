import { lazy, type ComponentType, type LazyExoticComponent } from 'react'
import type { AppId } from './types'

export interface AppProps {
  windowId: string
  payload?: unknown
}

export interface AppDef {
  id: AppId
  title: string
  w: number
  h: number
  minW: number
  minH: number
  component: LazyExoticComponent<ComponentType<AppProps>>
  dock?: boolean // in the dock by default
  desktop?: boolean // shown on the desktop
  desktopLabel?: string
  menu?: string // name shown in menubar when focused
}

export const APPS: Record<AppId, AppDef> = {
  about: { id: 'about', title: 'About Mikail', w: 720, h: 520, minW: 420, minH: 360, component: lazy(() => import('../apps/About')), dock: true, desktop: true, desktopLabel: 'About' },
  hackathons: { id: 'hackathons', title: 'Hackathons', w: 780, h: 540, minW: 480, minH: 360, component: lazy(() => import('../apps/Hackathons')), dock: true, desktop: true },
  writing: { id: 'writing', title: 'Writing', w: 860, h: 580, minW: 520, minH: 380, component: lazy(() => import('../apps/Writing')), dock: true, desktop: true },
  lab: { id: 'lab', title: 'Lab', w: 820, h: 560, minW: 460, minH: 380, component: lazy(() => import('../apps/Lab')), dock: true, desktop: true },
  papers: { id: 'papers', title: 'Papers & Analyses', w: 720, h: 520, minW: 460, minH: 360, component: lazy(() => import('../apps/Papers')), dock: true, desktop: true, desktopLabel: 'Papers' },
  terminal: { id: 'terminal', title: 'Terminal', w: 640, h: 400, minW: 380, minH: 240, component: lazy(() => import('../apps/Terminal')), dock: true, desktop: false, menu: 'Terminal' },
  readme: { id: 'readme', title: 'README.txt', w: 520, h: 460, minW: 360, minH: 300, component: lazy(() => import('../apps/Readme')), desktop: true, desktopLabel: 'README.txt', menu: 'TextEdit' },
  settings: { id: 'settings', title: 'System Settings', w: 560, h: 440, minW: 420, minH: 360, component: lazy(() => import('../apps/Settings')), dock: true },
  trash: { id: 'trash', title: 'Trash', w: 640, h: 440, minW: 420, minH: 300, component: lazy(() => import('../apps/Trash')), dock: true, desktop: true },
  sysinfo: { id: 'sysinfo', title: 'About This Computer', w: 460, h: 340, minW: 380, minH: 300, component: lazy(() => import('../apps/SysInfo')) },
}

export const DOCK_ORDER: AppId[] = ['about', 'writing', 'hackathons', 'lab', 'papers', 'terminal', 'settings']
export const DESKTOP_ORDER: AppId[] = ['about', 'writing', 'hackathons', 'lab', 'papers', 'readme', 'trash']
export const MOBILE_HOME: AppId[] = ['about', 'writing', 'hackathons', 'lab', 'papers', 'terminal', 'readme', 'trash']
export const MOBILE_DOCK: AppId[] = ['about', 'writing', 'lab', 'settings']
