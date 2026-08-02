import type {
  CareerOverview,
  CareerPlanResult,
  CreateCareerGoalInput,
  CreateMilestoneInput,
  CreateSkillInput,
  GenerateCareerPlanInput,
  Milestone,
} from '@life-os/shared'
import { ApiError } from '../middleware/errorHandler.js'
import * as careerRepo from '../repositories/careerRepository.js'
import * as aiService from '../ai/service.js'
import { careerPlanSystemPrompt, careerPlanUserPrompt } from '../ai/prompts.js'

export async function getOverview(userId: string): Promise<CareerOverview> {
  const [careerGoals, skills, milestones] = await Promise.all([
    careerRepo.listCareerGoals(userId),
    careerRepo.listSkills(userId),
    careerRepo.listMilestones(userId),
  ])
  return {
    careerGoals: careerGoals.map((g) => ({
      ...g,
      createdAt: g.createdAt.toISOString(),
      updatedAt: g.updatedAt.toISOString(),
    })),
    skills: skills.map((s) => ({
      ...s,
      createdAt: s.createdAt.toISOString(),
      updatedAt: s.updatedAt.toISOString(),
    })),
    milestones: milestones.map(toMilestoneDTO),
  }
}

function toMilestoneDTO(m: {
  id: string
  userId: string
  careerGoalId: string | null
  title: string
  done: boolean
  createdAt: Date
}): Milestone {
  return { ...m, createdAt: m.createdAt.toISOString() }
}

export function createCareerGoal(userId: string, input: CreateCareerGoalInput) {
  return careerRepo.createCareerGoal(userId, input)
}

export function createSkill(userId: string, input: CreateSkillInput) {
  return careerRepo.createSkill(userId, input.name, input.level)
}

export async function createMilestone(userId: string, input: CreateMilestoneInput) {
  if (input.careerGoalId) {
    const goal = await careerRepo.findCareerGoalById(userId, input.careerGoalId)
    if (!goal) {
      throw new ApiError(404, 'NOT_FOUND', 'Career goal not found')
    }
  }
  const milestone = await careerRepo.createMilestone(
    userId,
    input.title,
    input.careerGoalId ?? null,
  )
  return toMilestoneDTO(milestone)
}

export async function updateMilestone(userId: string, id: string, done: boolean) {
  const existing = await careerRepo.findMilestoneById(userId, id)
  if (!existing) {
    throw new ApiError(404, 'NOT_FOUND', 'Milestone not found')
  }
  const milestone = await careerRepo.updateMilestone(id, done)
  return toMilestoneDTO(milestone)
}

// Maps skills + milestones toward a career goal — see Career Planner.md Section 6.
export async function generatePlan(
  userId: string,
  input: GenerateCareerPlanInput,
): Promise<CareerPlanResult> {
  const goal = await careerRepo.findCareerGoalById(userId, input.careerGoalId)
  if (!goal) {
    throw new ApiError(404, 'NOT_FOUND', 'Career goal not found')
  }

  const result = await aiService.generateJson<{
    skills: { name: string; level: number }[]
    milestones: string[]
    advice: string
  }>({
    userId,
    feature: 'career_plan',
    system: careerPlanSystemPrompt(),
    messages: [{ role: 'user', content: careerPlanUserPrompt(goal) }],
    maxTokens: 800,
  })

  const createdSkills = []
  for (const s of result.skills.slice(0, 6)) {
    createdSkills.push(await careerRepo.createSkill(userId, s.name, s.level))
  }

  const createdMilestones = []
  for (const title of result.milestones.slice(0, 6)) {
    createdMilestones.push(await careerRepo.createMilestone(userId, title, goal.id))
  }

  return {
    createdSkills: createdSkills.map((s) => ({
      ...s,
      createdAt: s.createdAt.toISOString(),
      updatedAt: s.updatedAt.toISOString(),
    })),
    createdMilestones: createdMilestones.map(toMilestoneDTO),
    advice: result.advice,
  }
}
