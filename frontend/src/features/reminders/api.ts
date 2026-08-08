import type {
  CreateReminderInput,
  ListRemindersQuery,
  PendingAlarm,
  Reminder,
} from '@life-os/shared'
import { apiFetch } from '@/lib/api'

export function listReminders(query: Partial<ListRemindersQuery> = {}) {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined) params.set(key, String(value))
  }
  const qs = params.toString()
  return apiFetch<Reminder[]>(`/v1/reminders${qs ? `?${qs}` : ''}`)
}

export function createReminder(input: CreateReminderInput) {
  return apiFetch<Reminder>('/v1/reminders', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export async function deleteReminder(id: string) {
  await apiFetch<null>(`/v1/reminders/${id}`, { method: 'DELETE' })
}

/** Fired-but-undismissed reminders — polled to raise the on-screen alarm. */
export function listPendingAlarms() {
  return apiFetch<PendingAlarm[]>('/v1/reminders/alarms')
}

export async function acknowledgeReminder(id: string) {
  await apiFetch<null>(`/v1/reminders/${id}/acknowledge`, { method: 'POST' })
}

export function snoozeReminder(id: string, minutes: number) {
  return apiFetch<Reminder>(`/v1/reminders/${id}/snooze`, {
    method: 'POST',
    body: JSON.stringify({ minutes }),
  })
}
