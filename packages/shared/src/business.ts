import { z } from 'zod'

export const ProjectStatus = ['ACTIVE', 'ON_HOLD', 'COMPLETED'] as const
export type ProjectStatus = (typeof ProjectStatus)[number]

export const createProjectSchema = z.object({
  name: z.string().min(1).max(200),
  status: z.enum(ProjectStatus).default('ACTIVE'),
})
export type CreateProjectInput = z.infer<typeof createProjectSchema>

export const updateProjectSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  status: z.enum(ProjectStatus).optional(),
})
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>

export const createClientSchema = z.object({
  name: z.string().min(1).max(200),
  details: z.string().max(2000).optional(),
})
export type CreateClientInput = z.infer<typeof createClientSchema>

export interface Project {
  id: string
  userId: string
  name: string
  status: ProjectStatus
  createdAt: string
  updatedAt: string
}

export interface Client {
  id: string
  userId: string
  name: string
  details: string | null
  createdAt: string
  updatedAt: string
}
