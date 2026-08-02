import { prisma } from '../config/db.js'

export function listSubjects(userId: string) {
  return prisma.subject.findMany({
    where: { userId, deletedAt: null },
    orderBy: { createdAt: 'desc' },
    include: { studySessions: { orderBy: { scheduledAt: 'asc' } } },
  })
}

export function findSubjectById(userId: string, id: string) {
  return prisma.subject.findFirst({
    where: { id, userId, deletedAt: null },
    include: { studySessions: { orderBy: { scheduledAt: 'asc' } } },
  })
}

export function createSubject(userId: string, title: string) {
  return prisma.subject.create({ data: { userId, title } })
}

export function createSession(
  userId: string,
  subjectId: string,
  topic: string | null,
  scheduledAt: Date,
) {
  return prisma.studySession.create({ data: { userId, subjectId, topic, scheduledAt } })
}

export function findSessionById(userId: string, id: string) {
  return prisma.studySession.findFirst({ where: { id, userId } })
}

export function updateSession(id: string, done: boolean) {
  return prisma.studySession.update({ where: { id }, data: { done } })
}

export async function recomputeProgress(subjectId: string) {
  const sessions = await prisma.studySession.findMany({ where: { subjectId } })
  const progress =
    sessions.length > 0
      ? Math.round((sessions.filter((s) => s.done).length / sessions.length) * 100)
      : 0
  await prisma.subject.update({ where: { id: subjectId }, data: { progress } })
}
