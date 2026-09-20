import { AppearanceControls } from '../components/AppearanceControls'
import { Group, Row } from '../components/controls'
import type { AppScreenProps } from '../os/types'
import { AppPage } from './shared'

export default function Settings({ shell, openApp }: AppScreenProps) {
  return (
    <AppPage shell={shell} title="Settings" eyebrow="Liquid Glass">
      <div className="settings">
        <AppearanceControls showLiveWallpaper={shell === 'desktop'} />
        <Group title="About">
          <Row label="Mikail OS" hint="Version 26 · Liquid Glass prototype">
            <span className="row__value">React 19 · Vite 8</span>
          </Row>
          <Row label="Shell" hint={shell === 'phone' ? 'iOS-style, full-screen apps' : 'macOS-style window manager'}>
            <span className="row__value">{shell === 'phone' ? 'Phone' : 'Desktop'}</span>
          </Row>
          <Row label="Why is this an OS?" onClick={() => openApp('writing', 'why-an-os')}>
            <span className="row__value">Read ›</span>
          </Row>
        </Group>
      </div>
    </AppPage>
  )
}
