import type { Prisma } from '@prisma/client'
import { prisma } from '../config/db.js'

export function listGoals(userId: string) {
  return prisma.goal.findMany({
    where: { userId, deletedAt: null },
    orderBy: { createdAt: 'desc' },
    include: { subGoals: true },
  })
}

export function findGoalById(userId: string, id: string) {
  return prisma.goal.findFirst({
    where: { id, userId, deletedAt: null },
    include: {
      subGoals: { orderBy: { createdAt: 'asc' } },
      tasks: { where: { deletedAt: null }, orderBy: { createdAt: 'desc' } },
    },
  })
}

export function createGoal(userId: string, data: Prisma.GoalCreateWithoutUserInput) {
  return prisma.goal.create({ data: { ...data, user: { connect: { id: userId } } } })
}

export function updateGoal(id: string, data: Prisma.GoalUpdateInput) {
  return prisma.goal.update({ where: { id }, data })
}

export async function softDeleteGoal(id: string) {
  // Unlink tasks rather than deleting them — see Goal Engine.md, Section 12.
  await prisma.task.updateMany({ where: { goalId: id }, data: { goalId: null } })
  await prisma.goal.update({ where: { id }, data: { deletedAt: new Date() } })
}

export function createSubGoal(goalId: string, title: string, dueDate?: Date | null) {
  return prisma.subGoal.create({ data: { goalId, title, dueDate: dueDate ?? null } })
}

export function findSubGoal(goalId: string, id: string) {
  return prisma.subGoal.findFirst({ where: { id, goalId } })
}

export function updateSubGoal(id: string, data: Prisma.SubGoalUpdateInput) {
  return prisma.subGoal.update({ where: { id }, data })
}

export function deleteSubGoal(id: string) {
  return prisma.subGoal.delete({ where: { id } })
}

export async function recomputeProgress(goalId: string) {
  const [subGoals, tasks] = await Promise.all([
    prisma.subGoal.findMany({ where: { goalId } }),
    prisma.task.findMany({ where: { goalId, deletedAt: null } }),
  ])

  let progress = 0
  if (subGoals.length > 0) {
    progress = Math.round((subGoals.filter((s) => s.done).length / subGoals.length) * 100)
  } else if (tasks.length > 0) {
    progress = Math.round(
      (tasks.filter((t) => t.status === 'DONE').length / tasks.length) * 100,
    )
  }

  await prisma.goal.update({ where: { id: goalId }, data: { progress } })
  return progress
}
