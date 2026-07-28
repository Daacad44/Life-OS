import type { AnalyticsOverview, AnalyticsRange } from '@life-os/shared'
import { prisma } from '../config/db.js'
import * as aiService from '../ai/service.js'
import {
  analyticsInsightsSystemPrompt,
  analyticsInsightsUserPrompt,
} from '../ai/prompts.js'

const RANGE_DAYS: Record<AnalyticsRange, number> = { week: 7, month: 30, year: 365 }

function rangeStart(range: AnalyticsRange): Date {
  const start = new Date()
  start.setDate(start.getDate() - RANGE_DAYS[range])
  return start
}

// Live-computed, no rollup tables — data volumes are small enough for direct
// aggregation at this stage (a simplification flagged for revisit at scale).
export async function getOverview(
  userId: string,
  range: AnalyticsRange,
): Promise<AnalyticsOverview> {
  const since = rangeStart(range)

  const [
    tasksCompleted,
    tasksCreated,
    habits,
    goals,
    notesCreated,
    focusSessions,
    reflectionsLogged,
  ] = await Promise.all([
    prisma.task.count({
      where: { userId, status: 'DONE', deletedAt: null, updatedAt: { gte: since } },
    }),
    prisma.task.count({ where: { userId, deletedAt: null, createdAt: { gte: since } } }),
    prisma.habit.findMany({
      where: { userId },
      include: { checkins: { where: { date: { gte: since } } } },
    }),
    prisma.goal.findMany({ where: { userId, deletedAt: null, progress: { lt: 100 } } }),
    prisma.note.count({ where: { userId, deletedAt: null, createdAt: { gte: since } } }),
    prisma.focusSession.findMany({
      where: { userId, startedAt: { gte: since }, duration: { not: null } },
      select: { duration: true },
    }),
    prisma.reflection.count({ where: { userId, createdAt: { gte: since } } }),
  ])

  const focusMinutes = Math.round(
    focusSessions.reduce((sum, s) => sum + (s.duration ?? 0), 0) / 60,
  )

  return {
    range,
    tasksCompleted,
    tasksCreated,
    taskCompletionRate: tasksCreated > 0 ? tasksCompleted / tasksCreated : 0,
    habits: habits.map((h) => ({
      title: h.title,
      checkins: h.checkins.length,
      expected:
        h.frequency === 'DAILY' ? RANGE_DAYS[range] : Math.ceil(RANGE_DAYS[range] / 7),
    })),
    goals: goals.map((g) => ({ title: g.title, progress: g.progress })),
    notesCreated,
    focusMinutes,
    focusSessions: focusSessions.length,
    reflectionsLogged,
  }
}

const HAS_ENOUGH_DATA = (o: AnalyticsOverview) =>
  o.tasksCreated + o.notesCreated + o.reflectionsLogged + o.focusSessions > 0

export async function getInsights(
  userId: string,
  range: AnalyticsRange,
): Promise<string[]> {
  const overview = await getOverview(userId, range)
  if (!HAS_ENOUGH_DATA(overview)) {
    return [
      'Not much tracked yet for this range — keep going and insights will show up here.',
    ]
  }

  try {
    const result = await aiService.generateJson<{ insights: string[] }>({
      userId,
      feature: 'analytics_insight',
      system: analyticsInsightsSystemPrompt(),
      messages: [{ role: 'user', content: analyticsInsightsUserPrompt(overview) }],
      maxTokens: 400,
    })
    return result.insights
  } catch (err) {
    console.error(
      'Analytics insight generation failed:',
      err instanceof Error ? err.message : err,
    )
    return []
  }
}
