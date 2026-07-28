import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as focusApi from '../api'

export function useFocusSessions() {
  return useQuery({ queryKey: ['focus', 'sessions'], queryFn: focusApi.listSessions })
}

export function useStartFocus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: focusApi.startSession,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['focus'] }),
  })
}

export function useEndFocus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: focusApi.endSession,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['focus'] }),
  })
}
