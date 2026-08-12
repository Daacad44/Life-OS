import type {
  CreateHealthLogInput,
  HealthLog,
  HealthTrend,
  HealthTrendsResponse,
  UpdateHealthLogInput,
} from '@life-os/shared'
import { ApiError } from '../middleware/errorHandler.js'
import * as healthRepo from '../repositories/healthRepository.js'
import * as aiService from '../ai/service.js'
import { healthInsightsSystemPrompt, healthInsightsUserPrompt } from '../ai/prompts.js'
import { logger } from '../config/logger.js'

function toDTO(log: {
  id: string
  userId: string
  type: string
  value: number
  date: Date
  createdAt: Date
}): HealthLog {
  return {
    id: log.id,
    userId: log.userId,
    type: log.type as HealthLog['type'],
    value: log.value,
    date: log.date.toISOString(),
    createdAt: log.createdAt.toISOString(),
  }
}

export async function listForUser(userId: string): Promise<HealthLog[]> {
  const rows = await healthRepo.listLogs(userId)
  return rows.map(toDTO)
}

export async function create(
  userId: string,
  input: CreateHealthLogInput,
): Promise<HealthLog> {
  const log = await healthRepo.createLog(userId, input.type, input.value, input.date)
  return toDTO(log)
}

async function getOwned(userId: string, id: string) {
  const log = await healthRepo.findLogById(userId, id)
  if (!log) {
    throw new ApiError(404, 'NOT_FOUND', 'Health log not found')
  }
  return log
}

export async function update(
  userId: string,
  id: string,
  input: UpdateHealthLogInput,
): Promise<HealthLog> {
  await getOwned(userId, id)
  const log = await healthRepo.updateLog(id, { value: input.value, date: input.date })
  return toDTO(log)
}

export async function remove(userId: string, id: string): Promise<void> {
  await getOwned(userId, id)
  await healthRepo.deleteLog(id)
}

// Charts alone don't answer "is this a pattern?" — the AI insight closes that gap,
// staying strictly non-medical. See Health.md Section 6.
export async function getTrends(
  userId: string,
  range: 'week' | 'month',
): Promise<HealthTrendsResponse> {
  const since = new Date()
  since.setDate(since.getDate() - (range === 'week' ? 7 : 30))

  const logs = await healthRepo.listLogs(userId, since)
  const rows = logs.map(toDTO)

  const trends: HealthTrend[] = (
    ['SLEEP', 'WATER', 'EXERCISE', 'MOOD', 'WEIGHT'] as const
  ).map((type) => ({
    type,
    points: rows
      .filter((l) => l.type === type)
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((l) => ({ date: l.date.slice(0, 10), value: l.value })),
  }))

  const hasData = trends.some((t) => t.points.length > 0)
  if (!hasData) {
    return { trends, insights: [] }
  }

  try {
    const result = await aiService.generateJson<{ insights: string[] }>({
      userId,
      feature: 'health_insight',
      system: healthInsightsSystemPrompt(),
      messages: [{ role: 'user', content: healthInsightsUserPrompt(trends) }],
      maxTokens: 400,
    })
    return { trends, insights: result.insights }
  } catch (err) {
    logger.error({ err }, 'Health insight generation failed')
    return { trends, insights: [] }
  }
}
