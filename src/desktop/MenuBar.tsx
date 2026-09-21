import { useCallback, useEffect, useRef, useState } from 'react'
import { Symbol } from '../icons/Symbol'
import { useClock } from '../os/hooks'
import type { Menu, MenuItem } from './menus'

interface MenuBarProps {
  menus: Menu[]
  controlCenterOpen: boolean
  onToggleControlCenter: () => void
  onSpotlight: () => void
}

export function MenuBar({ menus, controlCenterOpen, onToggleControlCenter, onSpotlight }: MenuBarProps) {
  const [open, setOpen] = useState<string | null>(null)
  const barRef = useRef<HTMLElement | null>(null)
  const now = useClock()

  const close = useCallback(() => setOpen(null), [])

  useEffect(() => {
    if (!open) return
    const onPointer = (event: PointerEvent) => {
      if (barRef.current && !barRef.current.contains(event.target as Node)) close()
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        const index = menus.findIndex((menu) => menu.id === open)
        const delta = event.key === 'ArrowRight' ? 1 : -1
        const next = menus[(index + delta + menus.length) % menus.length]
        setOpen(next.id)
      }
    }
    window.addEventListener('pointerdown', onPointer, true)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('pointerdown', onPointer, true)
      window.removeEventListener('keydown', onKey)
    }
  }, [open, close, menus])

  // "Mon Sep 21" — macOS drops the comma the default locale format adds.
  const date = [
    now.toLocaleDateString(undefined, { weekday: 'short' }),
    now.toLocaleDateString(undefined, { month: 'short' }),
    now.toLocaleDateString(undefined, { day: 'numeric' }),
  ].join(' ')
  const time = now.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })

  return (
    <header ref={barRef} className="mac-menubar" data-open={open ? '' : undefined}>
      <div className="mac-menubar-left" role="menubar" aria-label="Application menus">
        {menus.map((menu) => (
          <div key={menu.id} className="mac-menu">
            <button
              type="button"
              className="mac-menu-title on-wallpaper"
              data-bold={menu.bold || undefined}
              data-mark={menu.mark || undefined}
              aria-haspopup="menu"
              aria-expanded={open === menu.id}
              onPointerDown={(event) => {
                event.preventDefault()
                setOpen(open === menu.id ? null : menu.id)
              }}
              onPointerEnter={() => {
                if (open && open !== menu.id) setOpen(menu.id)
              }}
            >
              {menu.mark ? <Symbol name="os.mark" size={17} title={menu.label} /> : menu.label}
            </button>
            {open === menu.id ? <MenuPanel items={menu.items} onDone={close} /> : null}
          </div>
        ))}
      </div>
      <div className="mac-menubar-right">
        <span className="mac-status on-wallpaper" title="Wi-Fi: Mikail’s network">
          <Symbol name="wifi" size={16} weight={2.2} />
        </span>
        <span className="mac-status on-wallpaper" title="Battery: 84%">
          <Symbol name="battery" size={20} weight={1.9} />
        </span>
        <button type="button" className="mac-status on-wallpaper" onClick={onSpotlight} aria-label="Spotlight search" title="Search  ⌘K">
          <Symbol name="magnifyingglass" size={15} weight={2.4} />
        </button>
        <button
          type="button"
          className="mac-status on-wallpaper"
          onClick={onToggleControlCenter}
          aria-label="Control Center"
          aria-expanded={controlCenterOpen}
          data-active={controlCenterOpen || undefined}
        >
          <Symbol name="switches" size={16} weight={2} />
        </button>
        <span className="mac-clock on-wallpaper tnum">
          <span>{date}</span>
          <span>{time}</span>
        </span>
      </div>
    </header>
  )
}

interface MenuPanelProps {
  items: MenuItem[]
  onDone: () => void
  submenu?: boolean
}

function MenuPanel({ items, onDone, submenu }: MenuPanelProps) {
  const [openSub, setOpenSub] = useState<number | null>(null)
  return (
    <div className={`mac-menu-panel glass glass-thick ${submenu ? 'is-submenu' : ''}`} role="menu">
      {items.map((item, index) => {
        switch (item.kind) {
          case 'separator':
            return <div key={index} className="mac-menu-sep" role="separator" />
          case 'submenu':
            return (
              <div
                key={index}
                className="mac-menu-item has-sub"
                role="menuitem"
                aria-haspopup="menu"
                aria-expanded={openSub === index}
                onPointerEnter={() => setOpenSub(index)}
                onPointerLeave={() => setOpenSub(null)}
              >
                <span className="mac-menu-check" />
                <span className="mac-menu-label">{item.label}</span>
                <Symbol name="chevron.right" size={11} weight={2.6} />
                {openSub === index ? <MenuPanel items={item.items} onDone={onDone} submenu /> : null}
              </div>
            )
          case 'item':
            return (
              <button
                key={index}
                type="button"
                className="mac-menu-item"
                role="menuitemcheckbox"
                aria-checked={item.checked ?? false}
                disabled={item.disabled}
                onClick={() => {
                  item.run()
                  onDone()
                }}
              >
                <span className="mac-menu-check">{item.checked ? <Symbol name="checkmark" size={11} weight={3} /> : null}</span>
                <span className="mac-menu-label">{item.label}</span>
                {item.shortcut ? <span className="mac-menu-shortcut">{item.shortcut}</span> : null}
              </button>
            )
          default: {
            const exhaustive: never = item
            return exhaustive
          }
        }
      })}
    </div>
  )
}
