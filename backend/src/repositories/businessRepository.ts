import type { Prisma } from '@prisma/client'
import { prisma } from '../config/db.js'

export function listProjects(userId: string) {
  return prisma.project.findMany({
    where: { userId, deletedAt: null },
    orderBy: { createdAt: 'desc' },
  })
}

export function findProjectById(userId: string, id: string) {
  return prisma.project.findFirst({ where: { id, userId, deletedAt: null } })
}

export function createProject(
  userId: string,
  data: Prisma.ProjectCreateWithoutUserInput,
) {
  return prisma.project.create({ data: { ...data, user: { connect: { id: userId } } } })
}

export function updateProject(id: string, data: Prisma.ProjectUncheckedUpdateInput) {
  return prisma.project.update({ where: { id }, data })
}

export function softDeleteProject(id: string) {
  return prisma.project.update({ where: { id }, data: { deletedAt: new Date() } })
}

export function findClientById(userId: string, id: string) {
  return prisma.client.findFirst({ where: { id, userId, deletedAt: null } })
}

export function softDeleteClient(id: string) {
  return prisma.client.update({ where: { id }, data: { deletedAt: new Date() } })
}

export function listClients(userId: string) {
  return prisma.client.findMany({
    where: { userId, deletedAt: null },
    orderBy: { createdAt: 'desc' },
  })
}

export function createClient(userId: string, name: string, details: string | null) {
  return prisma.client.create({ data: { userId, name, details } })
}
