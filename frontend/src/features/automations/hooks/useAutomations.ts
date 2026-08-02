import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as automationsApi from '../api'

export function useAutomations() {
  return useQuery({ queryKey: ['automations'], queryFn: automationsApi.listAutomations })
}

function useInvalidateAutomations() {
  const queryClient = useQueryClient()
  return () => queryClient.invalidateQueries({ queryKey: ['automations'] })
}

export function useCreateAutomation() {
  const invalidate = useInvalidateAutomations()
  return useMutation({
    mutationFn: automationsApi.createAutomation,
    onSuccess: invalidate,
  })
}

export function useUpdateAutomation() {
  const invalidate = useInvalidateAutomations()
  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: string
      input: { name?: string; enabled?: boolean }
    }) => automationsApi.updateAutomation(id, input),
    onSuccess: invalidate,
  })
}

export function useDeleteAutomation() {
  const invalidate = useInvalidateAutomations()
  return useMutation({
    mutationFn: automationsApi.deleteAutomation,
    onSuccess: invalidate,
  })
}
