import type { ComponentType } from 'react'
import type { AppId } from './registry'
import { About } from './About'
import { Hackathons } from './Hackathons'
import { Writing } from './Writing'
import { Lab } from './Lab'
import { Papers } from './Papers'
import { Terminal } from './Terminal'
import { Settings } from './Settings'
import { Trash } from './Trash'

const COMPONENTS: Record<AppId, ComponentType> = {
  about: About,
  hackathons: Hackathons,
  writing: Writing,
  lab: Lab,
  papers: Papers,
  terminal: Terminal,
  settings: Settings,
  trash: Trash,
}

export function AppView({ id }: { id: AppId }) {
  const C = COMPONENTS[id]
  return <C />
}
