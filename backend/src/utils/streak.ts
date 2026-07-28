import type { HabitFrequency } from '@life-os/shared'

function toDayKey(date: Date) {
  return date.toISOString().slice(0, 10)
}

function startOfWeekKey(date: Date) {
  const d = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  )
  d.setUTCDate(d.getUTCDate() - d.getUTCDay())
  return toDayKey(d)
}

// Consecutive-period streak ending today (DAILY) or this week (WEEKLY),
// tolerating the current period not having a check-in yet. UTC-based —
// see docs/.../02-PRD/Habit System.md, Section 12 (timezone edge case);
// this is a simplification, matching the Planner's day-boundary approach.
export function calculateStreak(checkinDates: Date[], frequency: HabitFrequency): number {
  const now = new Date()

  if (frequency === 'DAILY') {
    const keys = new Set(checkinDates.map(toDayKey))
    const cursor = new Date(now)
    if (!keys.has(toDayKey(cursor))) {
      cursor.setDate(cursor.getDate() - 1)
    }
    let streak = 0
    while (keys.has(toDayKey(cursor))) {
      streak++
      cursor.setDate(cursor.getDate() - 1)
    }
    return streak
  }

  // WEEKLY
  const weekKeys = new Set(checkinDates.map(startOfWeekKey))
  const cursor = new Date(now)
  if (!weekKeys.has(startOfWeekKey(cursor))) {
    cursor.setDate(cursor.getDate() - 7)
  }
  let streak = 0
  while (weekKeys.has(startOfWeekKey(cursor))) {
    streak++
    cursor.setDate(cursor.getDate() - 7)
  }
  return streak
}
