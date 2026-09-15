import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { OSProvider } from './os/store'
import { Desktop } from './os/Desktop'
import { Mobile } from './os/Mobile'
import { Boot } from './os/Boot'
import { useMedia } from './os/useMedia'

export function App() {
  const mobile = useMedia('(max-width: 767px)')
  const [booted, setBooted] = useState(() => sessionStorage.getItem('mikail-os:booted') === '1')

  return (
    <OSProvider mobile={mobile}>
      {mobile ? <Mobile /> : <Desktop />}
      <AnimatePresence>
        {!booted && (
          <Boot
            onDone={() => {
              sessionStorage.setItem('mikail-os:booted', '1')
              setBooted(true)
            }}
          />
        )}
      </AnimatePresence>
    </OSProvider>
  )
}
