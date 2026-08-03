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

export const updateProfileSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  timezone: z.string().min(1).optional(),
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
  onboardedAt: string | null
  createdAt: string
}
