import type { WeeklyReview } from '@life-os/shared'
import { apiFetch } from '@/lib/api'

export function getCurrentReview() {
  return apiFetch<WeeklyReview | null>('/v1/reviews/weekly')
}

export function generateReview() {
  return apiFetch<WeeklyReview>('/v1/reviews/weekly/generate', { method: 'POST' })
}

export function listReviews() {
  return apiFetch<WeeklyReview[]>('/v1/reviews')
}
