import type { SymbolName } from '../icons/Symbol'
import type { AppId } from '../os/types'

export type ShortcutAction = { kind: 'link'; href: string } | { kind: 'app'; appId: AppId; route: string }

export interface HomeShortcut {
  id: string
  name: string
  symbol: SymbolName
  from: string
  to: string
  action: ShortcutAction
}

/** Web-clip-style icons that fill out the home grid alongside the real apps. */
export const HOME_SHORTCUTS: readonly HomeShortcut[] = [
  {
    id: 'github',
    name: 'GitHub',
    symbol: 'command',
    from: '#3a3a40',
    to: '#0f0f12',
    action: { kind: 'link', href: 'https://github.com/MikailR' },
  },
  {
    id: 'mail',
    name: 'Mail',
    symbol: 'envelope',
    from: '#5ec8ff',
    to: '#0a6dff',
    action: { kind: 'link', href: 'mailto:hi@example.com' },
  },
  {
    id: 'forge',
    name: 'Icon Forge',
    symbol: 'paintbrush',
    from: '#ffb35c',
    to: '#ff3d7f',
    action: { kind: 'app', appId: 'lab', route: 'icon' },
  },
  {
    id: 'squircle',
    name: 'Squircles',
    symbol: 'grid',
    from: '#c58bff',
    to: '#6d3cff',
    action: { kind: 'app', appId: 'lab', route: 'squircle' },
  },
]
