import type { FocusSession as PrismaFocusSession } from '@prisma/client'
import type { FocusSession, StartFocusSessionInput } from '@life-os/shared'
import { ApiError } from '../middleware/errorHandler.js'
import * as focusRepo from '../repositories/focusRepository.js'
import * as gamificationService from './gamificationService.js'

function toDTO(s: PrismaFocusSession): FocusSession {
  return {
    id: s.id,
    userId: s.userId,
    taskId: s.taskId,
    startedAt: s.startedAt.toISOString(),
    endedAt: s.endedAt ? s.endedAt.toISOString() : null,
    duration: s.duration,
  }
}

export async function listForUser(userId: string): Promise<FocusSession[]> {
  const rows = await focusRepo.listSessions(userId)
  return rows.map(toDTO)
}

export async function start(
  userId: string,
  input: StartFocusSessionInput,
): Promise<FocusSession> {
  const active = await focusRepo.findActiveSession(userId)
  if (active) {
    // Leftover open session (tab closed mid-session, etc.) — close it as partial
    // rather than leaving it open forever. See Focus Mode.md, Section 12.
    const durationSeconds = Math.max(
      0,
      Math.floor((Date.now() - active.startedAt.getTime()) / 1000),
    )
    await focusRepo.endSession(active.id, durationSeconds)
  }
  const session = await focusRepo.createSession(userId, input.taskId ?? null)
  return toDTO(session)
}

export async function end(userId: string, sessionId: string): Promise<FocusSession> {
  const session = await focusRepo.findById(userId, sessionId)
  if (!session) {
    throw new ApiError(404, 'NOT_FOUND', 'Focus session not found')
  }
  if (session.endedAt) {
    return toDTO(session)
  }
  const durationSeconds = Math.max(
    0,
    Math.floor((Date.now() - session.startedAt.getTime()) / 1000),
  )
  const ended = await focusRepo.endSession(sessionId, durationSeconds)
  void gamificationService.award(userId, 'focus_session_minute', {
    minutes: Math.round(durationSeconds / 60),
  })
  return toDTO(ended)
}
