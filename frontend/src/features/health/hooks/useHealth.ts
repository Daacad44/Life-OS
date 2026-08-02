import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as healthApi from '../api'

export function useHealthLogs() {
  return useQuery({ queryKey: ['health', 'logs'], queryFn: healthApi.listLogs })
}

export function useHealthTrends(range: 'week' | 'month') {
  return useQuery({
    queryKey: ['health', 'trends', range],
    queryFn: () => healthApi.getTrends(range),
  })
}

export function useCreateHealthLog() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: healthApi.createLog,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['health'] }),
  })
}
