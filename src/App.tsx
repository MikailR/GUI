import { lazy, Suspense } from 'react'
import { OsProvider } from './os/store'
import { PHONE_QUERY, useMediaQuery } from './os/hooks'

const DesktopShell = lazy(() => import('./desktop/DesktopShell'))
const PhoneShell = lazy(() => import('./phone/PhoneShell'))

/**
 * Root: one store, two shells. ≤820px renders the iOS shell,
 * anything wider renders the macOS desktop.
 */
export function App() {
  const isPhone = useMediaQuery(PHONE_QUERY)
  return (
    <OsProvider>
      <Suspense fallback={<div className="boot-fallback" aria-hidden="true" />}>
        {isPhone ? <PhoneShell /> : <DesktopShell />}
      </Suspense>
    </OsProvider>
  )
}
