import { z } from 'zod'

// Validation rules from docs/.../02-PRD/Second Brain.md, Section 9.
export const createNoteSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1).max(20000),
  tags: z.array(z.string().min(1).max(50)).max(20).default([]),
  folder: z.string().min(1).max(60).nullable().optional(),
})
export type CreateNoteInput = z.infer<typeof createNoteSchema>

export const updateNoteSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  content: z.string().min(1).max(20000).optional(),
  tags: z.array(z.string().min(1).max(50)).max(20).optional(),
  folder: z.string().min(1).max(60).nullable().optional(),
})
export type UpdateNoteInput = z.infer<typeof updateNoteSchema>

export const listNotesQuerySchema = z.object({
  tag: z.string().optional(),
  folder: z.string().optional(),
  // Free-text search across title + content.
  q: z.string().optional(),
})
export type ListNotesQuery = z.infer<typeof listNotesQuerySchema>

export interface Note {
  id: string
  userId: string
  title: string
  content: string
  tags: string[]
  folder: string | null
  createdAt: string
  updatedAt: string
}
