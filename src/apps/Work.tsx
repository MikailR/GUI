import { useMemo, useState, type CSSProperties } from 'react'
import { HACKATHONS, type Hackathon, type Placement } from '../content/data'
import { Glyph } from '../icons/Glyph'
import type { AppScreenProps } from '../os/types'
import { AppPage, BackButton, formatDate } from './shared'

const PLACEMENT_TONE: Record<Placement, string> = {
  Winner: 'gold',
  'Runner-up': 'silver',
  Finalist: 'bronze',
  'Best UI': 'tint',
  'Crowd favourite': 'pink',
}

type Filter = 'all' | 'wins'

export default function Work({ shell, route, onRoute }: AppScreenProps) {
  const [filter, setFilter] = useState<Filter>('all')
  const selected = useMemo(() => HACKATHONS.find((h) => h.id === route) ?? null, [route])
  const list = useMemo(
    () => (filter === 'wins' ? HACKATHONS.filter((h) => h.place === 'Winner' || h.place === 'Best UI') : HACKATHONS),
    [filter],
  )
  const totalHours = HACKATHONS.reduce((sum, h) => sum + h.hours, 0)

  const filterControl = (
    <div className="glass glass--thin glass--flat glass-seg" role="group" aria-label="Filter">
      <button type="button" className="glass-seg__item" aria-pressed={filter === 'all'} onClick={() => setFilter('all')}>
        All
      </button>
      <button type="button" className="glass-seg__item" aria-pressed={filter === 'wins'} onClick={() => setFilter('wins')}>
        Wins
      </button>
    </div>
  )

  if (shell === 'phone') {
    if (selected) {
      return (
        <AppPage shell={shell} title={selected.project} eyebrow={`${selected.event} · ${formatDate(selected.date)}`}>
          <HackathonDetail hackathon={selected} />
        </AppPage>
      )
    }
    return (
      <AppPage shell={shell} title="Hackathons" eyebrow={`${HACKATHONS.length} weekends · ${totalHours} hours`} toolbar={filterControl}>
        <HackathonList list={list} selected={null} onSelect={onRoute} />
      </AppPage>
    )
  }

  return (
    <AppPage shell={shell} title="Hackathons" eyebrow={`${HACKATHONS.length} weekends · ${totalHours} hours`} toolbar={filterControl} flush>
      <div className={`work ${selected ? 'has-selection' : ''}`}>
        <HackathonList list={list} selected={selected?.id ?? null} onSelect={onRoute} />

        <div className="work__detail">
          {selected ? (
            <>
              <div className="work__detail-nav">
                <BackButton label="All hackathons" onClick={() => onRoute(null)} />
              </div>
              <HackathonDetail hackathon={selected} />
            </>
          ) : (
            <div className="work__placeholder">
              <Glyph name="trophy" size={28} />
              <p>Pick a weekend.</p>
            </div>
          )}
        </div>
      </div>
    </AppPage>
  )
}

interface HackathonListProps {
  list: Hackathon[]
  selected: string | null
  onSelect: (id: string) => void
}

function HackathonList({ list, selected, onSelect }: HackathonListProps) {
  return (
    <ol className="work__list" aria-label="Hackathons">
      {list.map((h) => (
        <li key={h.id}>
          <button
            type="button"
            className={`work__row ${selected === h.id ? 'is-selected' : ''}`}
            style={{ '--hue': h.hue } as CSSProperties}
            onClick={() => onSelect(h.id)}
            aria-current={selected === h.id ? 'true' : undefined}
          >
            <span className="work__tile" aria-hidden="true">
              <span className="work__tile-mark">{h.project.slice(0, 1)}</span>
            </span>
            <span className="work__text">
              <span className="work__head">
                <span className="work__project">{h.project}</span>
                <span className={`badge badge--${PLACEMENT_TONE[h.place]}`}>{h.place}</span>
              </span>
              <span className="work__meta">
                {h.event} · {formatDate(h.date)}
              </span>
              <span className="work__blurb">{h.blurb}</span>
            </span>
            <Glyph name="chevron-right" size={16} className="work__chev" />
          </button>
        </li>
      ))}
    </ol>
  )
}

function HackathonDetail({ hackathon }: { hackathon: Hackathon }) {
  return (
    <article className="hack" style={{ '--hue': hackathon.hue } as CSSProperties}>
      <div className="hack__hero">
        <div className="hack__mark" aria-hidden="true">
          {hackathon.project.slice(0, 1)}
        </div>
        <div>
          <span className={`badge badge--${PLACEMENT_TONE[hackathon.place]}`}>{hackathon.place}</span>
          <h2 className="hack__title">{hackathon.project}</h2>
          <p className="hack__event">
            {hackathon.event} · {formatDate(hackathon.date)}
          </p>
        </div>
      </div>
      <p className="hack__blurb">{hackathon.blurb}</p>
      <div className="prose">
        {hackathon.detail.map((p) => (
          <p key={p.slice(0, 20)}>{p}</p>
        ))}
      </div>
      <dl className="hack__facts">
        <div>
          <dt>Duration</dt>
          <dd>{hackathon.hours}h</dd>
        </div>
        <div>
          <dt>Team</dt>
          <dd>{hackathon.team === 1 ? 'Solo' : `${hackathon.team} people`}</dd>
        </div>
        <div>
          <dt>Stack</dt>
          <dd className="chips">
            {hackathon.stack.map((s) => (
              <span key={s} className="chip">
                {s}
              </span>
            ))}
          </dd>
        </div>
      </dl>
    </article>
  )
}
