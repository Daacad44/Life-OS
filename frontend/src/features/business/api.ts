import type {
  Client,
  CreateClientInput,
  CreateProjectInput,
  Project,
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

export function listClients() {
  return apiFetch<Client[]>('/v1/business/clients')
}

export function createClient(input: CreateClientInput) {
  return apiFetch<Client>('/v1/business/clients', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}
