import type { CreateReflectionInput, Reflection, ReflectionPeriod } from '@life-os/shared'
import { apiFetch } from '@/lib/api'

export function listReflections() {
  return apiFetch<Reflection[]>('/v1/reflections')
}

export function getReflectionPrompt(period: ReflectionPeriod) {
  return apiFetch<{ prompt: string }>(`/v1/reflections/prompt?period=${period}`)
}

export function createReflection(input: CreateReflectionInput) {
  return apiFetch<Reflection>('/v1/reflections', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}
