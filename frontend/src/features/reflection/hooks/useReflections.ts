import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { ReflectionPeriod } from '@life-os/shared'
import * as reflectionApi from '../api'

export function useReflections() {
  return useQuery({ queryKey: ['reflections'], queryFn: reflectionApi.listReflections })
}

export function useReflectionPrompt(period: ReflectionPeriod) {
  return useQuery({
    queryKey: ['reflections', 'prompt', period],
    queryFn: () => reflectionApi.getReflectionPrompt(period),
  })
}

export function useCreateReflection() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: reflectionApi.createReflection,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['reflections'] }),
  })
}
