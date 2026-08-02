import { z } from 'zod'

export const createSubjectSchema = z.object({
  title: z.string().min(1).max(200),
})
export type CreateSubjectInput = z.infer<typeof createSubjectSchema>

export const createStudySessionSchema = z.object({
  subjectId: z.string().uuid(),
  topic: z.string().max(200).optional(),
  scheduledAt: z.coerce.date(),
})
export type CreateStudySessionInput = z.infer<typeof createStudySessionSchema>

export const updateStudySessionSchema = z.object({
  done: z.boolean().optional(),
})
export type UpdateStudySessionInput = z.infer<typeof updateStudySessionSchema>

export const generateStudyPlanSchema = z.object({
  subjectId: z.string().uuid(),
  deadline: z.coerce.date(),
  hoursPerWeek: z.number().positive().max(80),
})
export type GenerateStudyPlanInput = z.infer<typeof generateStudyPlanSchema>

export interface StudySession {
  id: string
  userId: string
  subjectId: string
  topic: string | null
  scheduledAt: string
  done: boolean
  createdAt: string
}

export interface Subject {
  id: string
  userId: string
  title: string
  progress: number
  createdAt: string
  updatedAt: string
  studySessions: StudySession[]
}

export interface StudyPlanResult {
  createdSessions: StudySession[]
  advice: string
}
