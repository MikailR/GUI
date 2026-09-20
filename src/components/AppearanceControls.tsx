import type { CSSProperties } from 'react'
import { WALLPAPER_LIST } from '../desktop/wallpapers'
import { useOs, useOsActions } from '../os/store'
import type { Appearance, TintId } from '../os/types'
import { Group, Row, Segmented, Switch } from './controls'

const TINTS: { id: TintId; color: string; label: string }[] = [
  { id: 'blue', color: '#0a7aff', label: 'Blue' },
  { id: 'purple', color: '#a550e6', label: 'Purple' },
  { id: 'pink', color: '#f2467d', label: 'Pink' },
  { id: 'orange', color: '#f58a1f', label: 'Orange' },
  { id: 'green', color: '#2fb35a', label: 'Green' },
  { id: 'graphite', color: '#7d848f', label: 'Graphite' },
]

export const TINT_COLORS: Record<TintId, string> = Object.fromEntries(TINTS.map((t) => [t.id, t.color])) as Record<
  TintId,
  string
>

interface AppearanceControlsProps {
  /** Compact variant for the Control Center popover. */
  compact?: boolean
  /** Hide the live wallpaper toggle (phone). */
  showLiveWallpaper?: boolean
}

/** Shared between System Settings and the menu-bar Control Center. */
export function AppearanceControls({ compact = false, showLiveWallpaper = true }: AppearanceControlsProps) {
  const { state } = useOs()
  const { setSettings } = useOsActions()
  const settings = state.settings

  return (
    <div className={`appearance ${compact ? 'appearance--compact' : ''}`}>
      <Group title={compact ? undefined : 'Appearance'}>
        <Row label="Appearance">
          <Segmented<Appearance>
            ariaLabel="Appearance"
            value={settings.appearance}
            onChange={(appearance) => setSettings({ appearance })}
            options={[
              { value: 'auto', label: 'Auto' },
              { value: 'light', label: 'Light' },
              { value: 'dark', label: 'Dark' },
            ]}
          />
        </Row>
        <Row label="Accent colour">
          <div className="tints" role="radiogroup" aria-label="Accent colour">
            {TINTS.map((tint) => (
              <button
                key={tint.id}
                type="button"
                role="radio"
                aria-checked={settings.tint === tint.id}
                aria-label={tint.label}
                className="tint"
                style={{ '--c': tint.color } as CSSProperties}
                onClick={() => setSettings({ tint: tint.id })}
              />
            ))}
          </div>
        </Row>
      </Group>

      <Group title={compact ? undefined : 'Wallpaper'}>
        <div className="wallpapers" role="radiogroup" aria-label="Wallpaper">
          {WALLPAPER_LIST.map((wp) => (
            <button
              key={wp.id}
              type="button"
              role="radio"
              aria-checked={settings.wallpaper === wp.id}
              className="wallpaper-thumb"
              onClick={() => setSettings({ wallpaper: wp.id })}
              title={wp.description}
            >
              <span
                className="wallpaper-thumb__art"
                style={
                  {
                    '--a': wp.base.dark[0],
                    '--b': wp.base.dark[1],
                    '--c1': `hsl(${wp.blobs[0].hsl[0]} ${wp.blobs[0].hsl[1]}% ${wp.blobs[0].hsl[2]}%)`,
                    '--c2': `hsl(${wp.blobs[1].hsl[0]} ${wp.blobs[1].hsl[1]}% ${wp.blobs[1].hsl[2]}%)`,
                    '--c3': `hsl(${wp.blobs[wp.blobs.length - 1].hsl[0]} ${wp.blobs[wp.blobs.length - 1].hsl[1]}% ${wp.blobs[wp.blobs.length - 1].hsl[2]}%)`,
                  } as CSSProperties
                }
              />
              <span className="wallpaper-thumb__name">{wp.name}</span>
            </button>
          ))}
        </div>
      </Group>

      <Group title={compact ? undefined : 'Glass'}>
        <Row label="Reduce transparency" hint={compact ? undefined : 'Solid surfaces instead of glass.'}>
          <Switch
            label="Reduce transparency"
            checked={settings.reduceTransparency}
            onChange={(reduceTransparency) => setSettings({ reduceTransparency })}
          />
        </Row>
        <Row label="Reduce motion" hint={compact ? undefined : 'Also follows your system setting.'}>
          <Switch label="Reduce motion" checked={settings.reduceMotion} onChange={(reduceMotion) => setSettings({ reduceMotion })} />
        </Row>
        {showLiveWallpaper ? (
          <Row label="Live wallpaper" hint={compact ? undefined : 'Slow drift. Pauses when the tab is hidden.'}>
            <Switch label="Live wallpaper" checked={settings.liveWallpaper} onChange={(liveWallpaper) => setSettings({ liveWallpaper })} />
          </Row>
        ) : null}
      </Group>
    </div>
  )
}
