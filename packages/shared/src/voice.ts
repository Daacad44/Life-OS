import { z } from 'zod'

export const sendVoiceCommandSchema = z.object({
  text: z.string().min(1).max(2000),
})
export type SendVoiceCommandInput = z.infer<typeof sendVoiceCommandSchema>

export const VoiceIntent = ['create_task', 'ask_coach', 'query_day', 'unclear'] as const
export type VoiceIntent = (typeof VoiceIntent)[number]

export interface VoiceCommandResult {
  intent: VoiceIntent
  response: string
  actionTaken: string | null
}
