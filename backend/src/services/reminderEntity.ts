import type { ReminderEntityType } from '@life-os/shared'
import { prisma } from '../config/db.js'

export interface EntityStatus {
  exists: boolean
  title: string | null
  /** True when the item is completed/closed and its reminder should be dropped. */
  done: boolean
}

// Look up a reminder's target so we can name it in the notification/alarm and
// drop the reminder if the item was completed or deleted. User-scoped.
export async function resolveEntity(
  entityType: ReminderEntityType,
  entityId: string,
  userId: string,
): Promise<EntityStatus> {
  const where = { id: entityId, userId }
  switch (entityType) {
    case 'task': {
      const t = await prisma.task.findFirst({ where })
      return {
        exists: !!t && !t.deletedAt,
        title: t?.title ?? null,
        done: t?.status === 'DONE',
      }
    }
    case 'event': {
      const e = await prisma.calendarEvent.findFirst({ where })
      return { exists: !!e, title: e?.title ?? null, done: false }
    }
    case 'habit': {
      const h = await prisma.habit.findFirst({ where })
      return { exists: !!h, title: h?.title ?? null, done: false }
    }
    case 'goal': {
      const g = await prisma.goal.findFirst({ where })
      return {
        exists: !!g && !g.deletedAt,
        title: g?.title ?? null,
        done: (g?.progress ?? 0) >= 100,
      }
    }
    case 'subgoal': {
      // Sub-goals are owned through their parent goal.
      const sg = await prisma.subGoal.findFirst({
        where: { id: entityId, goal: { userId } },
      })
      return { exists: !!sg, title: sg?.title ?? null, done: sg?.done ?? false }
    }
  }
}
