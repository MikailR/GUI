import { DesktopShell } from './desktop/DesktopShell'
import { useApplyAppearance, useIsPhone, useResolvedAppearance } from './os/hooks'
import { StoreProvider, useSettings } from './os/store'
import { PhoneShell } from './phone/PhoneShell'

function Shell() {
  const settings = useSettings()
  const resolved = useResolvedAppearance()
  useApplyAppearance(settings, resolved)
  const isPhone = useIsPhone()
  return isPhone ? <PhoneShell /> : <DesktopShell />
}

export default function App() {
  return (
    <StoreProvider>
      <Shell />
    </StoreProvider>
  )
}
