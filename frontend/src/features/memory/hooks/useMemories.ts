import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as memoryApi from '../api'

export function useMemories() {
  return useQuery({ queryKey: ['memory'], queryFn: memoryApi.listMemories })
}

export function useDeleteMemory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: memoryApi.deleteMemory,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['memory'] }),
  })
}
