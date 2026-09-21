import { useCallback, useRef, useState, type CSSProperties } from 'react'
import { Slider } from '../components/controls'
import { useCaustic } from '../components/useCaustic'
import { Symbol, type SymbolName } from '../icons/Symbol'
import { useClickOutside, useEscape, useResolvedAppearance } from '../os/hooks'
import { useStore } from '../os/store'
import { WALLPAPERS } from '../os/wallpapers'

interface ControlCenterProps {
  onClose: () => void
  onOpenSettings: () => void
}

/** macOS Control Center: a glass card of modular tiles. */
export function ControlCenter({ onClose, onOpenSettings }: ControlCenterProps) {
  const ref = useRef<HTMLDivElement | null>(null)
  const { state, dispatch } = useStore()
  const resolved = useResolvedAppearance()
  const { onPointerMove } = useCaustic()
  const [wifi, setWifi] = useState(true)
  const [bluetooth, setBluetooth] = useState(true)
  const [airdrop, setAirdrop] = useState(false)
  const [focus, setFocus] = useState(false)
  const [brightness, setBrightness] = useState(78)
  const [volume, setVolume] = useState(52)

  useClickOutside(ref, true, onClose)
  useEscape(true, onClose)

  const toggleAppearance = useCallback(() => {
    dispatch({ type: 'settings', patch: { appearance: resolved === 'dark' ? 'light' : 'dark' } })
  }, [dispatch, resolved])

  return (
    <div
      ref={ref}
      className="mac-cc glass glass-thick glass-caustic"
      role="dialog"
      aria-label="Control Center"
      onPointerMove={onPointerMove}
      style={{ '--rim-angle': '120deg' } as CSSProperties}
    >
      <div className="mac-cc-grid">
        <div className="mac-cc-tile mac-cc-connect">
          <Toggle on={wifi} onToggle={() => setWifi((v) => !v)} icon="wifi" label="Wi‑Fi" detail={wifi ? 'Mikail’s network' : 'Off'} />
          <Toggle on={bluetooth} onToggle={() => setBluetooth((v) => !v)} icon="bluetooth" label="Bluetooth" detail={bluetooth ? 'On' : 'Off'} />
          <Toggle on={airdrop} onToggle={() => setAirdrop((v) => !v)} icon="airdrop" label="AirDrop" detail={airdrop ? 'Everyone' : 'Contacts only'} />
        </div>
        <div className="mac-cc-col">
          <button type="button" className="mac-cc-tile mac-cc-focus" data-on={focus || undefined} onClick={() => setFocus((v) => !v)} aria-pressed={focus}>
            <span className="mac-cc-round">
              <Symbol name="moon" size={16} />
            </span>
            <span className="mac-cc-text">
              <strong>Focus</strong>
              <small>{focus ? 'Do Not Disturb' : 'Off'}</small>
            </span>
          </button>
          <div className="mac-cc-row">
            <button type="button" className="mac-cc-tile mac-cc-small" onClick={toggleAppearance} data-on={resolved === 'dark' || undefined} aria-pressed={resolved === 'dark'}>
              <Symbol name={resolved === 'dark' ? 'moon' : 'sun'} size={18} />
              <small>{resolved === 'dark' ? 'Dark' : 'Light'}</small>
            </button>
            <button
              type="button"
              className="mac-cc-tile mac-cc-small"
              data-on={state.settings.reduceTransparency || undefined}
              aria-pressed={state.settings.reduceTransparency}
              onClick={() => dispatch({ type: 'settings', patch: { reduceTransparency: !state.settings.reduceTransparency } })}
            >
              <Symbol name="square.stack" size={18} />
              <small>Glass</small>
            </button>
          </div>
        </div>
        <div className="mac-cc-tile mac-cc-slider">
          <strong>Display</strong>
          <Slider value={brightness} min={10} max={100} onChange={setBrightness} label="Display brightness" icon="sun" />
        </div>
        <div className="mac-cc-tile mac-cc-slider">
          <strong>Sound</strong>
          <Slider value={volume} min={0} max={100} onChange={setVolume} label="Volume" icon="speaker" />
        </div>
        <div className="mac-cc-tile mac-cc-wallpaper">
          <strong>Wallpaper</strong>
          <div className="mac-cc-wallpapers" role="radiogroup" aria-label="Wallpaper">
            {WALLPAPERS.map((wallpaper) => (
              <button
                key={wallpaper.id}
                type="button"
                role="radio"
                aria-checked={state.settings.wallpaper === wallpaper.id}
                aria-label={wallpaper.name}
                title={wallpaper.name}
                className="mac-cc-swatch"
                style={{ '--swatch': wallpaper.swatch } as CSSProperties}
                onClick={() => dispatch({ type: 'settings', patch: { wallpaper: wallpaper.id } })}
              />
            ))}
          </div>
        </div>
      </div>
      <button type="button" className="mac-cc-footer" onClick={onOpenSettings}>
        <Symbol name="gear" size={13} /> Display Settings…
      </button>
    </div>
  )
}

interface ToggleProps {
  on: boolean
  onToggle: () => void
  icon: SymbolName
  label: string
  detail: string
}

function Toggle({ on, onToggle, icon, label, detail }: ToggleProps) {
  return (
    <button type="button" className="mac-cc-toggle" data-on={on || undefined} onClick={onToggle} aria-pressed={on}>
      <span className="mac-cc-round">
        <Symbol name={icon} size={15} />
      </span>
      <span className="mac-cc-text">
        <strong>{label}</strong>
        <small>{detail}</small>
      </span>
    </button>
  )
}
