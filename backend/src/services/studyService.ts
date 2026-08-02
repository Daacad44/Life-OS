import type {
  CreateStudySessionInput,
  CreateSubjectInput,
  GenerateStudyPlanInput,
  StudyPlanResult,
  StudySession,
  Subject,
} from '@life-os/shared'
import { ApiError } from '../middleware/errorHandler.js'
import * as studyRepo from '../repositories/studyRepository.js'
import * as aiService from '../ai/service.js'
import { studyPlanSystemPrompt, studyPlanUserPrompt } from '../ai/prompts.js'

function toSessionDTO(s: {
  id: string
  userId: string
  subjectId: string
  topic: string | null
  scheduledAt: Date
  done: boolean
  createdAt: Date
}): StudySession {
  return {
    id: s.id,
    userId: s.userId,
    subjectId: s.subjectId,
    topic: s.topic,
    scheduledAt: s.scheduledAt.toISOString(),
    done: s.done,
    createdAt: s.createdAt.toISOString(),
  }
}

function toSubjectDTO(s: {
  id: string
  userId: string
  title: string
  progress: number
  createdAt: Date
  updatedAt: Date
  studySessions: Parameters<typeof toSessionDTO>[0][]
}): Subject {
  return {
    id: s.id,
    userId: s.userId,
    title: s.title,
    progress: s.progress,
    createdAt: s.createdAt.toISOString(),
    updatedAt: s.updatedAt.toISOString(),
    studySessions: s.studySessions.map(toSessionDTO),
  }
}

export async function listForUser(userId: string): Promise<Subject[]> {
  const rows = await studyRepo.listSubjects(userId)
  return rows.map(toSubjectDTO)
}

async function getRawSubject(userId: string, id: string) {
  const subject = await studyRepo.findSubjectById(userId, id)
  if (!subject) {
    throw new ApiError(404, 'NOT_FOUND', 'Subject not found')
  }
  return subject
}

export async function createSubject(
  userId: string,
  input: CreateSubjectInput,
): Promise<Subject> {
  const subject = await studyRepo.createSubject(userId, input.title)
  return toSubjectDTO({ ...subject, studySessions: [] })
}

export async function createSession(
  userId: string,
  input: CreateStudySessionInput,
): Promise<StudySession> {
  await getRawSubject(userId, input.subjectId)
  const session = await studyRepo.createSession(
    userId,
    input.subjectId,
    input.topic ?? null,
    input.scheduledAt,
  )
  await studyRepo.recomputeProgress(input.subjectId)
  return toSessionDTO(session)
}

export async function updateSession(
  userId: string,
  id: string,
  done: boolean,
): Promise<StudySession> {
  const existing = await studyRepo.findSessionById(userId, id)
  if (!existing) {
    throw new ApiError(404, 'NOT_FOUND', 'Study session not found')
  }
  const session = await studyRepo.updateSession(id, done)
  await studyRepo.recomputeProgress(existing.subjectId)
  return toSessionDTO(session)
}

// Spaces sessions across the available days — see Study Planner.md Section 6.
export async function generatePlan(
  userId: string,
  input: GenerateStudyPlanInput,
): Promise<StudyPlanResult> {
  const subject = await getRawSubject(userId, input.subjectId)
  const daysUntilDeadline = Math.max(
    1,
    Math.ceil((input.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
  )

  const result = await aiService.generateJson<{
    sessions: { topic: string; dayOffset: number }[]
    advice: string
  }>({
    userId,
    feature: 'study_plan',
    system: studyPlanSystemPrompt(),
    messages: [
      {
        role: 'user',
        content: studyPlanUserPrompt({
          subjectTitle: subject.title,
          daysUntilDeadline,
          hoursPerWeek: input.hoursPerWeek,
        }),
      },
    ],
    maxTokens: 800,
  })

  const createdSessions: StudySession[] = []
  for (const s of result.sessions.slice(0, 12)) {
    const offset = Math.min(Math.max(s.dayOffset, 0), daysUntilDeadline)
    const scheduledAt = new Date(Date.now() + offset * 24 * 60 * 60 * 1000)
    const session = await studyRepo.createSession(
      userId,
      subject.id,
      s.topic,
      scheduledAt,
    )
    createdSessions.push(toSessionDTO(session))
  }
  await studyRepo.recomputeProgress(subject.id)

  return { createdSessions, advice: result.advice }
}
