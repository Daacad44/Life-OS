import { Router } from 'express'
import { ApiError as GenAIError } from '@google/genai'
import { env } from '../config/env.js'
import { getClient, AI_MODEL, EMBEDDING_MODEL, EMBEDDING_DIM } from '../ai/client.js'

export const healthRouter = Router()

healthRouter.get('/', (_req, res) => {
  res.json({ success: true, data: { status: 'ok', uptime: process.uptime() } })
})

// TEMPORARY diagnostic — surfaces exactly what the running container sees for the AI
// provider, and the real error from a live Gemini call. The API key is masked (prefix +
// suffix + length only) so it is never exposed. Remove once the AI provider is verified.
healthRouter.get('/ai', async (_req, res) => {
  const key = env.GEMINI_API_KEY ?? ''
  const keyInfo = {
    present: key.length > 0,
    length: key.length,
    prefix: key.slice(0, 6),
    suffix: key.slice(-4),
    // Catch the classic paste mistakes:
    hasQuotes: key.includes('"') || key.includes("'"),
    hasWhitespace: /\s/.test(key),
  }
  const config = {
    model: AI_MODEL,
    embeddingModel: EMBEDDING_MODEL,
    embeddingDim: EMBEDDING_DIM,
  }

  let test: Record<string, unknown>
  try {
    const client = getClient()
    const started = Date.now()
    const r = await client.models.generateContent({
      model: AI_MODEL,
      contents: [{ role: 'user', parts: [{ text: 'reply with the single word OK' }] }],
      config: { maxOutputTokens: 10 },
    })
    test = { ok: true, ms: Date.now() - started, text: r.text ?? '' }
  } catch (err) {
    if (err instanceof GenAIError) {
      test = { ok: false, kind: 'gemini', status: err.status, message: err.message }
    } else {
      const e = err as { name?: string; message?: string; code?: string }
      test = {
        ok: false,
        kind: 'other',
        name: e.name,
        code: e.code,
        message: e.message ?? String(err),
      }
    }
  }

  res.json({ success: true, data: { keyInfo, config, test } })
})
