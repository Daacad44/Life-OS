import type { FocusSession, StartFocusSessionInput } from '@life-os/shared'
import { apiFetch } from '@/lib/api'

export function listSessions() {
  return apiFetch<FocusSession[]>('/v1/focus/sessions')
}

export function startSession(input: StartFocusSessionInput) {
  return apiFetch<FocusSession>('/v1/focus/start', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export function endSession(sessionId: string) {
  return apiFetch<FocusSession>('/v1/focus/end', {
    method: 'POST',
    body: JSON.stringify({ sessionId }),
  })
}
