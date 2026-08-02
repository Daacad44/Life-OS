import type { Recommendation } from '@life-os/shared'
import { apiFetch } from '@/lib/api'

export function listRecommendations() {
  return apiFetch<Recommendation[]>('/v1/recommendations')
}

export function accept(id: string) {
  return apiFetch<Recommendation>(`/v1/recommendations/${id}/accept`, { method: 'POST' })
}

export function dismiss(id: string) {
  return apiFetch<Recommendation>(`/v1/recommendations/${id}/dismiss`, { method: 'POST' })
}
