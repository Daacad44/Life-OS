import type { CalendarEvent, CreateEventInput, UpdateEventInput } from '@life-os/shared'
import { apiFetch } from '@/lib/api'

export function listEvents(start: Date, end: Date) {
  const params = new URLSearchParams({
    start: start.toISOString(),
    end: end.toISOString(),
  })
  return apiFetch<CalendarEvent[]>(`/v1/events?${params.toString()}`)
}

export function createEvent(input: CreateEventInput) {
  return apiFetch<CalendarEvent>('/v1/events', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export function updateEvent(id: string, input: UpdateEventInput) {
  return apiFetch<CalendarEvent>(`/v1/events/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  })
}

export async function deleteEvent(id: string) {
  await apiFetch<null>(`/v1/events/${id}`, { method: 'DELETE' })
}
