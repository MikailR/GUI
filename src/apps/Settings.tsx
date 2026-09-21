import { AccentPicker, AppearancePicker, WallpaperPicker } from '../components/AppearanceControls'
import { Group, Row, Switch } from '../components/controls'
import { Symbol, type SymbolName } from '../icons/Symbol'
import { useStore } from '../os/store'
import { AppFrame } from './frame'
import type { AppProps } from './types'

type SectionId = 'appearance' | 'wallpaper' | 'dock' | 'accessibility' | 'about'

interface Section {
  id: SectionId
  name: string
  icon: SymbolName
  color: string
}

const SECTIONS: Section[] = [
  { id: 'appearance', name: 'Appearance', icon: 'circle.lefthalf', color: '#1c1c1e' },
  { id: 'wallpaper', name: 'Wallpaper', icon: 'photo', color: '#30b0c7' },
  { id: 'dock', name: 'Desktop & Dock', icon: 'grid', color: '#8e8e93' },
  { id: 'accessibility', name: 'Accessibility', icon: 'accessibility', color: '#007aff' },
  { id: 'about', name: 'About', icon: 'info', color: '#5856d6' },
]

function isSection(value: string): value is SectionId {
  return SECTIONS.some((section) => section.id === value)
}

/**
 * Settings: System Settings on the Mac (sidebar + pane), the iOS Settings app
 * on the phone (root list with coloured icons → pushed sections).
 */
export default function Settings({ shell, route, onRoute }: AppProps) {
  const { state, dispatch } = useStore()
  const current: SectionId | null = isSection(route) ? route : shell === 'mac' ? 'appearance' : null
  const section = SECTIONS.find((s) => s.id === current)

  const list = (
    <div className="settings-list">
      {shell === 'ios' ? (
        <Group>
          <div className="settings-me">
            <span className="settings-me-avatar squircle">M</span>
            <span className="settings-me-text">
              <strong>Mikail</strong>
              <small>Mikail OS · Liquid Glass v2</small>
            </span>
            <Symbol name="chevron.right" size={13} weight={2.6} className="ui-row-chevron" />
          </div>
        </Group>
      ) : null}
      <Group>
        {SECTIONS.map((s) => (
          <Row
            key={s.id}
            icon={s.icon}
            iconColor={s.color}
            label={s.name}
            chevron={shell === 'ios'}
            selected={current === s.id}
            onClick={() => onRoute(s.id)}
          />
        ))}
      </Group>
    </div>
  )

  const pane = section ? (
    <div className="settings-pane">
      {section.id === 'appearance' ? (
        <>
          <Group title="Appearance">
            <Row label="Appearance" detail={shell === 'mac' ? undefined : 'Auto follows the system.'}>
              <AppearancePicker />
            </Row>
            <Row label="Accent colour">
              <AccentPicker />
            </Row>
          </Group>
          <Group title="Glass" footer="Vibrancy keeps wallpaper colour alive through the material. Turning it off makes surfaces solid.">
            <Row label="Reduce transparency">
              <Switch
                checked={state.settings.reduceTransparency}
                onChange={(reduceTransparency) => dispatch({ type: 'settings', patch: { reduceTransparency } })}
                label="Reduce transparency"
              />
            </Row>
          </Group>
        </>
      ) : null}

      {section.id === 'wallpaper' ? (
        <>
          <Group title="Wallpaper">
            <div className="settings-wallpapers">
              <WallpaperPicker size="large" />
            </div>
          </Group>
          <Group footer="Live wallpaper drifts slowly. It pauses when the tab is hidden or motion is reduced.">
            <Row label="Live wallpaper">
              <Switch
                checked={state.settings.liveWallpaper}
                onChange={(liveWallpaper) => dispatch({ type: 'settings', patch: { liveWallpaper } })}
                label="Live wallpaper"
              />
            </Row>
          </Group>
        </>
      ) : null}

      {section.id === 'dock' ? (
        <Group title="Dock" footer="Magnification follows a Gaussian over pointer distance; see Dock Physics in the Lab.">
          <Row label="Magnification">
            <Switch
              checked={state.settings.dockMagnification}
              onChange={(dockMagnification) => dispatch({ type: 'settings', patch: { dockMagnification } })}
              label="Dock magnification"
            />
          </Row>
          <Row label="Position on screen" detail="Bottom" />
          <Row label="Minimise windows into" detail="Application icon" />
        </Group>
      ) : null}

      {section.id === 'accessibility' ? (
        <>
          <Group title="Motion" footer="Springs become plain ease-outs and durations collapse to a frame.">
            <Row label="Reduce motion">
              <Switch
                checked={state.settings.reduceMotion}
                onChange={(reduceMotion) => dispatch({ type: 'settings', patch: { reduceMotion } })}
                label="Reduce motion"
              />
            </Row>
          </Group>
          <Group title="Display">
            <Row label="Reduce transparency">
              <Switch
                checked={state.settings.reduceTransparency}
                onChange={(reduceTransparency) => dispatch({ type: 'settings', patch: { reduceTransparency } })}
                label="Reduce transparency"
              />
            </Row>
            <Row label="Hit targets" detail="≥ 44 pt on the phone" />
          </Group>
        </>
      ) : null}

      {section.id === 'about' ? (
        <>
          <Group title="About">
            <Row label="Name" detail="Mikail OS" />
            <Row label="Version" detail="Liquid Glass v2" />
            <Row label="Shell" detail={shell === 'mac' ? 'macOS' : 'iOS'} />
            <Row label="Renderer" detail="React 19 · Vite 8 · TypeScript" />
            <Row label="UI dependencies" detail="None" />
          </Group>
          <Group footer="Settings are saved locally in this browser.">
            <Row
              label="Reset settings"
              onClick={() =>
                dispatch({
                  type: 'settings',
                  patch: {
                    appearance: 'auto',
                    wallpaper: 'tahoe',
                    accent: 'blue',
                    reduceMotion: false,
                    reduceTransparency: false,
                    liveWallpaper: true,
                    dockMagnification: true,
                  },
                })
              }
            />
          </Group>
        </>
      ) : null}
    </div>
  ) : null

  return (
    <AppFrame
      shell={shell}
      title="Settings"
      detailTitle={section?.name}
      nested={shell === 'ios' && section !== undefined}
      onBack={() => onRoute('')}
      sidebar={list}
      sidebarWidth={210}
    >
      {pane}
    </AppFrame>
  )
}
