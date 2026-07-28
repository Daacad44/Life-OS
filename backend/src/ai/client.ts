import Anthropic from '@anthropic-ai/sdk'
import { env } from '../config/env.js'
import { ApiError } from '../middleware/errorHandler.js'

export const AI_MODEL = 'claude-opus-5'

let client: Anthropic | null = null

// Lazy singleton — AI Architecture.md principle 1: "the app works with AI switched off."
// Feature code must still exist and degrade gracefully if no key is configured.
export function getClient(): Anthropic {
  if (!env.CLAUDE_API_KEY) {
    throw new ApiError(503, 'AI_UNAVAILABLE', 'AI features are not configured')
  }
  if (!client) {
    client = new Anthropic({ apiKey: env.CLAUDE_API_KEY })
  }
  return client
}
