import { z } from 'zod'

export const startFocusSessionSchema = z.object({
  taskId: z.string().uuid().optional(),
})
export type StartFocusSessionInput = z.infer<typeof startFocusSessionSchema>

export const endFocusSessionSchema = z.object({
  sessionId: z.string().uuid(),
})
export type EndFocusSessionInput = z.infer<typeof endFocusSessionSchema>

export interface FocusSession {
  id: string
  userId: string
  taskId: string | null
  startedAt: string
  endedAt: string | null
  duration: number | null
}
