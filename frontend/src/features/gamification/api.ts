import type { Achievement, GamificationProfile } from '@life-os/shared'
import { apiFetch } from '@/lib/api'

export function getProfile() {
  return apiFetch<GamificationProfile>('/v1/gamification/profile')
}

export function listAchievements() {
  return apiFetch<Achievement[]>('/v1/gamification/achievements')
}
