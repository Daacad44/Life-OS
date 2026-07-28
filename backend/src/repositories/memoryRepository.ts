import { randomUUID } from 'node:crypto'
import { prisma } from '../config/db.js'

export interface MemoryItemRow {
  id: string
  userId: string
  content: string
  type: string
  createdAt: Date
}

function toVectorLiteral(embedding: number[]): string {
  return `[${embedding.join(',')}]`
}

// Prisma Client excludes `Unsupported("vector")` columns from its generated API,
// so writing/reading the embedding itself goes through raw SQL.
export async function insertMemory(
  userId: string,
  content: string,
  type: string,
  embedding: number[],
): Promise<MemoryItemRow> {
  const id = randomUUID()
  const rows = await prisma.$queryRaw<MemoryItemRow[]>`
    INSERT INTO "MemoryItem" (id, "userId", content, type, embedding, "createdAt")
    VALUES (${id}, ${userId}, ${content}, ${type}, ${toVectorLiteral(embedding)}::vector, now())
    RETURNING id, "userId", content, type, "createdAt"
  `
  return rows[0]!
}

export function listMemories(userId: string) {
  return prisma.memoryItem.findMany({
    where: { userId },
    select: { id: true, userId: true, content: true, type: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
  })
}

export function findMemoryById(userId: string, id: string) {
  return prisma.memoryItem.findFirst({
    where: { id, userId },
    select: { id: true, userId: true, content: true, type: true, createdAt: true },
  })
}

export function deleteMemory(id: string) {
  return prisma.memoryItem.delete({ where: { id } })
}

export async function searchMemories(
  userId: string,
  embedding: number[],
  topK: number,
): Promise<MemoryItemRow[]> {
  const vector = toVectorLiteral(embedding)
  return prisma.$queryRaw<MemoryItemRow[]>`
    SELECT id, "userId", content, type, "createdAt"
    FROM "MemoryItem"
    WHERE "userId" = ${userId} AND embedding IS NOT NULL
    ORDER BY embedding <=> ${vector}::vector ASC
    LIMIT ${topK}
  `
}
