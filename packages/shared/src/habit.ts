import { z } from 'zod'
import { HabitFrequency } from './enums.js'

// Validation rules from docs/.../02-PRD/Habit System.md, Section 9.
export const createHabitSchema = z.object({
  title: z.string().min(1).max(200),
  frequency: z.enum(HabitFrequency).default('DAILY'),
})
export type CreateHabitInput = z.infer<typeof createHabitSchema>

export const updateHabitSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  frequency: z.enum(HabitFrequency).optional(),
})
export type UpdateHabitInput = z.infer<typeof updateHabitSchema>

export interface HabitCheckin {
  id: string
  habitId: string
  date: string
  done: boolean
}

export interface Habit {
  id: string
  userId: string
  title: string
  frequency: HabitFrequency
  streak: number
  createdAt: string
  updatedAt: string
  checkins: HabitCheckin[]
}
