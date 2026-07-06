import { useEffect, useState, useCallback } from 'react'
import { getEvents } from '@lib/soroban'

interface Event {
  id: string
  type: string
  data: any
  timestamp: number
}

export function useEventStream(contractId?: string) {
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubscribed, setIsSubscribed] = useState(false)

  const fetchEvents = useCallback(async () => {
    if (!contractId) return

    setIsLoading(true)
    try {
      const startLedger = 0 // TODO: Track last seen ledger
      const fetchedEvents = await getEvents(contractId, startLedger)
      setEvents(fetchedEvents || [])
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch events')
      console.error('Event stream error:', err)
    } finally {
      setIsLoading(false)
    }
  }, [contractId])

  // Poll for events every 5 seconds
  useEffect(() => {
    if (!contractId) return

    fetchEvents()
    const interval = setInterval(fetchEvents, 5000)
    setIsSubscribed(true)

    return () => {
      clearInterval(interval)
      setIsSubscribed(false)
    }
  }, [contractId, fetchEvents])

  return {
    events,
    isLoading,
    error,
    isSubscribed,
    refetch: fetchEvents,
  }
}
