import type {
  Notification,
  NotificationPreferences,
  UpdateNotificationPreferencesInput,
} from '@life-os/shared'
import { apiFetch } from '@/lib/api'

export function listNotifications() {
  return apiFetch<Notification[]>('/v1/notifications')
}

export function markRead(id: string) {
  return apiFetch<Notification>(`/v1/notifications/${id}/read`, { method: 'PATCH' })
}

export async function markAllRead() {
  await apiFetch<null>('/v1/notifications/read-all', { method: 'PATCH' })
}

export function getPreferences() {
  return apiFetch<NotificationPreferences>('/v1/notifications/preferences')
}

export function updatePreferences(input: UpdateNotificationPreferencesInput) {
  return apiFetch<NotificationPreferences>('/v1/notifications/preferences', {
    method: 'PATCH',
    body: JSON.stringify(input),
  })
}
