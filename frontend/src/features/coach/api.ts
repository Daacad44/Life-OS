import type { ApiFailure, CoachMessage } from '@life-os/shared'
import { apiFetch } from '@/lib/api'

const API_URL = import.meta.env.VITE_API_URL

export function getCoachHistory() {
  return apiFetch<CoachMessage[]>('/v1/ai/coach/history')
}

// The Coach's reply streams as plain text chunks, not a JSON envelope — this bypasses
// apiFetch and reads the response body directly.
export async function streamCoachMessage(
  message: string,
  onDelta: (chunk: string) => void,
): Promise<void> {
  const res = await fetch(`${API_URL}/v1/ai/coach`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  })

  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as ApiFailure | null
    throw new Error(body?.error.message ?? 'Failed to reach the coach')
  }

  const reader = res.body?.getReader()
  if (!reader) return
  const decoder = new TextDecoder()
  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    onDelta(decoder.decode(value, { stream: true }))
  }
}
