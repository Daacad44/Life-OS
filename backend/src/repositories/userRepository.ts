import { prisma } from '../config/db.js'
import type { Prisma } from '@prisma/client'

export function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } })
}

export function findUserById(id: string) {
  return prisma.user.findUnique({ where: { id } })
}

export function createUser(data: Prisma.UserCreateInput) {
  return prisma.user.create({ data })
}

export function updateUser(id: string, data: Prisma.UserUpdateInput) {
  return prisma.user.update({ where: { id }, data })
}
