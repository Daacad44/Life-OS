import { prisma } from '../config/db.js'

export function recordUsage(
  userId: string,
  feature: string,
  inputTokens: number,
  outputTokens: number,
) {
  return prisma.aiUsageLog.create({
    data: { userId, feature, inputTokens, outputTokens },
  })
}
