import { prisma } from '../config/db.js'
import * as reviewRepo from '../repositories/weeklyReviewRepository.js'
import * as aiService from '../ai/service.js'
import * as memoryService from './memoryService.js'
import { weeklyReviewSystemPrompt, weeklyReviewUserPrompt } from '../ai/prompts.js'

function currentWeekStart(): Date {
  const now = new Date()
  const start = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  )
  start.setUTCDate(start.getUTCDate() - start.getUTCDay())
  return start
}

async function gatherWeekStats(userId: string, weekStart: Date) {
  const weekEnd = new Date(weekStart)
  weekEnd.setUTCDate(weekEnd.getUTCDate() + 7)

  const [tasksCompleted, tasksCreated, habits, goals, reflectionsLogged] =
    await Promise.all([
      prisma.task.count({
        where: {
          userId,
          status: 'DONE',
          deletedAt: null,
          updatedAt: { gte: weekStart, lt: weekEnd },
        },
      }),
      prisma.task.count({
        where: { userId, deletedAt: null, createdAt: { gte: weekStart, lt: weekEnd } },
      }),
      prisma.habit.findMany({
        where: { userId },
        include: { checkins: { where: { date: { gte: weekStart, lt: weekEnd } } } },
      }),
      prisma.goal.findMany({ where: { userId, deletedAt: null, progress: { lt: 100 } } }),
      prisma.reflection.count({
        where: { userId, createdAt: { gte: weekStart, lt: weekEnd } },
      }),
    ])

  const habitConsistency = habits.map((h) => {
    const expected = h.frequency === 'DAILY' ? 7 : 1
    return { title: h.title, ratio: Math.min(h.checkins.length / expected, 1) }
  })

  return {
    tasksCompleted,
    tasksCreated,
    habitConsistency,
    goals: goals.map((g) => ({ title: g.title, progress: g.progress })),
    reflectionsLogged,
  }
}

export function getCurrent(userId: string) {
  return reviewRepo.findByWeek(userId, currentWeekStart())
}

export function listPast(userId: string) {
  return reviewRepo.listPast(userId)
}

// Aggregates the week's real data, then asks the AI to narrate it — see
// Weekly Review.md Section 6. Regenerable: calling again overwrites this week's review.
export async function generate(userId: string) {
  const weekStart = currentWeekStart()
  const stats = await gatherWeekStats(userId, weekStart)

  try {
    const result = await aiService.generateJson<{
      summary: string
      wins: string[]
      focusAreas: string[]
      nextWeekPlan: string
    }>({
      userId,
      feature: 'weekly_review',
      system: weeklyReviewSystemPrompt(),
      messages: [{ role: 'user', content: weeklyReviewUserPrompt(stats) }],
      maxTokens: 800,
    })

    const review = await reviewRepo.upsertReview(userId, weekStart, {
      summary: result.summary,
      wins: result.wins,
      focusAreas: result.focusAreas,
      nextWeekPlan: result.nextWeekPlan,
    })

    void memoryService.storeSafely(
      userId,
      `Weekly review (${weekStart.toISOString().slice(0, 10)}): ${result.summary}`,
      'summary',
    )

    return review
  } catch (err) {
    // AI failure → show raw stats without narrative — Weekly Review.md, Section 12.
    console.error(
      'Weekly review generation failed:',
      err instanceof Error ? err.message : err,
    )
    const summary = `This week: ${stats.tasksCompleted} task(s) completed, ${stats.reflectionsLogged} reflection(s) logged.`
    return reviewRepo.upsertReview(userId, weekStart, {
      summary,
      wins: [],
      focusAreas: [],
      nextWeekPlan: null,
    })
  }
}
