import type Anthropic from '@anthropic-ai/sdk'
import * as coachRepo from '../repositories/coachRepository.js'
import * as dashboardService from './dashboardService.js'
import * as memoryService from './memoryService.js'
import * as aiService from '../ai/service.js'
import { ApiError } from '../middleware/errorHandler.js'
import {
  coachSystemPrompt,
  formatCoachContext,
  memoryExtractionSystemPrompt,
  memoryExtractionUserPrompt,
} from '../ai/prompts.js'

const CONVERSATION_HISTORY_LIMIT = 20
const DISPLAY_HISTORY_LIMIT = 50

// Shown if the AI call fails after the user's message was already saved — see
// AI Coach.md Section 12 (Edge Cases): "AI failure → graceful fallback message."
const FALLBACK_REPLY =
  "Sorry, I'm having trouble responding right now. Please try again in a moment."

export function getHistory(userId: string) {
  return coachRepo.listRecentMessages(userId, DISPLAY_HISTORY_LIMIT)
}

// Assembles RAG context (structured data + memory), streams the Coach's reply, then
// persists both sides of the exchange and extracts new durable memory in the background.
// See AI Architecture.md Section 6 (Retrieval Flow) and AI Coach.md Section 6.
export async function sendMessage(
  userId: string,
  message: string,
  onDelta: (text: string) => void,
): Promise<string> {
  const [dashboard, memories, history] = await Promise.all([
    dashboardService.getDashboard(userId),
    memoryService.search(userId, message, 5),
    coachRepo.listRecentMessages(userId, CONVERSATION_HISTORY_LIMIT),
  ])

  const system = `${coachSystemPrompt()}\n\n${formatCoachContext({ ...dashboard, memories })}`

  const messages: Anthropic.MessageParam[] = [
    ...history.map((m) => ({
      role: (m.role === 'USER' ? 'user' : 'assistant') as 'user' | 'assistant',
      content: m.content,
    })),
    { role: 'user', content: message },
  ]

  await coachRepo.createMessage(userId, 'USER', message)

  let result: aiService.StreamResult
  try {
    result = await aiService.streamText(
      { userId, feature: 'coach', system, messages, thinking: true, maxTokens: 2000 },
      onDelta,
    )
  } catch (err) {
    // Rate limits are a real signal to surface, not something to paper over.
    if (err instanceof ApiError && err.status === 429) throw err

    console.error(
      'Coach AI call failed, using fallback:',
      err instanceof Error ? err.message : err,
    )
    onDelta(FALLBACK_REPLY)
    await coachRepo.createMessage(userId, 'ASSISTANT', FALLBACK_REPLY)
    return FALLBACK_REPLY
  }

  await coachRepo.createMessage(userId, 'ASSISTANT', result.text)

  void extractMemory(userId, message, result.text)

  return result.text
}

async function extractMemory(
  userId: string,
  userMessage: string,
  assistantReply: string,
) {
  try {
    const result = await aiService.generateJson<{ facts: string[] }>({
      userId,
      feature: 'memory_extract',
      system: memoryExtractionSystemPrompt(),
      messages: [
        {
          role: 'user',
          content: memoryExtractionUserPrompt(userMessage, assistantReply),
        },
      ],
      maxTokens: 500,
    })
    for (const fact of result.facts.slice(0, 3)) {
      await memoryService.storeSafely(userId, fact, 'fact')
    }
  } catch (err) {
    console.error(
      'Coach memory extraction failed:',
      err instanceof Error ? err.message : err,
    )
  }
}
