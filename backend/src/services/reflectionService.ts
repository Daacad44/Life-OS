import type { CreateReflectionInput, ReflectionPeriod } from '@life-os/shared'
import * as reflectionRepo from '../repositories/reflectionRepository.js'
import * as dashboardService from './dashboardService.js'
import * as memoryService from './memoryService.js'
import * as gamificationService from './gamificationService.js'
import * as aiService from '../ai/service.js'
import {
  reflectionInsightSystemPrompt,
  reflectionInsightUserPrompt,
  reflectionPromptSystemPrompt,
  reflectionPromptUserPrompt,
} from '../ai/prompts.js'

// Shown if AI prompt generation fails — see Reflection.md Section 12 (Edge Cases).
const FALLBACK_PROMPTS: Record<ReflectionPeriod, string> = {
  daily: 'What went well today, and what would you like to do differently tomorrow?',
  weekly:
    'Looking back at this week, what are you proud of — and what do you want to focus on next week?',
}

export function listForUser(userId: string) {
  return reflectionRepo.listReflections(userId)
}

export async function getPrompt(
  userId: string,
  period: ReflectionPeriod,
): Promise<{ prompt: string }> {
  try {
    const dashboard = await dashboardService.getDashboard(userId)
    const tasksDone = dashboard.todayTasks.filter((t) => t.status === 'DONE').length

    const prompt = await aiService.generateText({
      userId,
      feature: 'reflection',
      system: reflectionPromptSystemPrompt(period),
      messages: [
        {
          role: 'user',
          content: reflectionPromptUserPrompt({
            tasksDone,
            totalTasks: dashboard.todayTasks.length,
            goalsInProgress: dashboard.goals.filter((g) => g.progress < 100).length,
            habitsOnStreak: dashboard.habits.filter((h) => h.streak > 0).length,
          }),
        },
      ],
      maxTokens: 150,
    })

    return { prompt: prompt.trim() || FALLBACK_PROMPTS[period] }
  } catch (err) {
    console.error(
      'Reflection prompt generation failed, using fallback:',
      err instanceof Error ? err.message : err,
    )
    return { prompt: FALLBACK_PROMPTS[period] }
  }
}

// Saves the reflection, then extracts supportive insights + durable memory facts.
// Insight generation is best-effort — the reflection itself always saves.
export async function create(userId: string, input: CreateReflectionInput) {
  const reflection = await reflectionRepo.createReflection(userId, input)
  void gamificationService.award(userId, 'reflection_logged')

  try {
    const result = await aiService.generateJson<{
      insights: string
      memoryFacts: string[]
    }>({
      userId,
      feature: 'reflection',
      system: reflectionInsightSystemPrompt(),
      messages: [
        {
          role: 'user',
          content: reflectionInsightUserPrompt(input.prompt, input.content),
        },
      ],
      maxTokens: 500,
    })
    await reflectionRepo.updateReflectionInsights(reflection.id, result.insights)
    for (const fact of result.memoryFacts.slice(0, 3)) {
      await memoryService.storeSafely(userId, fact, 'summary')
    }
    return { ...reflection, insights: result.insights }
  } catch (err) {
    console.error(
      'Reflection insight generation failed:',
      err instanceof Error ? err.message : err,
    )
    return reflection
  }
}
