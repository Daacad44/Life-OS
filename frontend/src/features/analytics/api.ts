import type {
  AnalyticsInsights,
  AnalyticsOverview,
  AnalyticsRange,
} from '@life-os/shared'
import { apiFetch } from '@/lib/api'

export function getOverview(range: AnalyticsRange) {
  return apiFetch<AnalyticsOverview>(`/v1/analytics/overview?range=${range}`)
}

export function getInsights(range: AnalyticsRange) {
  return apiFetch<AnalyticsInsights>(`/v1/analytics/insights?range=${range}`)
}
