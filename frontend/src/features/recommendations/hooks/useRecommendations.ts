import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as recommendationsApi from '../api'

export function useRecommendations() {
  return useQuery({
    queryKey: ['recommendations'],
    queryFn: recommendationsApi.listRecommendations,
  })
}

export function useAcceptRecommendation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: recommendationsApi.accept,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['recommendations'] }),
  })
}

export function useDismissRecommendation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: recommendationsApi.dismiss,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['recommendations'] }),
  })
}
