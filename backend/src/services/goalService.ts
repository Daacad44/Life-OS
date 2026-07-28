import type {
  CreateGoalInput,
  CreateSubGoalInput,
  UpdateGoalInput,
  UpdateSubGoalInput,
} from '@life-os/shared'
import { ApiError } from '../middleware/errorHandler.js'
import * as goalRepo from '../repositories/goalRepository.js'

export function listForUser(userId: string) {
  return goalRepo.listGoals(userId)
}

export async function getOne(userId: string, id: string) {
  const goal = await goalRepo.findGoalById(userId, id)
  if (!goal) {
    throw new ApiError(404, 'NOT_FOUND', 'Goal not found')
  }
  return goal
}

export function create(userId: string, input: CreateGoalInput) {
  return goalRepo.createGoal(userId, input)
}

export async function update(userId: string, id: string, input: UpdateGoalInput) {
  await getOne(userId, id)
  return goalRepo.updateGoal(id, input)
}

export async function remove(userId: string, id: string) {
  await getOne(userId, id)
  await goalRepo.softDeleteGoal(id)
}

export async function addSubGoal(
  userId: string,
  goalId: string,
  input: CreateSubGoalInput,
) {
  await getOne(userId, goalId)
  const subGoal = await goalRepo.createSubGoal(goalId, input.title)
  await goalRepo.recomputeProgress(goalId)
  return subGoal
}

export async function updateSubGoal(
  userId: string,
  goalId: string,
  subGoalId: string,
  input: UpdateSubGoalInput,
) {
  await getOne(userId, goalId)
  const existing = await goalRepo.findSubGoal(goalId, subGoalId)
  if (!existing) {
    throw new ApiError(404, 'NOT_FOUND', 'Sub-goal not found')
  }
  const subGoal = await goalRepo.updateSubGoal(subGoalId, input)
  await goalRepo.recomputeProgress(goalId)
  return subGoal
}

export async function removeSubGoal(userId: string, goalId: string, subGoalId: string) {
  await getOne(userId, goalId)
  const existing = await goalRepo.findSubGoal(goalId, subGoalId)
  if (!existing) {
    throw new ApiError(404, 'NOT_FOUND', 'Sub-goal not found')
  }
  await goalRepo.deleteSubGoal(subGoalId)
  await goalRepo.recomputeProgress(goalId)
}
