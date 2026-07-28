import Anthropic from '@anthropic-ai/sdk'
import { getClient, AI_MODEL } from './client.js'
import { enforceRateLimit } from './rateLimit.js'
import { recordUsage } from './usage.js'
import { ApiError } from '../middleware/errorHandler.js'

export interface CompletionRequest {
  userId: string
  feature: string
  system: string
  messages: Anthropic.MessageParam[]
  maxTokens?: number
  thinking?: boolean
}

function toApiError(err: unknown): ApiError {
  if (err instanceof ApiError) return err
  if (err instanceof Anthropic.APIError) {
    console.error('Anthropic API error:', err.status, err.message)
    return new ApiError(502, 'AI_ERROR', 'The AI service is temporarily unavailable')
  }
  console.error('Unexpected AI error:', err)
  return new ApiError(502, 'AI_ERROR', 'The AI service is temporarily unavailable')
}

// The single gateway to the Claude API — see AI Architecture.md Section 3.
// Every feature service calls through here, never the Anthropic SDK directly.
export async function generateText(req: CompletionRequest): Promise<string> {
  await enforceRateLimit(req.userId, req.feature)
  try {
    const client = getClient()
    const response = await client.messages.create({
      model: AI_MODEL,
      max_tokens: req.maxTokens ?? 2000,
      system: req.system,
      messages: req.messages,
      ...(req.thinking ? { thinking: { type: 'adaptive' as const } } : {}),
    })
    await recordUsage(
      req.userId,
      req.feature,
      response.usage.input_tokens,
      response.usage.output_tokens,
    )
    const textBlock = response.content.find(
      (b): b is Anthropic.TextBlock => b.type === 'text',
    )
    return textBlock?.text ?? ''
  } catch (err) {
    throw toApiError(err)
  }
}

// For features that need structured output (goal breakdown, habit insight, reflection).
export async function generateJson<T>(req: CompletionRequest): Promise<T> {
  const text = await generateText({
    ...req,
    system: `${req.system}\n\nRespond with ONLY valid JSON — no prose, no markdown code fences.`,
  })
  try {
    const cleaned = text
      .trim()
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/```\s*$/, '')
    return JSON.parse(cleaned) as T
  } catch {
    throw new ApiError(
      502,
      'AI_PARSE_ERROR',
      'The AI returned an unexpected response — please try again',
    )
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
    const stream = client.messages.stream({
      model: AI_MODEL,
      max_tokens: req.maxTokens ?? 4000,
      system: req.system,
      messages: req.messages,
      ...(req.thinking ? { thinking: { type: 'adaptive' as const } } : {}),
    })
    stream.on('text', onDelta)
    const finalMessage = await stream.finalMessage()
    await recordUsage(
      req.userId,
      req.feature,
      finalMessage.usage.input_tokens,
      finalMessage.usage.output_tokens,
    )
    const textBlock = finalMessage.content.find(
      (b): b is Anthropic.TextBlock => b.type === 'text',
    )
    return {
      text: textBlock?.text ?? '',
      inputTokens: finalMessage.usage.input_tokens,
      outputTokens: finalMessage.usage.output_tokens,
    }
  } catch (err) {
    throw toApiError(err)
  }
}
