import type { DashboardResponse } from '@life-os/shared'
import { apiFetch } from '@/lib/api'

export function getDashboard() {
  return apiFetch<DashboardResponse>('/v1/dashboard')
}
