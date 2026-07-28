import type {
  CreateGoalInput,
  CreateSubGoalInput,
  GoalBreakdownResult,
  UpdateGoalInput,
  UpdateSubGoalInput,
} from '@life-os/shared'
import { ApiError } from '../middleware/errorHandler.js'
import * as goalRepo from '../repositories/goalRepository.js'
import * as taskRepo from '../repositories/taskRepository.js'
import * as aiService from '../ai/service.js'
import { goalBreakdownSystemPrompt, goalBreakdownUserPrompt } from '../ai/prompts.js'

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

// AI breakdown — see Goal Engine.md Section 6 and AI Architecture.md.
export async function breakdown(
  userId: string,
  goalId: string,
): Promise<GoalBreakdownResult> {
  const goal = await getOne(userId, goalId)

  const result = await aiService.generateJson<{
    subGoals: string[]
    firstTasks: string[]
    advice: string
  }>({
    userId,
    feature: 'goal_breakdown',
    system: goalBreakdownSystemPrompt(),
    messages: [
      {
        role: 'user',
        content: goalBreakdownUserPrompt({
          title: goal.title,
          description: goal.description,
          targetDate: goal.targetDate,
        }),
      },
    ],
    maxTokens: 1000,
  })

  const createdSubGoals = []
  for (const title of result.subGoals.slice(0, 5)) {
    createdSubGoals.push(await goalRepo.createSubGoal(goalId, title))
  }

  const createdTasks = []
  for (const title of result.firstTasks.slice(0, 4)) {
    createdTasks.push(await taskRepo.createTask(userId, { title, goalId }))
  }

  await goalRepo.recomputeProgress(goalId)

  return {
    createdSubGoals: createdSubGoals.map((s) => ({ id: s.id, title: s.title })),
    createdTasks: createdTasks.map((t) => ({ id: t.id, title: t.title })),
    advice: result.advice,
  }
}
