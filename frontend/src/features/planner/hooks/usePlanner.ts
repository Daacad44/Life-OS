import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { PlannerResponse } from '@life-os/shared'
import * as plannerApi from '../api'

function planKey(date: string) {
  return ['planner', date] as const
}

export function usePlan(date: string) {
  return useQuery({
    queryKey: planKey(date),
    queryFn: () => plannerApi.getPlan(date),
  })
}

// Reorders the `tasks` array locally (optimistic) and persists via PATCH /planner/reorder.
export function useReorder(date: string) {
  const queryClient = useQueryClient()
  const key = planKey(date)

  return useMutation({
    mutationFn: plannerApi.reorder,
    onMutate: async (taskIds) => {
      await queryClient.cancelQueries({ queryKey: key })
      const previous = queryClient.getQueryData<PlannerResponse>(key)

      queryClient.setQueryData<PlannerResponse | undefined>(key, (old) => {
        if (!old) return old
        const byId = new Map(old.tasks.map((t) => [t.id, t]))
        const reordered = taskIds.map((id) => byId.get(id)).filter((t) => t !== undefined)
        return { ...old, tasks: reordered }
      })

      return { previous }
    },
    onError: (_err, _taskIds, context) => {
      if (context?.previous) queryClient.setQueryData(key, context.previous)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['planner'] })
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}
