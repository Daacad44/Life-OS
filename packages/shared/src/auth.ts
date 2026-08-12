import { z } from 'zod'

export const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(72),
  name: z.string().min(1).max(100).optional(),
})
export type SignupInput = z.infer<typeof signupSchema>

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})
export type LoginInput = z.infer<typeof loginSchema>

// AI response language — the language every AI feature replies in.
export const Language = ['en', 'so'] as const
export type Language = (typeof Language)[number]

export const updateProfileSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  timezone: z.string().min(1).optional(),
  language: z.enum(Language).optional(),
  // Quiet hours: hour-of-day [0,23] in the user's timezone during which
  // reminders are held back. Both null disables quiet hours.
  quietHoursStart: z.number().int().min(0).max(23).nullable().optional(),
  quietHoursEnd: z.number().int().min(0).max(23).nullable().optional(),
  // Audible-alarm settings (Global Requirement A).
  soundEnabled: z.boolean().optional(),
  alarmSound: z.string().min(1).max(30).optional(),
  alarmVolume: z.number().int().min(0).max(100).optional(),
  // URL of the user's uploaded MP3 ringtone. When set it plays instead of the
  // synthesized preset chosen by `alarmSound`. Null clears it back to a preset.
  customRingtoneUrl: z.string().url().max(500).nullable().optional(),
})
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>

export const Role = ['USER', 'ADMIN'] as const
export type Role = (typeof Role)[number]

export interface PublicUser {
  id: string
  email: string
  name: string | null
  role: Role
  timezone: string
  language: Language
  quietHoursStart: number | null
  quietHoursEnd: number | null
  soundEnabled: boolean
  alarmSound: string
  alarmVolume: number
  customRingtoneUrl: string | null
  onboardedAt: string | null
  createdAt: string
}
