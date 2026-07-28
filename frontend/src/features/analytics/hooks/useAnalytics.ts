import { useQuery } from '@tanstack/react-query'
import type { AnalyticsRange } from '@life-os/shared'
import * as analyticsApi from '../api'

export function useAnalyticsOverview(range: AnalyticsRange) {
  return useQuery({
    queryKey: ['analytics', 'overview', range],
    queryFn: () => analyticsApi.getOverview(range),
  })
}

export function useAnalyticsInsights(range: AnalyticsRange) {
  return useQuery({
    queryKey: ['analytics', 'insights', range],
    queryFn: () => analyticsApi.getInsights(range),
  })
}
