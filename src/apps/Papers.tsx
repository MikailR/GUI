import { useEffect, useState } from 'react'
import { PAPERS } from '../content/data'
import { useOS } from '../os/store'

export default function Papers({ payload }: { payload?: unknown }) {
  const os = useOS()
  const want = (payload as { paperId?: string } | undefined)?.paperId
  const [open, setOpen] = useState<string | null>(want ?? null)
  useEffect(() => { if (want) setOpen(want) }, [want])
  return (
    <div className="app" style={{ flexDirection: 'column' }}>
      <div className="toolbar">
        <span>{PAPERS.length} documents</span>
        <span className="grow" />
        <span>Sorted by year</span>
      </div>
      <div className="app-main scroll">
        <div className="pad" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[...PAPERS].sort((a, b) => b.year - a.year).map((p) => {
            const isOpen = open === p.id
            return (
              <div key={p.id} className="card hover" style={{ cursor: 'pointer' }} onClick={() => setOpen(isOpen ? null : p.id)}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{ width: 34, height: 44, flex: 'none', borderRadius: 4, background: 'var(--card-hover)', border: '1px solid var(--hairline)', display: 'grid', placeItems: 'center', fontSize: 10, color: 'var(--text-3)', fontFamily: 'var(--mono)' }}>
                    PDF
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 650, lineHeight: 1.3, letterSpacing: '-0.01em' }}>{p.title}</h3>
                    <div className="meta" style={{ marginTop: 4 }}>
                      <span>{p.authors}</span>·<span>{p.venue}</span>·<span>{p.year}</span>·<span>{p.pages} pp.</span>
                    </div>
                    {isOpen && (
                      <div style={{ marginTop: 10, animation: 'fade-in 0.2s' }}>
                        <p style={{ fontSize: 13.5, lineHeight: 1.6, color: 'var(--text-2)' }}><b style={{ color: 'var(--text)' }}>Abstract.</b> {p.abstract}</p>
                        <div style={{ display: 'flex', gap: 6, marginTop: 10, alignItems: 'center' }}>
                          {p.tags.map((t) => <span key={t} className="chip">{t}</span>)}
                          <button className="btn small" style={{ marginLeft: 'auto' }} onClick={(e) => { e.stopPropagation(); os.toast('Download', 'The full PDF is a placeholder in this prototype.', 'papers') }}>Download PDF</button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
