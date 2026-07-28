import type {
  CreateGoalInput,
  CreateSubGoalInput,
  Goal,
  GoalWithTasks,
  UpdateGoalInput,
  UpdateSubGoalInput,
} from '@life-os/shared'
import { apiFetch } from '@/lib/api'

export function listGoals() {
  return apiFetch<Goal[]>('/v1/goals')
}

export function getGoal(id: string) {
  return apiFetch<GoalWithTasks>(`/v1/goals/${id}`)
}

export function createGoal(input: CreateGoalInput) {
  return apiFetch<Goal>('/v1/goals', { method: 'POST', body: JSON.stringify(input) })
}

export function updateGoal(id: string, input: UpdateGoalInput) {
  return apiFetch<Goal>(`/v1/goals/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  })
}

export async function deleteGoal(id: string) {
  await apiFetch<null>(`/v1/goals/${id}`, { method: 'DELETE' })
}

export function addSubGoal(goalId: string, input: CreateSubGoalInput) {
  return apiFetch(`/v1/goals/${goalId}/subgoals`, {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export function updateSubGoal(
  goalId: string,
  subGoalId: string,
  input: UpdateSubGoalInput,
) {
  return apiFetch(`/v1/goals/${goalId}/subgoals/${subGoalId}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  })
}

export async function deleteSubGoal(goalId: string, subGoalId: string) {
  await apiFetch<null>(`/v1/goals/${goalId}/subgoals/${subGoalId}`, { method: 'DELETE' })
}
