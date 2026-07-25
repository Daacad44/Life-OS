import { PrismaClient } from '@prisma/client'

// Single shared Prisma client — see docs/.../03-Architecture/Database.md
export const prisma = new PrismaClient()
