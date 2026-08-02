import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as studyApi from '../api'

export function useSubjects() {
  return useQuery({ queryKey: ['study', 'subjects'], queryFn: studyApi.listSubjects })
}

function useInvalidateStudy() {
  const queryClient = useQueryClient()
  return () => queryClient.invalidateQueries({ queryKey: ['study'] })
}

export function useCreateSubject() {
  const invalidate = useInvalidateStudy()
  return useMutation({ mutationFn: studyApi.createSubject, onSuccess: invalidate })
}

export function useCreateSession() {
  const invalidate = useInvalidateStudy()
  return useMutation({ mutationFn: studyApi.createSession, onSuccess: invalidate })
}

export function useUpdateSession() {
  const invalidate = useInvalidateStudy()
  return useMutation({
    mutationFn: ({ id, done }: { id: string; done: boolean }) =>
      studyApi.updateSession(id, done),
    onSuccess: invalidate,
  })
}

export function useGeneratePlan() {
  const invalidate = useInvalidateStudy()
  return useMutation({ mutationFn: studyApi.generatePlan, onSuccess: invalidate })
}
