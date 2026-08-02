import { z } from 'zod'

export const createCareerGoalSchema = z.object({
  title: z.string().min(1).max(200),
  targetRole: z.string().max(200).optional(),
  description: z.string().max(2000).optional(),
})
export type CreateCareerGoalInput = z.infer<typeof createCareerGoalSchema>

export const createSkillSchema = z.object({
  name: z.string().min(1).max(100),
  level: z.number().int().min(1).max(5).default(1),
})
export type CreateSkillInput = z.infer<typeof createSkillSchema>

export const createMilestoneSchema = z.object({
  title: z.string().min(1).max(200),
  careerGoalId: z.string().uuid().optional(),
})
export type CreateMilestoneInput = z.infer<typeof createMilestoneSchema>

export const updateMilestoneSchema = z.object({
  done: z.boolean().optional(),
})
export type UpdateMilestoneInput = z.infer<typeof updateMilestoneSchema>

export const generateCareerPlanSchema = z.object({
  careerGoalId: z.string().uuid(),
})
export type GenerateCareerPlanInput = z.infer<typeof generateCareerPlanSchema>

export interface CareerGoal {
  id: string
  userId: string
  title: string
  targetRole: string | null
  description: string | null
  createdAt: string
  updatedAt: string
}

export interface Skill {
  id: string
  userId: string
  name: string
  level: number
  createdAt: string
  updatedAt: string
}

export interface Milestone {
  id: string
  userId: string
  careerGoalId: string | null
  title: string
  done: boolean
  createdAt: string
}

export interface CareerOverview {
  careerGoals: CareerGoal[]
  skills: Skill[]
  milestones: Milestone[]
}

export interface CareerPlanResult {
  createdSkills: Skill[]
  createdMilestones: Milestone[]
  advice: string
}
