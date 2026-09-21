import { useEffect, useState } from 'react'
import { Switch } from '../../components/controls'
import { Symbol } from '../../icons/Symbol'
import { ControlStrip } from '../LabControls'
import type { ExperimentProps } from '../registry'

type IslandState = 'compact' | 'timer' | 'music' | 'call'
const ORDER: IslandState[] = ['compact', 'timer', 'music', 'call']

export default function DynamicIsland({ compact }: ExperimentProps) {
  const [state, setState] = useState<IslandState>('compact')
  const [auto, setAuto] = useState(true)
  const [seconds, setSeconds] = useState(12 * 60 + 34)

  useEffect(() => {
    const timer = window.setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 15 * 60)), 1000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    if (!auto) return
    const timer = window.setInterval(() => setState((s) => ORDER[(ORDER.indexOf(s) + 1) % ORDER.length]), 3200)
    return () => window.clearInterval(timer)
  }, [auto])

  const next = () => setState((s) => ORDER[(ORDER.indexOf(s) + 1) % ORDER.length])
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0')
  const ss = String(seconds % 60).padStart(2, '0')

  return (
    <div className="lab-experiment island-lab" data-compact={compact || undefined}>
      <div className="island-stage">
        <div className="island-phone">
          <button type="button" className="island" data-state={state} onClick={next} aria-label={`Dynamic Island: ${state}. Tap to change.`}>
            <span className="island-sensor" aria-hidden="true" />
            <span className="island-content">{content(state, mm, ss)}</span>
          </button>
          <div className="island-home">
            <div className="island-widget glass glass-thin">
              <strong>{mm}:{ss}</strong>
              <small>Focus timer</small>
            </div>
            <div className="island-icons">
              {[0, 1, 2, 3].map((i) => (
                <span key={i} className="island-icon squircle" style={{ background: `hsl(${200 + i * 40} 80% 60%)` }} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <ControlStrip>
        <label className="lab-toggle">
          <span>Auto cycle</span>
          <Switch checked={auto} onChange={setAuto} label="Auto cycle states" />
        </label>
        <div className="lab-param">
          <span className="lab-param-label">State</span>
          <div className="lab-preset-row" role="radiogroup" aria-label="Island state">
            {ORDER.map((option) => (
              <button
                key={option}
                type="button"
                role="radio"
                aria-checked={state === option}
                className="ui-button"
                data-variant={state === option ? 'filled' : 'tinted'}
                data-size="small"
                onClick={() => {
                  setAuto(false)
                  setState(option)
                }}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </ControlStrip>
      <p className="lab-note">
        Width, height and radius transition with the OS spring (<code>--spring</code>), so the pill overshoots slightly as it
        grows — the same curve the phone shell uses when it opens an app.
      </p>
    </div>
  )
}

function content(state: IslandState, mm: string, ss: string) {
  switch (state) {
    case 'compact':
      return null
    case 'timer':
      return (
        <>
          <span className="island-ring" aria-hidden="true">
            <Symbol name="clock" size={14} weight={2.4} />
          </span>
          <span className="island-timer tnum">
            {mm}:{ss}
          </span>
        </>
      )
    case 'music':
      return (
        <>
          <span className="island-art squircle" aria-hidden="true" />
          <span className="island-music">
            <strong>Floating Points</strong>
            <small>Crush</small>
          </span>
          <span className="island-bars" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
          </span>
        </>
      )
    case 'call':
      return (
        <>
          <span className="island-avatar" aria-hidden="true">
            M
          </span>
          <span className="island-music">
            <strong>Mikail</strong>
            <small>mobile · 00:{ss}</small>
          </span>
          <span className="island-call island-decline" aria-hidden="true">
            <Symbol name="xmark" size={14} weight={3} />
          </span>
          <span className="island-call island-accept" aria-hidden="true">
            <Symbol name="checkmark" size={14} weight={3} />
          </span>
        </>
      )
    default: {
      const exhaustive: never = state
      return exhaustive
    }
  }
}
