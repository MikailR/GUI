import type { CSSProperties } from 'react'
import { useStore } from '../os/store'
import type { AccentId, Appearance, WallpaperId } from '../os/types'
import { WALLPAPERS } from '../os/wallpapers'
import { Segmented } from './controls'

export const ACCENTS: { id: AccentId; name: string; color: string }[] = [
  { id: 'blue', name: 'Blue', color: '#007aff' },
  { id: 'purple', name: 'Purple', color: '#af52de' },
  { id: 'pink', name: 'Pink', color: '#ff2d55' },
  { id: 'red', name: 'Red', color: '#ff3b30' },
  { id: 'orange', name: 'Orange', color: '#ff9500' },
  { id: 'yellow', name: 'Yellow', color: '#ffcc00' },
  { id: 'green', name: 'Green', color: '#34c759' },
  { id: 'graphite', name: 'Graphite', color: '#8e8e93' },
]

export function AppearancePicker() {
  const { state, dispatch } = useStore()
  return (
    <Segmented<Appearance>
      value={state.settings.appearance}
      onChange={(appearance) => dispatch({ type: 'settings', patch: { appearance } })}
      label="Appearance"
      options={[
        { value: 'auto', label: 'Auto' },
        { value: 'light', label: 'Light' },
        { value: 'dark', label: 'Dark' },
      ]}
    />
  )
}

export function AccentPicker() {
  const { state, dispatch } = useStore()
  return (
    <div className="accent-picker" role="radiogroup" aria-label="Accent colour">
      {ACCENTS.map((accent) => (
        <button
          key={accent.id}
          type="button"
          role="radio"
          aria-checked={state.settings.accent === accent.id}
          aria-label={accent.name}
          title={accent.name}
          className="accent-swatch"
          style={{ '--swatch': accent.color } as CSSProperties}
          onClick={() => dispatch({ type: 'settings', patch: { accent: accent.id } })}
        />
      ))}
    </div>
  )
}

export function WallpaperPicker({ size = 'regular' }: { size?: 'regular' | 'large' }) {
  const { state, dispatch } = useStore()
  return (
    <div className="wallpaper-picker" role="radiogroup" aria-label="Wallpaper" data-size={size}>
      {WALLPAPERS.map((wallpaper) => (
        <button
          key={wallpaper.id}
          type="button"
          role="radio"
          aria-checked={state.settings.wallpaper === wallpaper.id}
          className="wallpaper-swatch"
          style={{ '--swatch': wallpaper.swatch } as CSSProperties}
          onClick={() => dispatch({ type: 'settings', patch: { wallpaper: wallpaper.id as WallpaperId } })}
        >
          <span className="wallpaper-swatch-art" />
          <span className="wallpaper-swatch-name">{wallpaper.name}</span>
        </button>
      ))}
    </div>
  )
}
