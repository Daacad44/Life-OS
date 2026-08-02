import type { Recommendation } from '@life-os/shared'
import { ApiError } from '../middleware/errorHandler.js'
import * as recommendationRepo from '../repositories/recommendationRepository.js'
import * as dashboardService from './dashboardService.js'
import * as memoryService from './memoryService.js'
import * as aiService from '../ai/service.js'
import { recommendationsSystemPrompt, recommendationsUserPrompt } from '../ai/prompts.js'

const MIN_ACTIVE = 2

function toDTO(r: {
  id: string
  userId: string
  type: string
  content: string
  status: string
  createdAt: Date
}): Recommendation {
  return {
    ...r,
    status: r.status as Recommendation['status'],
    createdAt: r.createdAt.toISOString(),
  }
}

// Lazily tops up the active list — there's no scheduler to generate these
// proactively, so a GET triggers generation when the pool runs low. See
// Smart Recommendations.md's "occasional" cadence and silent-on-failure edge case.
export async function listForUser(userId: string): Promise<Recommendation[]> {
  let active = await recommendationRepo.listActive(userId)
  if (active.length < MIN_ACTIVE) {
    await generateMore(userId)
    active = await recommendationRepo.listActive(userId)
  }
  return active.map(toDTO)
}

async function generateMore(userId: string): Promise<void> {
  try {
    const [dashboard, memories] = await Promise.all([
      dashboardService.getDashboard(userId),
      memoryService.search(userId, 'goals habits productivity patterns', 5),
    ])

    const result = await aiService.generateJson<{
      recommendations: { type: string; content: string }[]
    }>({
      userId,
      feature: 'recommendations',
      system: recommendationsSystemPrompt(),
      messages: [
        {
          role: 'user',
          content: recommendationsUserPrompt({
            todayTasks: dashboard.todayTasks.length,
            overdueTasks: dashboard.overdueTasks.length,
            goals: dashboard.goals.map((g) => ({ title: g.title, progress: g.progress })),
            habits: dashboard.habits.map((h) => ({ title: h.title, streak: h.streak })),
            memories: memories.map((m) => m.content),
          }),
        },
      ],
      maxTokens: 500,
    })

    for (const rec of result.recommendations.slice(0, 3)) {
      await recommendationRepo.create(userId, rec.type, rec.content)
    }
  } catch (err) {
    // Silent on failure — see Smart Recommendations.md Section 12.
    console.error(
      'Recommendation generation failed:',
      err instanceof Error ? err.message : err,
    )
  }
}

export async function accept(userId: string, id: string): Promise<Recommendation> {
  const existing = await recommendationRepo.findById(userId, id)
  if (!existing) {
    throw new ApiError(404, 'NOT_FOUND', 'Recommendation not found')
  }
  const rec = await recommendationRepo.updateStatus(id, 'ACCEPTED')
  return toDTO(rec)
}

export async function dismiss(userId: string, id: string): Promise<Recommendation> {
  const existing = await recommendationRepo.findById(userId, id)
  if (!existing) {
    throw new ApiError(404, 'NOT_FOUND', 'Recommendation not found')
  }
  const rec = await recommendationRepo.updateStatus(id, 'DISMISSED')
  return toDTO(rec)
}
