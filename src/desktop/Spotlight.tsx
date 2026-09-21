import { useEffect, useMemo, useRef, useState } from 'react'
import { AppIcon } from '../icons/AppIcon'
import { Symbol } from '../icons/Symbol'
import { useEscape } from '../os/hooks'
import { search, type SearchResult } from '../os/search'
import type { AppId } from '../os/types'

interface SpotlightProps {
  onClose: () => void
  onOpen: (appId: AppId, route: string) => void
  /** iOS renders the same component as a sheet. */
  compact?: boolean
}

export function Spotlight({ onClose, onOpen, compact }: SpotlightProps) {
  const [query, setQuery] = useState('')
  const [index, setIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const groups = useMemo(() => search(query), [query])
  const flat = useMemo(() => groups.flatMap((group) => group.results), [groups])

  useEscape(true, onClose)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    setIndex(0)
  }, [query])

  const activate = (result: SearchResult | undefined) => {
    if (!result) return
    onOpen(result.appId, result.route)
    onClose()
  }

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setIndex((i) => Math.min(flat.length - 1, i + 1))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setIndex((i) => Math.max(0, i - 1))
    } else if (event.key === 'Enter') {
      event.preventDefault()
      activate(flat[index])
    }
  }

  return (
    <div className="spotlight-backdrop" onPointerDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="spotlight glass glass-thick" role="dialog" aria-label="Search" data-compact={compact || undefined}>
        <label className="spotlight-field">
          <Symbol name="magnifyingglass" size={20} weight={2.4} />
          <input
            ref={inputRef}
            type="search"
            value={query}
            placeholder="Search"
            aria-label="Search apps, essays, experiments"
            autoComplete="off"
            spellCheck={false}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={onKeyDown}
          />
          {query ? (
            <button type="button" className="spotlight-clear" onClick={() => setQuery('')} aria-label="Clear">
              <Symbol name="xmark" size={11} weight={3} />
            </button>
          ) : null}
        </label>
        {flat.length > 0 ? (
          <div className="spotlight-results scroll" role="listbox">
            {groups.map((group) => (
              <div key={group.group} className="spotlight-group">
                <div className="spotlight-group-title">{group.group}</div>
                {group.results.map((result) => {
                  const flatIndex = flat.indexOf(result)
                  return (
                    <button
                      key={result.id}
                      type="button"
                      role="option"
                      aria-selected={flatIndex === index}
                      className="spotlight-result"
                      onPointerEnter={() => setIndex(flatIndex)}
                      onClick={() => activate(result)}
                    >
                      <AppIcon appId={result.appId} size={30} />
                      <span className="spotlight-result-text">
                        <span className="spotlight-result-title">{result.title}</span>
                        {result.subtitle ? <span className="spotlight-result-sub">{result.subtitle}</span> : null}
                      </span>
                      <Symbol name="chevron.right" size={12} weight={2.6} className="spotlight-result-arrow" />
                    </button>
                  )
                })}
              </div>
            ))}
          </div>
        ) : (
          <div className="spotlight-empty">No results for “{query}”</div>
        )}
      </div>
    </div>
  )
}
