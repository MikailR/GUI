import { useEffect, useRef, useState, type ReactNode, type UIEvent } from 'react'
import { Symbol } from '../icons/Symbol'
import type { Shell } from '../os/types'
import { usePhoneNav } from '../phone/PhoneNavContext'

/**
 * Shell-aware app chrome.
 *
 * mac  → NavigationSplitView: a glass sidebar under the traffic lights, a
 *        unified toolbar (drag handle) and a calm content pane.
 * ios  → UINavigationController: nav bar with ‹ Back, a large title that
 *        collapses into the bar on scroll, and either the root list (sidebar)
 *        or the pushed detail (children).
 */

interface AppFrameProps {
  shell: Shell
  /** Root title (usually the app name). */
  title: string
  /** Title of the pushed screen / selected item. */
  detailTitle?: string
  /** iOS: a detail screen is pushed. mac: ignored. */
  nested?: boolean
  /** iOS: pop back to root. */
  onBack?: () => void
  /** mac: sidebar contents. iOS: root screen contents. */
  sidebar?: ReactNode
  /** Trailing toolbar / nav-bar items. */
  toolbar?: ReactNode
  /** mac: sidebar width in px. */
  sidebarWidth?: number
  /** iOS: hide the large title (for screens that draw their own header). */
  plainHeader?: boolean
  /** Remove body padding (full-bleed content such as canvases). */
  flush?: boolean
  children: ReactNode
}

export function AppFrame(props: AppFrameProps) {
  switch (props.shell) {
    case 'mac':
      return <MacFrame {...props} />
    case 'ios':
      return <IosFrame {...props} />
    default: {
      const exhaustive: never = props.shell
      return exhaustive
    }
  }
}

/* ------------------------------------------------------------------ mac */

function MacFrame({ title, detailTitle, sidebar, toolbar, sidebarWidth = 220, flush, children }: AppFrameProps) {
  return (
    <div className="mac-split" data-has-sidebar={sidebar ? '' : undefined}>
      {sidebar ? (
        <aside className="mac-sidebar" style={{ width: sidebarWidth }} data-drag-handle>
          <div className="mac-sidebar-scroll scroll">{sidebar}</div>
        </aside>
      ) : null}
      <section className="mac-content">
        <header className="mac-toolbar" data-drag-handle>
          <div className="mac-toolbar-title">
            <span className="mac-toolbar-app">{title}</span>
            {detailTitle ? (
              <>
                <Symbol name="chevron.right" size={11} weight={2.6} className="mac-toolbar-sep" />
                <span className="mac-toolbar-doc">{detailTitle}</span>
              </>
            ) : null}
          </div>
          {toolbar ? <div className="mac-toolbar-actions">{toolbar}</div> : null}
        </header>
        <div className={`mac-body scroll ${flush ? 'is-flush' : ''}`}>{children}</div>
      </section>
    </div>
  )
}

/* ------------------------------------------------------------------ iOS */

function IosFrame({
  title,
  detailTitle,
  nested = false,
  onBack,
  sidebar,
  toolbar,
  plainHeader,
  flush,
  children,
}: AppFrameProps) {
  const { goHome } = usePhoneNav()
  const [collapsed, setCollapsed] = useState(false)
  const bodyRef = useRef<HTMLDivElement | null>(null)
  const screenTitle = nested ? detailTitle ?? title : title
  const showsLargeTitle = !plainHeader

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: 0 })
    setCollapsed(false)
  }, [nested, detailTitle])

  const onScroll = (event: UIEvent<HTMLDivElement>) => {
    const top = event.currentTarget.scrollTop
    const next = showsLargeTitle ? top > 40 : top > 4
    if (next !== collapsed) setCollapsed(next)
  }

  const back = nested ? onBack ?? (() => {}) : goHome
  const backLabel = nested ? title : 'Home'

  return (
    <div className="ios-screen" data-nested={nested || undefined} key={nested ? 'detail' : 'root'}>
      <header className={`ios-navbar ${collapsed ? 'glass glass-thin' : ''}`} data-collapsed={collapsed || undefined}>
        <button type="button" className="ios-back" onClick={back} aria-label={`Back to ${backLabel}`}>
          <Symbol name="chevron.left" size={22} weight={2.6} />
          <span>{backLabel}</span>
        </button>
        <h2 className="ios-navbar-title" aria-hidden={!collapsed && showsLargeTitle}>
          {screenTitle}
        </h2>
        <div className="ios-navbar-actions">{toolbar}</div>
      </header>
      <div ref={bodyRef} className={`ios-body scroll ${flush ? 'is-flush' : ''}`} onScroll={onScroll}>
        {showsLargeTitle ? <h1 className="ios-large-title">{screenTitle}</h1> : null}
        <div className="ios-body-inner">{nested || !sidebar ? children : sidebar}</div>
      </div>
    </div>
  )
}
