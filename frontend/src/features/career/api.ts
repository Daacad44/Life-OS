import type {
  CareerOverview,
  CareerPlanResult,
  CreateCareerGoalInput,
  CreateMilestoneInput,
  CreateSkillInput,
  GenerateCareerPlanInput,
  Milestone,
} from '@life-os/shared'
import { apiFetch } from '@/lib/api'

export function getOverview() {
  return apiFetch<CareerOverview>('/v1/career/overview')
}

export function createCareerGoal(input: CreateCareerGoalInput) {
  return apiFetch('/v1/career/goals', { method: 'POST', body: JSON.stringify(input) })
}

export function createSkill(input: CreateSkillInput) {
  return apiFetch('/v1/career/skills', { method: 'POST', body: JSON.stringify(input) })
}

export function createMilestone(input: CreateMilestoneInput) {
  return apiFetch<Milestone>('/v1/career/milestones', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export function updateMilestone(id: string, done: boolean) {
  return apiFetch<Milestone>(`/v1/career/milestones/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ done }),
  })
}

export function generatePlan(input: GenerateCareerPlanInput) {
  return apiFetch<CareerPlanResult>('/v1/career/plan', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}
