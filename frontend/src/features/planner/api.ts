import type { PlannerResponse } from '@life-os/shared'
import { apiFetch } from '@/lib/api'

export function getPlan(date: string) {
  return apiFetch<PlannerResponse>(`/v1/planner/${date}`)
}

export async function reorder(taskIds: string[]) {
  await apiFetch<null>('/v1/planner/reorder', {
    method: 'PATCH',
    body: JSON.stringify({ taskIds }),
  })
}
