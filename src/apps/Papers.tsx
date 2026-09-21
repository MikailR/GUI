import { useState } from 'react'
import { Chip, Segmented } from '../components/controls'
import { PAPERS, type Paper, type PaperKind } from '../content/data'
import { Symbol, type SymbolName } from '../icons/Symbol'
import { AppFrame } from './frame'
import type { AppProps } from './types'

type Filter = 'all' | PaperKind

const KIND_ICON: Record<PaperKind, SymbolName> = {
  analysis: 'doc',
  talk: 'speaker',
  'field notes': 'book',
  survey: 'grid',
}

const KIND_COLOR: Record<PaperKind, string> = {
  analysis: '#3d7dff',
  talk: '#ff6a3d',
  'field notes': '#2fa96f',
  survey: '#8b5cff',
}

export default function Papers({ shell, route, onRoute }: AppProps) {
  const [filter, setFilter] = useState<Filter>('all')
  const [expanded, setExpanded] = useState<string | null>(route || null)
  const visible = PAPERS.filter((paper) => filter === 'all' || paper.kind === filter)

  const toggle = (id: string) => {
    const next = expanded === id ? null : id
    setExpanded(next)
    onRoute(next ?? '')
  }

  const filterControl = (
    <Segmented<Filter>
      value={filter}
      onChange={setFilter}
      label="Filter papers"
      size={shell === 'mac' ? 'small' : 'regular'}
      options={[
        { value: 'all', label: 'All' },
        { value: 'analysis', label: 'Analyses' },
        { value: 'talk', label: 'Talks' },
        { value: 'field notes', label: 'Notes' },
        { value: 'survey', label: 'Surveys' },
      ]}
    />
  )

  return (
    <AppFrame shell={shell} title="Papers" toolbar={shell === 'mac' ? filterControl : undefined}>
      <div className="papers">
        {shell === 'ios' ? <div className="papers-filter">{filterControl}</div> : null}
        <div className="papers-list">
          {visible.map((paper) => (
            <PaperCard key={paper.id} paper={paper} expanded={expanded === paper.id} onToggle={() => toggle(paper.id)} />
          ))}
        </div>
      </div>
    </AppFrame>
  )
}

function PaperCard({ paper, expanded, onToggle }: { paper: Paper; expanded: boolean; onToggle: () => void }) {
  return (
    <article className="paper" data-expanded={expanded || undefined}>
      <button type="button" className="paper-head" onClick={onToggle} aria-expanded={expanded}>
        <span className="paper-kind" style={{ '--icon-color': KIND_COLOR[paper.kind] } as React.CSSProperties}>
          <Symbol name={KIND_ICON[paper.kind]} size={16} weight={2.4} />
        </span>
        <span className="paper-text">
          <span className="paper-title">{paper.title}</span>
          <span className="paper-meta">
            {paper.venue} · {paper.year} · {paper.pages} pp
          </span>
        </span>
        <Symbol name="chevron.down" size={14} weight={2.6} className="paper-chevron" />
      </button>
      <div className="paper-body">
        <div className="paper-body-inner">
          <p className="paper-abstract selectable">{paper.abstract}</p>
          <div className="paper-tags">
            <Chip tone="accent">{paper.kind}</Chip>
            {paper.tags.map((tag) => (
              <Chip key={tag}>{tag}</Chip>
            ))}
          </div>
        </div>
      </div>
    </article>
  )
}
