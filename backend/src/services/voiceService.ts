import type { VoiceCommandResult } from '@life-os/shared'
import * as taskRepo from '../repositories/taskRepository.js'
import * as dashboardService from './dashboardService.js'
import * as memoryService from './memoryService.js'
import * as aiService from '../ai/service.js'
import {
  coachSystemPrompt,
  formatCoachContext,
  voiceIntentSystemPrompt,
  voiceIntentUserPrompt,
} from '../ai/prompts.js'
import { logger } from '../config/logger.js'

const FALLBACK: VoiceCommandResult = {
  intent: 'unclear',
  response: "I'm having trouble understanding right now — please try again in a moment.",
  actionTaken: null,
}

// No speech-to-text provider is configured (Claude has no audio input, and no
// dedicated STT key exists) — transcription happens client-side via the browser's
// Web Speech API. This only interprets the resulting text. See Voice Assistant.md.
export async function handleCommand(
  userId: string,
  text: string,
): Promise<VoiceCommandResult> {
  let classification: {
    intent: string
    taskTitle: string | null
    question: string | null
  }
  try {
    classification = await aiService.generateJson({
      userId,
      feature: 'voice_command',
      system: voiceIntentSystemPrompt(),
      messages: [{ role: 'user', content: voiceIntentUserPrompt(text) }],
      maxTokens: 300,
    })
  } catch (err) {
    logger.error({ err }, 'Voice intent classification failed')
    return FALLBACK
  }

  if (classification.intent === 'create_task') {
    const title = classification.taskTitle?.trim() || text
    await taskRepo.createTask(userId, { title })
    return {
      intent: 'create_task',
      response: `Added "${title}" to your tasks.`,
      actionTaken: `Created task: ${title}`,
    }
  }

  if (classification.intent === 'query_day') {
    const dashboard = await dashboardService.getDashboard(userId)
    const overdueClause =
      dashboard.overdueTasks.length > 0
        ? ` and ${dashboard.overdueTasks.length} overdue`
        : ''
    const streaking = dashboard.habits.filter((h) => h.streak > 0).length
    const response = `You have ${dashboard.todayTasks.length} task${dashboard.todayTasks.length === 1 ? '' : 's'} today${overdueClause}. ${dashboard.goals.length} active goal${dashboard.goals.length === 1 ? '' : 's'}, ${streaking} habit${streaking === 1 ? '' : 's'} on a streak.`
    return { intent: 'query_day', response, actionTaken: null }
  }

  if (classification.intent === 'ask_coach') {
    const question = classification.question?.trim() || text
    try {
      const [dashboard, memories] = await Promise.all([
        dashboardService.getDashboard(userId),
        memoryService.search(userId, question, 5),
      ])
      const system = `${coachSystemPrompt()}\n\n${formatCoachContext({ ...dashboard, memories })}`
      const response = await aiService.generateText({
        userId,
        feature: 'voice_command',
        system,
        messages: [{ role: 'user', content: question }],
        maxTokens: 300,
      })
      return { intent: 'ask_coach', response, actionTaken: null }
    } catch (err) {
      logger.error({ err }, 'Voice ask_coach failed')
      return FALLBACK
    }
  }

  return {
    intent: 'unclear',
    response: "I didn't quite catch that — could you rephrase?",
    actionTaken: null,
  }
}
