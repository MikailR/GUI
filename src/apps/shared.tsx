import { useEffect, useRef, type ReactNode } from 'react'
import { Glyph } from '../icons/Glyph'
import { usePhoneNav } from '../os/PhoneNavContext'
import type { AppScreenProps } from '../os/types'

interface AppPageProps {
  shell: AppScreenProps['shell']
  /** Large title on the phone; ignored on the desktop (the window title bar has it). */
  title: string
  /** Small line above the large title (phone) or leading the toolbar row (desktop). */
  eyebrow?: ReactNode
  /** Actions rendered in the header row. */
  toolbar?: ReactNode
  /** Remove default padding (for two-pane layouts that manage their own). */
  flush?: boolean
  className?: string
  children: ReactNode
}

/**
 * Scrollable page scaffold shared by every app. On the phone it renders an iOS large title
 * that scrolls away and reports its collapse to the nav bar; on the desktop it renders only an
 * optional toolbar row, since the window chrome already carries the title.
 */
export function AppPage({ shell, title, eyebrow, toolbar, flush = false, className, children }: AppPageProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const phoneNav = usePhoneNav()
  const isPhone = shell === 'phone'

  useEffect(() => {
    if (!isPhone || !phoneNav) return
    const el = scrollRef.current
    if (!el) return
    let compact = false
    const onScroll = () => {
      const next = el.scrollTop > 36
      if (next !== compact) {
        compact = next
        phoneNav.setCompactTitle(next)
      }
    }
    onScroll()
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      el.removeEventListener('scroll', onScroll)
      phoneNav.setCompactTitle(false)
    }
  }, [isPhone, phoneNav, title])

  return (
    <div ref={scrollRef} className={`app-page ${flush ? 'app-page--flush' : ''} ${isPhone ? 'app-page--phone' : ''} ${className ?? ''}`}>
      {isPhone ? (
        <header className="large-title">
          {eyebrow ? <div className="large-title__eyebrow">{eyebrow}</div> : null}
          <h1 className="large-title__text">{title}</h1>
          {toolbar ? <div className="large-title__toolbar">{toolbar}</div> : null}
        </header>
      ) : toolbar || eyebrow ? (
        <div className="app-toolbar">
          <div className="app-toolbar__eyebrow">{eyebrow}</div>
          <div className="app-toolbar__actions">{toolbar}</div>
        </div>
      ) : null}
      <div className="app-page__content">{children}</div>
    </div>
  )
}

/** Inline back affordance for nested desktop views (phone uses the nav pill instead). */
export function BackButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button type="button" className="back-btn" onClick={onClick}>
      <Glyph name="chevron-left" size={16} strokeWidth={2.5} />
      <span>{label}</span>
    </button>
  )
}

/** Renders a post/paper body: paragraphs with "## ", "> " and ``` conventions. */
export function Prose({ body }: { body: string[] }) {
  return (
    <div className="prose">
      {body.map((block, i) => {
        if (block.startsWith('## ')) return <h2 key={i}>{block.slice(3)}</h2>
        if (block.startsWith('> ')) return <blockquote key={i}>{block.slice(2)}</blockquote>
        if (block.startsWith('```')) {
          const code = block.replace(/^```\n?/, '').replace(/\n?```$/, '')
          return (
            <pre key={i}>
              <code>{code}</code>
            </pre>
          )
        }
        return <p key={i}>{renderInlineCode(block)}</p>
      })}
    </div>
  )
}

function renderInlineCode(text: string): ReactNode {
  const parts = text.split(/(`[^`]+`)/g)
  if (parts.length === 1) return text
  return parts.map((part, i) => (part.startsWith('`') && part.endsWith('`') ? <code key={i}>{part.slice(1, -1)}</code> : part))
}

export function formatDate(iso: string): string {
  const date = new Date(`${iso}T00:00:00`)
  return date.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
}

export function EmptyState({ title, body, action }: { title: string; body?: string; action?: ReactNode }) {
  return (
    <div className="empty">
      <div className="empty__glyph" aria-hidden="true">
        <Glyph name="sparkle" size={28} />
      </div>
      <h3>{title}</h3>
      {body ? <p>{body}</p> : null}
      {action}
    </div>
  )
}
