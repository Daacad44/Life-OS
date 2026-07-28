import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { CreateSubGoalInput, UpdateSubGoalInput } from '@life-os/shared'
import * as goalsApi from '../api'

export function useGoals() {
  return useQuery({ queryKey: ['goals'], queryFn: goalsApi.listGoals })
}

export function useGoal(id: string) {
  return useQuery({ queryKey: ['goals', id], queryFn: () => goalsApi.getGoal(id) })
}

export function useCreateGoal() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: goalsApi.createGoal,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['goals'] }),
  })
}

export function useUpdateGoal(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: Parameters<typeof goalsApi.updateGoal>[1]) =>
      goalsApi.updateGoal(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] })
      queryClient.invalidateQueries({ queryKey: ['goals', id] })
    },
  })
}

export function useDeleteGoal() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: goalsApi.deleteGoal,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['goals'] }),
  })
}

function useInvalidateGoal(goalId: string) {
  const queryClient = useQueryClient()
  return () => {
    queryClient.invalidateQueries({ queryKey: ['goals'] })
    queryClient.invalidateQueries({ queryKey: ['goals', goalId] })
  }
}

export function useAddSubGoal(goalId: string) {
  const invalidate = useInvalidateGoal(goalId)
  return useMutation({
    mutationFn: (input: CreateSubGoalInput) => goalsApi.addSubGoal(goalId, input),
    onSuccess: invalidate,
  })
}

export function useUpdateSubGoal(goalId: string) {
  const invalidate = useInvalidateGoal(goalId)
  return useMutation({
    mutationFn: ({
      subGoalId,
      input,
    }: {
      subGoalId: string
      input: UpdateSubGoalInput
    }) => goalsApi.updateSubGoal(goalId, subGoalId, input),
    onSuccess: invalidate,
  })
}

export function useDeleteSubGoal(goalId: string) {
  const invalidate = useInvalidateGoal(goalId)
  return useMutation({
    mutationFn: (subGoalId: string) => goalsApi.deleteSubGoal(goalId, subGoalId),
    onSuccess: invalidate,
  })
}

export function useBreakdownGoal(goalId: string) {
  const invalidate = useInvalidateGoal(goalId)
  return useMutation({
    mutationFn: () => goalsApi.breakdownGoal(goalId),
    onSuccess: invalidate,
  })
}
