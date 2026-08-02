import type {
  CreateStudySessionInput,
  CreateSubjectInput,
  GenerateStudyPlanInput,
  StudyPlanResult,
  StudySession,
  Subject,
} from '@life-os/shared'
import { apiFetch } from '@/lib/api'

export function listSubjects() {
  return apiFetch<Subject[]>('/v1/study/subjects')
}

export function createSubject(input: CreateSubjectInput) {
  return apiFetch<Subject>('/v1/study/subjects', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export function createSession(input: CreateStudySessionInput) {
  return apiFetch<StudySession>('/v1/study/sessions', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export function updateSession(id: string, done: boolean) {
  return apiFetch<StudySession>(`/v1/study/sessions/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ done }),
  })
}

export function generatePlan(input: GenerateStudyPlanInput) {
  return apiFetch<StudyPlanResult>('/v1/study/plan', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}
