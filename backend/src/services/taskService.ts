import type { CreateTaskInput, ListTasksQuery, UpdateTaskInput } from '@life-os/shared'
import { prisma } from '../config/db.js'
import { ApiError } from '../middleware/errorHandler.js'
import type { CreateSubtaskInput, UpdateSubtaskInput } from '@life-os/shared'
import {
  listTasks as repoListTasks,
  findTaskById,
  createTask as repoCreateTask,
  updateTask as repoUpdateTask,
  softDeleteTask,
  findSubtaskById,
  createSubtask as repoCreateSubtask,
  updateSubtask as repoUpdateSubtask,
  deleteSubtask as repoDeleteSubtask,
} from '../repositories/taskRepository.js'
import { recomputeProgress } from '../repositories/goalRepository.js'
import * as automationService from './automationService.js'
import * as gamificationService from './gamificationService.js'

async function assertGoalOwnership(userId: string, goalId: string) {
  const goal = await prisma.goal.findFirst({ where: { id: goalId, userId } })
  if (!goal) {
    throw new ApiError(400, 'VALIDATION_ERROR', 'goalId does not belong to this user')
  }
}

async function recomputeProgressAndCheckAutomations(userId: string, goalId: string) {
  const progress = await recomputeProgress(goalId)
  void automationService.runGoalProgressTriggers(userId, goalId, progress)
  if (progress === 100) {
    void gamificationService.award(userId, 'goal_completed')
  }
}

export function listForUser(userId: string, query: ListTasksQuery) {
  return repoListTasks(userId, query)
}

export async function create(userId: string, input: CreateTaskInput) {
  if (input.goalId) {
    await assertGoalOwnership(userId, input.goalId)
  }
  const task = await repoCreateTask(userId, input)
  if (task.goalId) {
    await recomputeProgressAndCheckAutomations(userId, task.goalId)
  }
  return task
}

export async function update(userId: string, id: string, input: UpdateTaskInput) {
  const existing = await findTaskById(userId, id)
  if (!existing) {
    throw new ApiError(404, 'NOT_FOUND', 'Task not found')
  }
  if (input.goalId) {
    await assertGoalOwnership(userId, input.goalId)
  }
  const task = await repoUpdateTask(id, input)

  if (existing.status !== 'DONE' && task.status === 'DONE') {
    void gamificationService.award(userId, 'task_completed')
  }

  // Recompute whichever goal(s) this task affects — status change on the
  // same goal, or the task moved from one goal to another.
  const affectedGoalIds = new Set(
    [existing.goalId, task.goalId].filter((v) => v !== null),
  )
  for (const goalId of affectedGoalIds) {
    await recomputeProgressAndCheckAutomations(userId, goalId)
  }

  return task
}

export async function remove(userId: string, id: string) {
  const existing = await findTaskById(userId, id)
  if (!existing) {
    throw new ApiError(404, 'NOT_FOUND', 'Task not found')
  }
  await softDeleteTask(id)
  if (existing.goalId) {
    await recomputeProgressAndCheckAutomations(userId, existing.goalId)
  }
}

export async function getOne(userId: string, id: string) {
  const task = await findTaskById(userId, id)
  if (!task) {
    throw new ApiError(404, 'NOT_FOUND', 'Task not found')
  }
  return task
}

// --- Subtasks ---------------------------------------------------------------

export async function addSubtask(
  userId: string,
  taskId: string,
  input: CreateSubtaskInput,
) {
  const task = await findTaskById(userId, taskId)
  if (!task) throw new ApiError(404, 'NOT_FOUND', 'Task not found')
  return repoCreateSubtask(taskId, input.title)
}

async function assertSubtaskOwned(userId: string, subtaskId: string) {
  const subtask = await findSubtaskById(subtaskId)
  if (!subtask || subtask.task.userId !== userId || subtask.task.deletedAt) {
    throw new ApiError(404, 'NOT_FOUND', 'Subtask not found')
  }
  return subtask
}

export async function editSubtask(
  userId: string,
  subtaskId: string,
  input: UpdateSubtaskInput,
) {
  await assertSubtaskOwned(userId, subtaskId)
  return repoUpdateSubtask(subtaskId, input)
}

export async function removeSubtask(userId: string, subtaskId: string) {
  await assertSubtaskOwned(userId, subtaskId)
  await repoDeleteSubtask(subtaskId)
}
