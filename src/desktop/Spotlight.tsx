import { useEffect, useMemo, useRef, useState } from 'react'
import { AppIcon } from '../icons/AppIcon'
import { Glyph } from '../icons/Glyph'
import { searchIndex, type SearchAction, type SearchItem } from '../os/search'

interface SpotlightProps {
  open: boolean
  onClose: () => void
  onAction: (action: SearchAction) => void
}

/** ⌘K search over apps, essays, hackathons, experiments, papers and settings actions. */
export function Spotlight({ open, onClose, onAction }: SpotlightProps) {
  const [query, setQuery] = useState('')
  const [cursor, setCursor] = useState(0)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const results = useMemo(() => searchIndex(query), [query])

  useEffect(() => {
    if (open) {
      setQuery('')
      setCursor(0)
      requestAnimationFrame(() => inputRef.current?.focus())
    }
  }, [open])

  useEffect(() => {
    setCursor(0)
  }, [results.length])

  if (!open) return null

  const run = (item: SearchItem) => {
    onAction(item.action)
    onClose()
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setCursor((c) => Math.min(results.length - 1, c + 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setCursor((c) => Math.max(0, c - 1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const item = results[cursor]
      if (item) run(item)
    } else if (e.key === 'Escape') {
      e.preventDefault()
      onClose()
    }
  }

  let lastGroup: string | null = null

  return (
    <div className="spotlight-backdrop" onPointerDown={onClose}>
      <div
        className="glass glass--thick spotlight"
        role="dialog"
        aria-label="Spotlight search"
        onPointerDown={(e) => e.stopPropagation()}
        onKeyDown={onKeyDown}
      >
        <div className="spotlight__field">
          <Glyph name="search" size={20} />
          <input
            ref={inputRef}
            className="spotlight__input"
            placeholder="Search apps, essays, experiments…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search"
            autoComplete="off"
            spellCheck={false}
          />
          <kbd>esc</kbd>
        </div>
        <div className="spotlight__results" role="listbox">
          {results.length === 0 ? <div className="spotlight__empty">No results for “{query}”.</div> : null}
          {results.map((item, i) => {
            const showGroup = item.group !== lastGroup
            lastGroup = item.group
            return (
              <div key={item.id}>
                {showGroup ? <div className="spotlight__group">{item.group}</div> : null}
                <button
                  type="button"
                  role="option"
                  aria-selected={i === cursor}
                  className={`spotlight__item ${i === cursor ? 'is-active' : ''}`}
                  onPointerMove={() => setCursor(i)}
                  onClick={() => run(item)}
                >
                  <AppIcon appId={item.icon} size={30} />
                  <span className="spotlight__text">
                    <span className="spotlight__title">{item.title}</span>
                    <span className="spotlight__sub">{item.subtitle}</span>
                  </span>
                  {i === cursor ? <kbd>↩</kbd> : null}
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
