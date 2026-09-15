import { useEffect, useState } from 'react'

export function useNow(interval = 1000) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), interval)
    return () => clearInterval(t)
  }, [interval])
  return now
}

export function Clock({ date = true }: { date?: boolean }) {
  const now = useNow()
  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const day = now.toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short' })
  return (
    <span>
      {date ? `${day}  ` : ''}
      {time}
    </span>
  )
}
