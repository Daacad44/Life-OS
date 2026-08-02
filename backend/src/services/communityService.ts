import type { CommunityPost, Connection, ShareGoalInput } from '@life-os/shared'
import { prisma } from '../config/db.js'
import { ApiError } from '../middleware/errorHandler.js'
import * as communityRepo from '../repositories/communityRepository.js'
import * as goalRepo from '../repositories/goalRepository.js'

async function assertOptedIn(userId: string) {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    select: { communityOptIn: true },
  })
  if (!user.communityOptIn) {
    throw new ApiError(403, 'COMMUNITY_OPT_OUT', 'Enable Community in Settings first')
  }
}

export async function getOptIn(userId: string): Promise<boolean> {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    select: { communityOptIn: true },
  })
  return user.communityOptIn
}

export async function setOptIn(userId: string, optIn: boolean): Promise<boolean> {
  await prisma.user.update({ where: { id: userId }, data: { communityOptIn: optIn } })
  return optIn
}

function toConnectionDTO(
  c: { id: string; userId: string; partnerId: string; status: string; createdAt: Date },
  viewerUserId: string,
  partner: { id: string; name: string | null; email: string },
): Connection {
  return {
    id: c.id,
    userId: c.userId,
    partnerId: c.partnerId,
    partnerName: partner.name,
    partnerEmail: partner.email,
    direction: c.userId === viewerUserId ? 'sent' : 'received',
    status: c.status as Connection['status'],
    createdAt: c.createdAt.toISOString(),
  }
}

export async function listConnections(userId: string): Promise<Connection[]> {
  await assertOptedIn(userId)
  const connections = await communityRepo.listConnectionsForUser(userId)
  const result: Connection[] = []
  for (const c of connections) {
    const partnerId = c.userId === userId ? c.partnerId : c.userId
    const partner = await communityRepo.findUserById(partnerId)
    if (partner) result.push(toConnectionDTO(c, userId, partner))
  }
  return result
}

// Explicit consent required on both sides — a request only becomes a real
// connection once the recipient accepts. See Community.md Section 9.
export async function connect(userId: string, partnerEmail: string): Promise<Connection> {
  await assertOptedIn(userId)
  const partner = await communityRepo.findUserByEmail(partnerEmail)
  if (!partner) {
    throw new ApiError(404, 'NOT_FOUND', 'No user found with that email')
  }
  if (partner.id === userId) {
    throw new ApiError(400, 'VALIDATION_ERROR', "You can't connect with yourself")
  }
  const existing = await communityRepo.findExistingConnection(userId, partner.id)
  if (existing) {
    throw new ApiError(
      409,
      'ALREADY_EXISTS',
      'A connection already exists with this user',
    )
  }
  const connection = await communityRepo.createConnection(userId, partner.id)
  return toConnectionDTO(connection, userId, partner)
}

export async function respondToConnection(
  userId: string,
  id: string,
  status: 'ACCEPTED' | 'DECLINED',
): Promise<Connection> {
  await assertOptedIn(userId)
  const connection = await communityRepo.findConnectionById(id)
  if (!connection || connection.partnerId !== userId) {
    throw new ApiError(404, 'NOT_FOUND', 'Connection request not found')
  }
  const updated = await communityRepo.updateConnectionStatus(id, status)
  const partner = await communityRepo.findUserById(connection.userId)
  if (!partner) {
    throw new ApiError(404, 'NOT_FOUND', 'Requester not found')
  }
  return toConnectionDTO(updated, userId, partner)
}

export async function shareGoal(
  userId: string,
  input: ShareGoalInput,
): Promise<CommunityPost> {
  await assertOptedIn(userId)
  const goal = await goalRepo.findGoalById(userId, input.goalId)
  if (!goal) {
    throw new ApiError(404, 'NOT_FOUND', 'Goal not found')
  }
  await communityRepo.upsertSharedGoal(goal.id, userId, input.visibility)
  const content =
    input.message?.trim() || `Sharing progress on "${goal.title}": ${goal.progress}%`
  const post = await communityRepo.createPost(userId, content, goal.id)
  return {
    id: post.id,
    userId,
    authorName: null,
    content: post.content,
    sharedGoalId: goal.id,
    createdAt: post.createdAt.toISOString(),
  }
}

export async function getFeed(userId: string): Promise<CommunityPost[]> {
  await assertOptedIn(userId)
  const partnerIds = await communityRepo.listAcceptedPartnerIds(userId)
  const posts = await communityRepo.listFeedPosts([userId, ...partnerIds])
  return posts.map((p) => ({
    id: p.id,
    userId: p.userId,
    authorName: p.user.name ?? p.user.email,
    content: p.content,
    sharedGoalId: p.sharedGoalId,
    createdAt: p.createdAt.toISOString(),
  }))
}

export async function reportPost(userId: string, id: string): Promise<void> {
  await assertOptedIn(userId)
  const post = await communityRepo.findPostById(id)
  if (!post) {
    throw new ApiError(404, 'NOT_FOUND', 'Post not found')
  }
  // A report hides the post from everyone's feed, not just the reporter's —
  // only allow it for posts actually visible to this user (their own, or from
  // an accepted connection), so it can't be used to grief an unrelated user's
  // post by guessing its id.
  if (post.userId !== userId) {
    const partnerIds = await communityRepo.listAcceptedPartnerIds(userId)
    if (!partnerIds.includes(post.userId)) {
      throw new ApiError(404, 'NOT_FOUND', 'Post not found')
    }
  }
  await communityRepo.reportPost(id)
}
