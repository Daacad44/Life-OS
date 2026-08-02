import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as careerApi from '../api'

export function useCareerOverview() {
  return useQuery({ queryKey: ['career'], queryFn: careerApi.getOverview })
}

function useInvalidateCareer() {
  const queryClient = useQueryClient()
  return () => queryClient.invalidateQueries({ queryKey: ['career'] })
}

export function useCreateCareerGoal() {
  const invalidate = useInvalidateCareer()
  return useMutation({ mutationFn: careerApi.createCareerGoal, onSuccess: invalidate })
}

export function useCreateSkill() {
  const invalidate = useInvalidateCareer()
  return useMutation({ mutationFn: careerApi.createSkill, onSuccess: invalidate })
}

export function useCreateMilestone() {
  const invalidate = useInvalidateCareer()
  return useMutation({ mutationFn: careerApi.createMilestone, onSuccess: invalidate })
}

export function useUpdateMilestone() {
  const invalidate = useInvalidateCareer()
  return useMutation({
    mutationFn: ({ id, done }: { id: string; done: boolean }) =>
      careerApi.updateMilestone(id, done),
    onSuccess: invalidate,
  })
}

export function useGenerateCareerPlan() {
  const invalidate = useInvalidateCareer()
  return useMutation({ mutationFn: careerApi.generatePlan, onSuccess: invalidate })
}
