import { z } from 'zod'

export const MemoryType = ['fact', 'preference', 'event', 'summary'] as const
export type MemoryType = (typeof MemoryType)[number]

export const createMemorySchema = z.object({
  content: z.string().min(1).max(2000),
  type: z.enum(MemoryType).default('fact'),
})
export type CreateMemoryInput = z.infer<typeof createMemorySchema>

export const searchMemorySchema = z.object({
  query: z.string().min(1).max(500),
  topK: z.number().int().min(1).max(20).default(5),
})
export type SearchMemoryInput = z.infer<typeof searchMemorySchema>

export interface MemoryItem {
  id: string
  userId: string
  content: string
  type: string
  createdAt: string
}
