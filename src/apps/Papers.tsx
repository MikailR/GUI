import { useMemo, useState } from 'react'
import { PAPERS, type Paper } from '../content/data'
import { Glyph } from '../icons/Glyph'
import type { AppScreenProps } from '../os/types'
import { AppPage } from './shared'

type Kind = 'all' | Paper['kind']

const KINDS: { id: Kind; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'analysis', label: 'Analyses' },
  { id: 'talk', label: 'Talks' },
  { id: 'field notes', label: 'Notes' },
  { id: 'survey', label: 'Surveys' },
]

export default function Papers({ shell, route, onRoute }: AppScreenProps) {
  const [kind, setKind] = useState<Kind>('all')
  const list = useMemo(() => (kind === 'all' ? PAPERS : PAPERS.filter((p) => p.kind === kind)), [kind])
  const expanded = route

  const filter = (
    <div className="glass glass--thin glass--flat glass-seg papers__filter" role="group" aria-label="Kind">
      {KINDS.map((k) => (
        <button key={k.id} type="button" className="glass-seg__item" aria-pressed={kind === k.id} onClick={() => setKind(k.id)}>
          {k.label}
        </button>
      ))}
    </div>
  )

  return (
    <AppPage shell={shell} title="Papers" eyebrow={`${PAPERS.length} documents`} toolbar={filter}>
      <ul className="papers">
        {list.map((paper) => {
          const open = expanded === paper.id
          return (
            <li key={paper.id} className={`paper ${open ? 'is-open' : ''}`}>
              <button
                type="button"
                className="paper__head"
                aria-expanded={open}
                onClick={() => onRoute(open ? null : paper.id)}
              >
                <span className="paper__thumb" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                  <span />
                  <span className="paper__thumb-pages">{paper.pages}p</span>
                </span>
                <span className="paper__text">
                  <span className="paper__title">{paper.title}</span>
                  <span className="paper__meta">
                    <span className="paper__kind">{paper.kind}</span>
                    <span>{paper.venue}</span>
                    <span>·</span>
                    <span>{paper.year}</span>
                  </span>
                </span>
                <Glyph name="chevron-down" size={16} className="paper__chev" />
              </button>
              <div className="paper__body" hidden={!open}>
                <p className="paper__authors">{paper.authors}</p>
                <p className="paper__abstract">{paper.abstract}</p>
                <div className="chips">
                  {paper.tags.map((t) => (
                    <span key={t} className="chip">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </AppPage>
  )
}
