import { prisma } from '../config/db.js'

export function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
    select: { id: true, name: true, email: true },
  })
}

export function findUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, email: true },
  })
}

export function findExistingConnection(userId: string, partnerId: string) {
  return prisma.connection.findFirst({
    where: {
      OR: [
        { userId, partnerId },
        { userId: partnerId, partnerId: userId },
      ],
    },
  })
}

export function createConnection(userId: string, partnerId: string) {
  return prisma.connection.create({ data: { userId, partnerId } })
}

export function findConnectionById(id: string) {
  return prisma.connection.findUnique({ where: { id } })
}

export function updateConnectionStatus(id: string, status: 'ACCEPTED' | 'DECLINED') {
  return prisma.connection.update({ where: { id }, data: { status } })
}

export function listConnectionsForUser(userId: string) {
  return prisma.connection.findMany({
    where: { OR: [{ userId }, { partnerId: userId }] },
    orderBy: { createdAt: 'desc' },
  })
}

export async function listAcceptedPartnerIds(userId: string): Promise<string[]> {
  const connections = await prisma.connection.findMany({
    where: { status: 'ACCEPTED', OR: [{ userId }, { partnerId: userId }] },
  })
  return connections.map((c) => (c.userId === userId ? c.partnerId : c.userId))
}

export function upsertSharedGoal(
  goalId: string,
  userId: string,
  visibility: 'PRIVATE' | 'PARTNERS' | 'PUBLIC',
) {
  return prisma.sharedGoal.upsert({
    where: { goalId },
    create: { goalId, userId, visibility },
    update: { visibility },
  })
}

export function createPost(userId: string, content: string, sharedGoalId: string | null) {
  return prisma.communityPost.create({ data: { userId, content, sharedGoalId } })
}

export function listFeedPosts(userIds: string[]) {
  return prisma.communityPost.findMany({
    where: { userId: { in: userIds }, reported: false },
    orderBy: { createdAt: 'desc' },
    take: 50,
    include: { user: { select: { name: true, email: true } } },
  })
}

export function findPostById(id: string) {
  return prisma.communityPost.findUnique({ where: { id } })
}

export function reportPost(id: string) {
  return prisma.communityPost.update({ where: { id }, data: { reported: true } })
}
