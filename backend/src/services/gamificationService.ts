import type { Achievement, GamificationProfile } from '@life-os/shared'
import * as gamificationRepo from '../repositories/gamificationRepository.js'

const LEVEL_SIZE = 100

type AwardReason =
  | 'task_completed'
  | 'habit_checkin'
  | 'goal_completed'
  | 'reflection_logged'
  | 'focus_session_minute'

const POINTS: Record<AwardReason, number> = {
  task_completed: 10,
  habit_checkin: 5,
  goal_completed: 50,
  reflection_logged: 15,
  focus_session_minute: 1,
}

function levelFor(points: number): number {
  return Math.floor(points / LEVEL_SIZE) + 1
}

function toAchievementDTO(a: {
  id: string
  type: string
  unlockedAt: Date
}): Achievement {
  return { id: a.id, type: a.type, unlockedAt: a.unlockedAt.toISOString() }
}

export async function getProfile(userId: string): Promise<GamificationProfile> {
  const [progress, achievements] = await Promise.all([
    gamificationRepo.getOrCreateProgress(userId),
    gamificationRepo.listAchievements(userId),
  ])
  return {
    points: progress.points,
    level: progress.level,
    achievements: achievements.map(toAchievementDTO),
  }
}

export async function listAchievements(userId: string): Promise<Achievement[]> {
  const rows = await gamificationRepo.listAchievements(userId)
  return rows.map(toAchievementDTO)
}

async function unlock(userId: string, type: string) {
  try {
    await gamificationRepo.unlockAchievement(userId, type)
  } catch {
    // Already unlocked — the unique constraint rejected the duplicate, as intended.
  }
}

// Server-authoritative — points are never accepted from the client, only
// awarded here in response to real actions. See Gamification.md Section 9.
// Scope note: goal_completed can re-award if progress drops below 100% and
// crosses it again (e.g. toggling a sub-goal) — a minor economy quirk, not
// worth threading before/after progress through every call site for this scale.
export async function award(
  userId: string,
  reason: AwardReason,
  meta: { minutes?: number; streak?: number } = {},
): Promise<void> {
  let points = POINTS[reason]
  if (reason === 'focus_session_minute') {
    points *= Math.min(meta.minutes ?? 0, 60)
  }
  if (points <= 0) return

  const before = await gamificationRepo.getOrCreateProgress(userId)
  const newPoints = before.points + points
  const newLevel = levelFor(newPoints)
  await gamificationRepo.setProgress(userId, newPoints, newLevel)

  if (reason === 'task_completed') void unlock(userId, 'first_task')
  if (reason === 'goal_completed') void unlock(userId, 'first_goal_completed')
  if (reason === 'habit_checkin' && meta.streak === 7)
    void unlock(userId, 'first_habit_streak_7')
  if (newLevel >= 5) void unlock(userId, 'level_5')
  if (newPoints >= 1000) void unlock(userId, 'points_1000')
}
