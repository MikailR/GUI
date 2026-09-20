import { useEffect, useMemo, useRef, useState } from 'react'
import { AppearanceControls } from '../components/AppearanceControls'
import { Glyph } from '../icons/Glyph'
import { useClock } from '../os/hooks'
import { useOs } from '../os/store'
import { buildMenus, type Menu, type MenuCommands } from './menus'

interface MenuBarProps {
  commands: MenuCommands
}

type OpenPanel = { kind: 'menu'; id: string } | { kind: 'control-center' } | null

/**
 * macOS Tahoe-style menu bar: fully transparent over the wallpaper, text with a soft shadow,
 * glass dropdown menus, and a Control Center popover on the right.
 */
export function MenuBar({ commands }: MenuBarProps) {
  const { state } = useOs()
  const [open, setOpen] = useState<OpenPanel>(null)
  const barRef = useRef<HTMLDivElement | null>(null)
  const now = useClock()
  const menus = useMemo(() => buildMenus(state, commands), [state, commands])

  // Close on outside click / Esc.
  useEffect(() => {
    if (!open) return
    const onPointerDown = (e: PointerEvent) => {
      if (barRef.current && !barRef.current.contains(e.target as Node)) setOpen(null)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        setOpen(null)
      }
    }
    document.addEventListener('pointerdown', onPointerDown, true)
    document.addEventListener('keydown', onKey, true)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown, true)
      document.removeEventListener('keydown', onKey, true)
    }
  }, [open])

  const toggleMenu = (id: string) => setOpen((cur) => (cur?.kind === 'menu' && cur.id === id ? null : { kind: 'menu', id }))
  const hoverMenu = (id: string) => {
    if (open?.kind === 'menu' && open.id !== id) setOpen({ kind: 'menu', id })
  }

  const dateLabel = now.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' })
  const timeLabel = now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })

  return (
    <div className="menubar no-select" ref={barRef} role="menubar" aria-label="Menu bar">
      <div className="menubar__left">
        {menus.map((menu) => (
          <MenuButton
            key={menu.id}
            menu={menu}
            isOpen={open?.kind === 'menu' && open.id === menu.id}
            onToggle={() => toggleMenu(menu.id)}
            onHover={() => hoverMenu(menu.id)}
            onClose={() => setOpen(null)}
          />
        ))}
      </div>

      <div className="menubar__right">
        <button type="button" className="menubar__status" aria-label="Search" title="Spotlight (⌘K)" onClick={commands.openSpotlight}>
          <Glyph name="search" size={15} />
        </button>
        <span className="menubar__status" aria-hidden="true">
          <Glyph name="wifi" size={16} />
        </span>
        <span className="menubar__status menubar__battery" aria-label="Battery 100%">
          <Glyph name="battery" size={22} />
        </span>
        <button
          type="button"
          className={`menubar__status ${open?.kind === 'control-center' ? 'is-open' : ''}`}
          aria-label="Control Center"
          aria-expanded={open?.kind === 'control-center'}
          onClick={() => setOpen((cur) => (cur?.kind === 'control-center' ? null : { kind: 'control-center' }))}
        >
          <Glyph name="control-center" size={16} />
        </button>
        <button type="button" className="menubar__clock" onClick={commands.openSpotlight} aria-label={`${dateLabel} ${timeLabel}`}>
          <span>{dateLabel}</span>
          <span>{timeLabel}</span>
        </button>

        {open?.kind === 'control-center' ? (
          <div className="glass menubar__popover control-center" role="dialog" aria-label="Control Center">
            <div className="control-center__head">
              <strong>Control Center</strong>
              <span className="control-center__sub">Liquid Glass · {state.settings.wallpaper}</span>
            </div>
            <AppearanceControls compact />
          </div>
        ) : null}
      </div>
    </div>
  )
}

interface MenuButtonProps {
  menu: Menu
  isOpen: boolean
  onToggle: () => void
  onHover: () => void
  onClose: () => void
}

function MenuButton({ menu, isOpen, onToggle, onHover, onClose }: MenuButtonProps) {
  const isApple = menu.id === 'apple'
  return (
    <div className="menubar__item-wrap" onPointerEnter={onHover}>
      <button
        type="button"
        role="menuitem"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        className={`menubar__item ${isOpen ? 'is-open' : ''} ${menu.emphasis ? 'is-emphasis' : ''} ${isApple ? 'is-apple' : ''}`}
        onClick={onToggle}
      >
        {isApple ? <Glyph name="apple" size={17} /> : menu.label}
      </button>
      {isOpen ? (
        <div className="glass menu" role="menu" aria-label={menu.label || 'Apple'}>
          {menu.items.map((item, i) => {
            if (item.kind === 'separator') return <div key={i} className="menu__sep" role="separator" />
            if (item.kind === 'header')
              return (
                <div key={i} className="menu__header">
                  {item.label}
                </div>
              )
            return (
              <button
                key={i}
                type="button"
                role="menuitemcheckbox"
                aria-checked={item.checked ?? false}
                className="menu__item"
                disabled={item.disabled}
                onClick={() => {
                  item.onSelect()
                  onClose()
                }}
              >
                <span className="menu__check" aria-hidden="true">
                  {item.checked ? <Glyph name="check" size={12} strokeWidth={3} /> : null}
                </span>
                <span className="menu__label">{item.label}</span>
                {item.shortcut ? <span className="menu__shortcut">{item.shortcut}</span> : null}
              </button>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}
