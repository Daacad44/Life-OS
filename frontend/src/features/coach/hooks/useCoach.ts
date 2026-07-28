import { useCallback, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import * as coachApi from '../api'

export function useCoachHistory() {
  return useQuery({ queryKey: ['coach', 'history'], queryFn: coachApi.getCoachHistory })
}

interface LocalMessage {
  id: string
  role: 'USER' | 'ASSISTANT'
  content: string
}

// Manages one in-flight streamed exchange on top of the persisted history query —
// the streaming chunks live here as local state, then get folded back into `history`
// once the turn completes and the history query is refetched.
export function useCoachChat() {
  const queryClient = useQueryClient()
  const [pending, setPending] = useState<LocalMessage[]>([])
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const send = useCallback(
    async (message: string) => {
      setError(null)
      const assistantId = `local-assistant-${Date.now()}`
      setPending([
        { id: `local-user-${Date.now()}`, role: 'USER', content: message },
        { id: assistantId, role: 'ASSISTANT', content: '' },
      ])
      setIsStreaming(true)
      try {
        await coachApi.streamCoachMessage(message, (chunk) => {
          setPending((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, content: m.content + chunk } : m,
            ),
          )
        })
        await queryClient.invalidateQueries({ queryKey: ['coach', 'history'] })
        setPending([])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong')
      } finally {
        setIsStreaming(false)
      }
    },
    [queryClient],
  )

  return { pending, isStreaming, error, send }
}
