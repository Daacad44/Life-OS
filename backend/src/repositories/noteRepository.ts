import type { Prisma } from '@prisma/client'
import type { ListNotesQuery } from '@life-os/shared'
import { prisma } from '../config/db.js'

function whereFor(userId: string, query: ListNotesQuery): Prisma.NoteWhereInput {
  return {
    userId,
    deletedAt: null,
    ...(query.tag && { tags: { has: query.tag } }),
    ...(query.folder && { folder: query.folder }),
    ...(query.q && {
      OR: [
        { title: { contains: query.q, mode: 'insensitive' } },
        { content: { contains: query.q, mode: 'insensitive' } },
      ],
    }),
  }
}

export function listNotes(userId: string, query: ListNotesQuery) {
  return prisma.note.findMany({
    where: whereFor(userId, query),
    orderBy: { updatedAt: 'desc' },
  })
}

export function findNoteById(userId: string, id: string) {
  return prisma.note.findFirst({ where: { id, userId, deletedAt: null } })
}

export function createNote(
  userId: string,
  data: Omit<Prisma.NoteUncheckedCreateInput, 'userId'>,
) {
  return prisma.note.create({ data: { ...data, userId } })
}

export function updateNote(id: string, data: Prisma.NoteUncheckedUpdateInput) {
  return prisma.note.update({ where: { id }, data })
}

export function softDeleteNote(id: string) {
  return prisma.note.update({ where: { id }, data: { deletedAt: new Date() } })
}
