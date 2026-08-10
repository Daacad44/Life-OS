import {
  ApiError as GenAIError,
  type Content,
  type GenerateContentConfig,
  type GenerateContentResponse,
} from '@google/genai'
import { getClient, AI_MODEL } from './client.js'
import { enforceRateLimit } from './rateLimit.js'
import { recordUsage } from './usage.js'
import { ApiError } from '../middleware/errorHandler.js'
import { logger } from '../config/logger.js'

// Provider-agnostic chat message — feature services speak this, never the SDK's types,
// so a future provider swap stays contained to the ai/ layer (AI Architecture.md §3).
export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface CompletionRequest {
  userId: string
  feature: string
  system: string
  messages: ChatMessage[]
  maxTokens?: number
  thinking?: boolean
}

function toApiError(err: unknown): ApiError {
  if (err instanceof ApiError) return err
  if (err instanceof GenAIError) {
    logger.error({ status: err.status, err }, 'Gemini API error')
    return new ApiError(502, 'AI_ERROR', 'The AI service is temporarily unavailable')
  }
  logger.error({ err }, 'Unexpected AI error')
  return new ApiError(502, 'AI_ERROR', 'The AI service is temporarily unavailable')
}

// Gemini uses 'user' / 'model' roles and a parts array; our features speak 'user' /
// 'assistant' with plain-string content. Translate at the boundary.
function toContents(messages: ChatMessage[]): Content[] {
  return messages.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }))
}

function buildConfig(req: CompletionRequest): GenerateContentConfig {
  return {
    systemInstruction: req.system,
    maxOutputTokens: req.maxTokens ?? 2000,
    // Preserves the prior "adaptive thinking" behavior: -1 lets the model size its own
    // thinking budget; 0 disables it for latency-sensitive, non-reasoning calls.
    thinkingConfig: { thinkingBudget: req.thinking ? -1 : 0 },
  }
}

function usageTokens(res: GenerateContentResponse): { input: number; output: number } {
  return {
    input: res.usageMetadata?.promptTokenCount ?? 0,
    output: res.usageMetadata?.candidatesTokenCount ?? 0,
  }
}

// The single gateway to the AI provider — see AI Architecture.md Section 3.
// Every feature service calls through here, never the provider SDK directly.
export async function generateText(req: CompletionRequest): Promise<string> {
  await enforceRateLimit(req.userId, req.feature)
  try {
    const client = getClient()
    const response = await client.models.generateContent({
      model: AI_MODEL,
      contents: toContents(req.messages),
      config: buildConfig(req),
    })
    const { input, output } = usageTokens(response)
    await recordUsage(req.userId, req.feature, input, output)
    return response.text ?? ''
  } catch (err) {
    throw toApiError(err)
  }
}

// For features that need structured output (goal breakdown, habit insight, reflection).
export async function generateJson<T>(req: CompletionRequest): Promise<T> {
  await enforceRateLimit(req.userId, req.feature)
  try {
    const client = getClient()
    const response = await client.models.generateContent({
      model: AI_MODEL,
      contents: toContents(req.messages),
      config: {
        ...buildConfig(req),
        // Ask the provider for JSON directly; the strict instruction + parse below stay
        // as a belt-and-suspenders guard, matching prior behavior.
        responseMimeType: 'application/json',
        systemInstruction: `${req.system}\n\nRespond with ONLY valid JSON — no prose, no markdown code fences.`,
      },
    })
    const { input, output } = usageTokens(response)
    await recordUsage(req.userId, req.feature, input, output)
    const text = response.text ?? ''
    const cleaned = text
      .trim()
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/```\s*$/, '')
    return JSON.parse(cleaned) as T
  } catch (err) {
    if (err instanceof SyntaxError) {
      throw new ApiError(
        502,
        'AI_PARSE_ERROR',
        'The AI returned an unexpected response — please try again',
      )
    }
    throw toApiError(err)
  }
}

export interface StreamResult {
  text: string
  inputTokens: number
  outputTokens: number
}

// For the Coach's streaming chat — writes deltas via onDelta as they arrive.
export async function streamText(
  req: CompletionRequest,
  onDelta: (text: string) => void,
): Promise<StreamResult> {
  await enforceRateLimit(req.userId, req.feature)
  try {
    const client = getClient()
    const stream = await client.models.generateContentStream({
      model: AI_MODEL,
      contents: toContents(req.messages),
      config: buildConfig(req),
    })

    let text = ''
    let inputTokens = 0
    let outputTokens = 0
    for await (const chunk of stream) {
      const delta = chunk.text
      if (delta) {
        text += delta
        onDelta(delta)
      }
      // usageMetadata is cumulative and arrives on the final chunks — keep the latest.
      if (chunk.usageMetadata) {
        inputTokens = chunk.usageMetadata.promptTokenCount ?? inputTokens
        outputTokens = chunk.usageMetadata.candidatesTokenCount ?? outputTokens
      }
    }

    await recordUsage(req.userId, req.feature, inputTokens, outputTokens)
    return { text, inputTokens, outputTokens }
  } catch (err) {
    throw toApiError(err)
  }
}
