import { prisma } from '../config/db.js'

export function listCareerGoals(userId: string) {
  return prisma.careerGoal.findMany({
    where: { userId, deletedAt: null },
    orderBy: { createdAt: 'desc' },
  })
}

export function findCareerGoalById(userId: string, id: string) {
  return prisma.careerGoal.findFirst({ where: { id, userId, deletedAt: null } })
}

export function createCareerGoal(
  userId: string,
  data: { title: string; targetRole?: string; description?: string },
) {
  return prisma.careerGoal.create({ data: { ...data, userId } })
}

export function listSkills(userId: string) {
  return prisma.skill.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } })
}

export function createSkill(userId: string, name: string, level: number) {
  return prisma.skill.create({ data: { userId, name, level } })
}

export function listMilestones(userId: string) {
  return prisma.milestone.findMany({ where: { userId }, orderBy: { createdAt: 'asc' } })
}

export function findMilestoneById(userId: string, id: string) {
  return prisma.milestone.findFirst({ where: { id, userId } })
}

export function createMilestone(
  userId: string,
  title: string,
  careerGoalId: string | null,
) {
  return prisma.milestone.create({ data: { userId, title, careerGoalId } })
}

export function updateMilestone(id: string, done: boolean) {
  return prisma.milestone.update({ where: { id }, data: { done } })
}

export function softDeleteCareerGoal(id: string) {
  return prisma.careerGoal.update({ where: { id }, data: { deletedAt: new Date() } })
}

export function findSkillById(userId: string, id: string) {
  return prisma.skill.findFirst({ where: { id, userId } })
}

export function deleteSkill(id: string) {
  return prisma.skill.delete({ where: { id } })
}

export function deleteMilestone(id: string) {
  return prisma.milestone.delete({ where: { id } })
}
