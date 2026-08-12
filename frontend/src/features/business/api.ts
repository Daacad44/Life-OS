import type {
  Client,
  CreateClientInput,
  CreateProjectInput,
  Project,
  UpdateProjectInput,
} from '@life-os/shared'
import { apiFetch } from '@/lib/api'

export function listProjects() {
  return apiFetch<Project[]>('/v1/business/projects')
}

export function createProject(input: CreateProjectInput) {
  return apiFetch<Project>('/v1/business/projects', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export function updateProject(id: string, input: UpdateProjectInput) {
  return apiFetch<Project>(`/v1/business/projects/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  })
}

export async function deleteProject(id: string) {
  await apiFetch<null>(`/v1/business/projects/${id}`, { method: 'DELETE' })
}

export async function deleteClient(id: string) {
  await apiFetch<null>(`/v1/business/clients/${id}`, { method: 'DELETE' })
}

export function listClients() {
  return apiFetch<Client[]>('/v1/business/clients')
}

export function createClient(input: CreateClientInput) {
  return apiFetch<Client>('/v1/business/clients', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}
