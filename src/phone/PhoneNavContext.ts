import { createContext, useContext } from 'react'

export interface PhoneNav {
  goHome: () => void
}

export const PhoneNavContext = createContext<PhoneNav>({ goHome: () => {} })

export function usePhoneNav(): PhoneNav {
  return useContext(PhoneNavContext)
}
