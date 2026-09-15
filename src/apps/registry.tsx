import type { AppId } from "../types";
import { About } from "./About";
import { Hackathons } from "./Hackathons";
import { Lab } from "./Lab";
import { Papers } from "./Papers";
import { Settings } from "./Settings";
import { Terminal } from "./Terminal";
import { Trash } from "./Trash";
import { Writing } from "./Writing";
import type { ReactNode } from "react";

const APPS: Record<AppId, () => ReactNode> = {
  about: () => <About />,
  hackathons: () => <Hackathons />,
  writing: () => <Writing />,
  lab: () => <Lab />,
  papers: () => <Papers />,
  trash: () => <Trash />,
  terminal: () => <Terminal />,
  settings: () => <Settings />,
};

export function AppBody({ id }: { id: AppId }) {
  return <>{APPS[id]()}</>;
}
