import type { Automation, CreateAutomationInput } from '@life-os/shared'
import { apiFetch } from '@/lib/api'

export function listAutomations() {
  return apiFetch<Automation[]>('/v1/automations')
}

export function createAutomation(input: CreateAutomationInput) {
  return apiFetch<Automation>('/v1/automations', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export function updateAutomation(
  id: string,
  input: { name?: string; enabled?: boolean },
) {
  return apiFetch<Automation>(`/v1/automations/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  })
}

export async function deleteAutomation(id: string) {
  await apiFetch<null>(`/v1/automations/${id}`, { method: 'DELETE' })
}
