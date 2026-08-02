import type {
  CreateHealthLogInput,
  HealthLog,
  HealthTrendsResponse,
} from '@life-os/shared'
import { apiFetch } from '@/lib/api'

export function listLogs() {
  return apiFetch<HealthLog[]>('/v1/health-metrics/logs')
}

export function createLog(input: CreateHealthLogInput) {
  return apiFetch<HealthLog>('/v1/health-metrics/logs', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export function getTrends(range: 'week' | 'month') {
  return apiFetch<HealthTrendsResponse>(`/v1/health-metrics/trends?range=${range}`)
}
