import type { CreateTaskInput, ListTasksQuery, UpdateTaskInput } from '@life-os/shared'
import { prisma } from '../config/db.js'
import { ApiError } from '../middleware/errorHandler.js'
import {
  listTasks as repoListTasks,
  findTaskById,
  createTask as repoCreateTask,
  updateTask as repoUpdateTask,
  softDeleteTask,
} from '../repositories/taskRepository.js'

async function assertGoalOwnership(userId: string, goalId: string) {
  const goal = await prisma.goal.findFirst({ where: { id: goalId, userId } })
  if (!goal) {
    throw new ApiError(400, 'VALIDATION_ERROR', 'goalId does not belong to this user')
  }
}

export function listForUser(userId: string, query: ListTasksQuery) {
  return repoListTasks(userId, query)
}

export async function create(userId: string, input: CreateTaskInput) {
  if (input.goalId) {
    await assertGoalOwnership(userId, input.goalId)
  }
  return repoCreateTask(userId, input)
}

export async function update(userId: string, id: string, input: UpdateTaskInput) {
  const existing = await findTaskById(userId, id)
  if (!existing) {
    throw new ApiError(404, 'NOT_FOUND', 'Task not found')
  }
  if (input.goalId) {
    await assertGoalOwnership(userId, input.goalId)
  }
  return repoUpdateTask(id, input)
}

export async function remove(userId: string, id: string) {
  const existing = await findTaskById(userId, id)
  if (!existing) {
    throw new ApiError(404, 'NOT_FOUND', 'Task not found')
  }
  await softDeleteTask(id)
}

export async function getOne(userId: string, id: string) {
  const task = await findTaskById(userId, id)
  if (!task) {
    throw new ApiError(404, 'NOT_FOUND', 'Task not found')
  }
  return task
}
