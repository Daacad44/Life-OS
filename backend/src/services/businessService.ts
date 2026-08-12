import type {
  Client,
  CreateClientInput,
  CreateProjectInput,
  Project,
  UpdateProjectInput,
} from '@life-os/shared'
import { ApiError } from '../middleware/errorHandler.js'
import * as businessRepo from '../repositories/businessRepository.js'

export async function listProjects(userId: string): Promise<Project[]> {
  const rows = await businessRepo.listProjects(userId)
  return rows.map((p) => ({
    ...p,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }))
}

export async function createProject(
  userId: string,
  input: CreateProjectInput,
): Promise<Project> {
  const project = await businessRepo.createProject(userId, input)
  return {
    ...project,
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString(),
  }
}

export async function updateProject(
  userId: string,
  id: string,
  input: UpdateProjectInput,
): Promise<Project> {
  const existing = await businessRepo.findProjectById(userId, id)
  if (!existing) {
    throw new ApiError(404, 'NOT_FOUND', 'Project not found')
  }
  const project = await businessRepo.updateProject(id, input)
  return {
    ...project,
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString(),
  }
}

export async function deleteProject(userId: string, id: string): Promise<void> {
  const existing = await businessRepo.findProjectById(userId, id)
  if (!existing) {
    throw new ApiError(404, 'NOT_FOUND', 'Project not found')
  }
  await businessRepo.softDeleteProject(id)
}

export async function deleteClient(userId: string, id: string): Promise<void> {
  const existing = await businessRepo.findClientById(userId, id)
  if (!existing) {
    throw new ApiError(404, 'NOT_FOUND', 'Client not found')
  }
  await businessRepo.softDeleteClient(id)
}

export async function listClients(userId: string): Promise<Client[]> {
  const rows = await businessRepo.listClients(userId)
  return rows.map((c) => ({
    ...c,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
  }))
}

export async function createClient(
  userId: string,
  input: CreateClientInput,
): Promise<Client> {
  const client = await businessRepo.createClient(
    userId,
    input.name,
    input.details ?? null,
  )
  return {
    ...client,
    createdAt: client.createdAt.toISOString(),
    updatedAt: client.updatedAt.toISOString(),
  }
}
