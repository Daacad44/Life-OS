import type { Prisma } from '@prisma/client'
import type { Automation, AutomationRun, CreateAutomationInput } from '@life-os/shared'
import { ApiError } from '../middleware/errorHandler.js'
import * as automationRepo from '../repositories/automationRepository.js'
import * as taskRepo from '../repositories/taskRepository.js'
import * as notificationService from './notificationService.js'

function toRunDTO(r: {
  id: string
  automationId: string
  ranAt: Date
  success: boolean
  note: string | null
}): AutomationRun {
  return { ...r, ranAt: r.ranAt.toISOString() }
}

function toDTO(a: {
  id: string
  userId: string
  name: string
  trigger: string
  triggerConfig: unknown
  action: string
  actionConfig: unknown
  enabled: boolean
  lastRunAt: Date | null
  createdAt: Date
  updatedAt: Date
  runs: Parameters<typeof toRunDTO>[0][]
}): Automation {
  return {
    id: a.id,
    userId: a.userId,
    name: a.name,
    trigger: a.trigger as Automation['trigger'],
    triggerConfig: (a.triggerConfig ?? {}) as Record<string, unknown>,
    action: a.action as Automation['action'],
    actionConfig: (a.actionConfig ?? {}) as Record<string, unknown>,
    enabled: a.enabled,
    lastRunAt: a.lastRunAt ? a.lastRunAt.toISOString() : null,
    createdAt: a.createdAt.toISOString(),
    updatedAt: a.updatedAt.toISOString(),
    runs: a.runs.map(toRunDTO),
  }
}

export async function listForUser(userId: string): Promise<Automation[]> {
  const rows = await automationRepo.listAutomations(userId)
  return rows.map(toDTO)
}

export async function create(
  userId: string,
  input: CreateAutomationInput,
): Promise<Automation> {
  const automation = await automationRepo.createAutomation(userId, {
    ...input,
    triggerConfig: input.triggerConfig as Prisma.InputJsonValue,
    actionConfig: input.actionConfig as Prisma.InputJsonValue,
  })
  return toDTO({ ...automation, runs: [] })
}

export async function update(
  userId: string,
  id: string,
  input: { name?: string; enabled?: boolean },
): Promise<Automation> {
  const existing = await automationRepo.findAutomationById(userId, id)
  if (!existing) {
    throw new ApiError(404, 'NOT_FOUND', 'Automation not found')
  }
  const automation = await automationRepo.updateAutomation(id, input)
  return toDTO({ ...automation, runs: existing.runs })
}

export async function remove(userId: string, id: string): Promise<void> {
  const existing = await automationRepo.findAutomationById(userId, id)
  if (!existing) {
    throw new ApiError(404, 'NOT_FOUND', 'Automation not found')
  }
  await automationRepo.deleteAutomation(id)
}

async function executeAction(
  userId: string,
  automation: { id: string; action: string; actionConfig: unknown },
) {
  try {
    const config = (automation.actionConfig ?? {}) as Record<string, unknown>
    if (automation.action === 'create_task') {
      const title = typeof config.title === 'string' ? config.title : 'Automated task'
      await taskRepo.createTask(userId, { title })
    } else if (automation.action === 'notify') {
      const message =
        typeof config.message === 'string' ? config.message : 'Automation triggered'
      await notificationService.notify(userId, 'automationRan', 'Automation ran', message)
    }
    await automationRepo.recordRun(automation.id, true, null)
  } catch (err) {
    const note = err instanceof Error ? err.message : 'Unknown error'
    console.error('Automation run failed:', note)
    await automationRepo.recordRun(automation.id, false, note)
  }
}

// Runs synchronously from the check-in request — see Workflow Automation.md's
// note that there's no background scheduler yet (Automation.md Section 7).
export async function runHabitCheckinTriggers(userId: string, habitId: string) {
  const automations = await automationRepo.findEnabledByTrigger(userId, 'habit_checkin')
  for (const automation of automations) {
    const config = automation.triggerConfig as Record<string, unknown>
    if (config.habitId === habitId) {
      void executeAction(userId, automation)
    }
  }
}

// Fires at most once per automation (guarded by lastRunAt) when progress first
// reaches the configured threshold.
export async function runGoalProgressTriggers(
  userId: string,
  goalId: string,
  progress: number,
) {
  const automations = await automationRepo.findEnabledByTrigger(userId, 'goal_progress')
  for (const automation of automations) {
    if (automation.lastRunAt) continue
    const config = automation.triggerConfig as Record<string, unknown>
    const threshold = typeof config.threshold === 'number' ? config.threshold : 100
    if (config.goalId === goalId && progress >= threshold) {
      void executeAction(userId, automation)
    }
  }
}
