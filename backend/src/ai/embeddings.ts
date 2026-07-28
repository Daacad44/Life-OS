import { env } from '../config/env.js'
import { ApiError } from '../middleware/errorHandler.js'

const VOYAGE_API_URL = 'https://api.voyageai.com/v1/embeddings'
// Best-effort default — verify the real output dimension against a live response once
// VOYAGE_API_KEY is set, and adjust MemoryItem.embedding's vector() width if it differs.
const VOYAGE_MODEL = 'voyage-3.5'

interface VoyageEmbeddingResponse {
  data: { embedding: number[]; index: number }[]
}

export async function embed(text: string): Promise<number[]> {
  if (!env.VOYAGE_API_KEY) {
    throw new ApiError(503, 'AI_UNAVAILABLE', 'Embeddings are not configured')
  }

  const res = await fetch(VOYAGE_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.VOYAGE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ input: [text], model: VOYAGE_MODEL, input_type: 'document' }),
  })

  if (!res.ok) {
    console.error('Voyage AI embedding request failed:', res.status, await res.text())
    throw new ApiError(502, 'AI_EMBEDDING_ERROR', 'Failed to generate embedding')
  }

  const body = (await res.json()) as VoyageEmbeddingResponse
  const embedding = body.data[0]?.embedding
  if (!embedding) {
    throw new ApiError(502, 'AI_EMBEDDING_ERROR', 'Embedding response was empty')
  }
  return embedding
}
