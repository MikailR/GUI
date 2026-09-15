import { memo, type ComponentType } from 'react';
import type { AppId } from '../os/types';
import { About } from './About';
import { Hackathons } from './Hackathons';
import { Lab } from './Lab';
import { Papers } from './Papers';
import { Settings } from './Settings';
import { Terminal } from './Terminal';
import { Trash } from './Trash';
import { Writing } from './Writing';

export const APP_COMPONENTS: Record<AppId, ComponentType> = {
  about: memo(About),
  hackathons: memo(Hackathons),
  writing: memo(Writing),
  lab: memo(Lab),
  papers: memo(Papers),
  trash: memo(Trash),
  terminal: memo(Terminal),
  settings: memo(Settings),
};
