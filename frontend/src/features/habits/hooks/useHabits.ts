import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as habitsApi from '../api'

export function useHabits() {
  return useQuery({ queryKey: ['habits'], queryFn: habitsApi.listHabits })
}

export function useCreateHabit() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: habitsApi.createHabit,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['habits'] }),
  })
}

export function useDeleteHabit() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: habitsApi.deleteHabit,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['habits'] }),
  })
}

export function useCheckin() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: habitsApi.checkin,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['habits'] }),
  })
}
