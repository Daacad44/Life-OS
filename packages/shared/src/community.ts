import { z } from 'zod'

export const ConnectionStatus = ['PENDING', 'ACCEPTED', 'DECLINED'] as const
export type ConnectionStatus = (typeof ConnectionStatus)[number]

export const ShareVisibility = ['PRIVATE', 'PARTNERS', 'PUBLIC'] as const
export type ShareVisibility = (typeof ShareVisibility)[number]

export const connectSchema = z.object({
  partnerEmail: z.string().email(),
})
export type ConnectInput = z.infer<typeof connectSchema>

export const respondToConnectionSchema = z.object({
  status: z.enum(['ACCEPTED', 'DECLINED']),
})
export type RespondToConnectionInput = z.infer<typeof respondToConnectionSchema>

export const shareGoalSchema = z.object({
  goalId: z.string().uuid(),
  visibility: z.enum(ShareVisibility).default('PARTNERS'),
  message: z.string().max(500).optional(),
})
export type ShareGoalInput = z.infer<typeof shareGoalSchema>

export const optInSchema = z.object({
  optIn: z.boolean(),
})
export type OptInInput = z.infer<typeof optInSchema>

export interface Connection {
  id: string
  userId: string
  partnerId: string
  partnerName: string | null
  partnerEmail: string
  direction: 'sent' | 'received'
  status: ConnectionStatus
  createdAt: string
}

export interface CommunityPost {
  id: string
  userId: string
  authorName: string | null
  content: string
  sharedGoalId: string | null
  createdAt: string
}
