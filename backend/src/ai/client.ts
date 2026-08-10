import { GoogleGenAI } from '@google/genai'
import { env } from '../config/env.js'
import { ApiError } from '../middleware/errorHandler.js'

// Main chat/completions model and embedding model — configured via env so a provider
// or model swap needs no code edit (AI Architecture.md Section 3).
export const AI_MODEL = env.GEMINI_MODEL
export const EMBEDDING_MODEL = env.GEMINI_EMBEDDING_MODEL
export const EMBEDDING_DIM = env.GEMINI_EMBEDDING_DIM

let client: GoogleGenAI | null = null

// Lazy singleton — AI Architecture.md principle 1: "the app works with AI switched off."
// Feature code must still exist and degrade gracefully if no key is configured.
export function getClient(): GoogleGenAI {
  if (!env.GEMINI_API_KEY) {
    throw new ApiError(503, 'AI_UNAVAILABLE', 'AI features are not configured')
  }
  if (!client) {
    client = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY })
  }
  return client
}
