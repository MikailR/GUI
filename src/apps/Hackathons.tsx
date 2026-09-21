import type { CSSProperties } from 'react'
import { Chip, Group, Row } from '../components/controls'
import { HACKATHONS, type Hackathon, type Placement } from '../content/data'
import { Symbol } from '../icons/Symbol'
import { AppFrame } from './frame'
import type { AppProps } from './types'

const PLACE_TONE: Record<Placement, 'accent' | 'warm' | 'neutral'> = {
  Winner: 'warm',
  'Best UI': 'accent',
  'Runner-up': 'accent',
  Finalist: 'neutral',
  'Crowd favourite': 'neutral',
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })
}

export default function Hackathons({ shell, route, onRoute }: AppProps) {
  const selected = HACKATHONS.find((hack) => hack.id === route) ?? (shell === 'mac' ? HACKATHONS[0] : undefined)
  const nested = shell === 'ios' && selected !== undefined

  const list = (
    <div className="hack-list">
      {shell === 'mac' ? <div className="mac-sidebar-title">Events</div> : null}
      {HACKATHONS.map((hack) => (
        <button
          key={hack.id}
          type="button"
          className="hack-item"
          aria-current={selected?.id === hack.id || undefined}
          onClick={() => onRoute(hack.id)}
          style={{ '--hue': hack.hue } as CSSProperties}
        >
          <span className="hack-tile squircle" aria-hidden="true">
            <Symbol name="trophy" size={shell === 'mac' ? 14 : 18} weight={2.4} />
          </span>
          <span className="hack-item-text">
            <span className="hack-item-title">{hack.project}</span>
            <span className="hack-item-sub">
              {hack.event} · {formatDate(hack.date)}
            </span>
          </span>
          <span className="hack-item-place" data-tone={PLACE_TONE[hack.place]}>
            {hack.place}
          </span>
          {shell === 'ios' ? <Symbol name="chevron.right" size={13} weight={2.6} className="ui-row-chevron" /> : null}
        </button>
      ))}
    </div>
  )

  return (
    <AppFrame
      shell={shell}
      title="Hackathons"
      detailTitle={selected?.project}
      nested={nested}
      onBack={() => onRoute('')}
      sidebar={list}
      sidebarWidth={250}
    >
      {selected ? <HackathonDetail hack={selected} /> : null}
    </AppFrame>
  )
}

function HackathonDetail({ hack }: { hack: Hackathon }) {
  return (
    <article className="hack-detail" style={{ '--hue': hack.hue } as CSSProperties}>
      <header className="hack-hero squircle">
        <div className="hack-hero-glyph">
          <Symbol name="trophy" size={40} weight={2} />
        </div>
        <div className="hack-hero-text">
          <span className="hack-hero-event">
            {hack.event} · {hack.city}
          </span>
          <h1>{hack.project}</h1>
          <p>{hack.blurb}</p>
        </div>
      </header>

      <div className="hack-stats">
        <Stat label="Placement" value={hack.place} />
        <Stat label="Hours" value={String(hack.hours)} />
        <Stat label="Team" value={hack.team === 1 ? 'Solo' : `${hack.team} people`} />
        <Stat label="When" value={formatDate(hack.date)} />
      </div>

      <div className="hack-body selectable">
        {hack.detail.map((paragraph) => (
          <p key={paragraph.slice(0, 20)}>{paragraph}</p>
        ))}
      </div>

      <Group title="Stack">
        <Row label="Built with">
          <span className="hack-stack">
            {hack.stack.map((tech) => (
              <Chip key={tech}>{tech}</Chip>
            ))}
          </span>
        </Row>
      </Group>
    </article>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="hack-stat">
      <span className="hack-stat-label">{label}</span>
      <span className="hack-stat-value">{value}</span>
    </div>
  )
}
