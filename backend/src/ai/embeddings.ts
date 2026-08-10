import { ApiError as GenAIError } from '@google/genai'
import { getClient, EMBEDDING_MODEL, EMBEDDING_DIM } from './client.js'
import { env } from '../config/env.js'
import { ApiError } from '../middleware/errorHandler.js'
import { logger } from '../config/logger.js'

// L2-normalize so cosine search behaves consistently. Gemini pre-normalizes only its
// full-width (3072-dim) output; any reduced dimension must be normalized by us.
function normalize(values: number[]): number[] {
  let sum = 0
  for (const v of values) sum += v * v
  const norm = Math.sqrt(sum)
  return norm > 0 ? values.map((v) => v / norm) : values
}

// AI memory embeddings. The output dimension must match MemoryItem.embedding's
// vector() width — configured together via GEMINI_EMBEDDING_DIM (see schema.prisma).
export async function embed(text: string): Promise<number[]> {
  if (!env.GEMINI_API_KEY) {
    throw new ApiError(503, 'AI_UNAVAILABLE', 'Embeddings are not configured')
  }

  try {
    const client = getClient()
    const res = await client.models.embedContent({
      model: EMBEDDING_MODEL,
      contents: [{ parts: [{ text }] }],
      config: {
        outputDimensionality: EMBEDDING_DIM,
        taskType: 'RETRIEVAL_DOCUMENT',
      },
    })

    const values = res.embeddings?.[0]?.values
    if (!values || values.length === 0) {
      throw new ApiError(502, 'AI_EMBEDDING_ERROR', 'Embedding response was empty')
    }
    return normalize(values)
  } catch (err) {
    if (err instanceof ApiError) throw err
    if (err instanceof GenAIError) {
      logger.error({ status: err.status, err }, 'Gemini embedding request failed')
    } else {
      logger.error({ err }, 'Gemini embedding request failed')
    }
    throw new ApiError(502, 'AI_EMBEDDING_ERROR', 'Failed to generate embedding')
  }
}
