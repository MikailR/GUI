import { createContext, useContext } from 'react'

/** Lets an app's scroll container tell the phone shell when its large title has scrolled away. */
export interface PhoneNav {
  setCompactTitle: (compact: boolean) => void
}

export const PhoneNavContext = createContext<PhoneNav | null>(null)

export function usePhoneNav(): PhoneNav | null {
  return useContext(PhoneNavContext)
}
