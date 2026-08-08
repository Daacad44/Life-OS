import { z } from 'zod'
import { HabitFrequency } from './enums.js'

// Validation rules from docs/.../02-PRD/Habit System.md, Section 9.
const timeOfDay = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'timeOfDay must be HH:mm')

export const createHabitSchema = z.object({
  title: z.string().min(1).max(200),
  frequency: z.enum(HabitFrequency).default('DAILY'),
  // Wall-clock time of day to practice the habit; drives a daily/weekly reminder.
  timeOfDay: timeOfDay.nullable().optional(),
})
export type CreateHabitInput = z.infer<typeof createHabitSchema>

export const updateHabitSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  frequency: z.enum(HabitFrequency).optional(),
  timeOfDay: timeOfDay.nullable().optional(),
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
  timeOfDay: string | null
  createdAt: string
  updatedAt: string
  checkins: HabitCheckin[]
}
