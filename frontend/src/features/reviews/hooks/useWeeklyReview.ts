import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as reviewsApi from '../api'

export function useCurrentReview() {
  return useQuery({
    queryKey: ['reviews', 'current'],
    queryFn: reviewsApi.getCurrentReview,
  })
}

export function usePastReviews() {
  return useQuery({ queryKey: ['reviews', 'past'], queryFn: reviewsApi.listReviews })
}

export function useGenerateReview() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: reviewsApi.generateReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] })
    },
  })
}
