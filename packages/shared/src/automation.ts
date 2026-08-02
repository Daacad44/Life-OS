import { z } from 'zod'

// Only habit_checkin and goal_progress actually execute (synchronously, from the
// triggering request) — there's no background scheduler yet, so "weekly" rules
// are stored and shown but never fire. See Workflow Automation.md Section 6-7.
export const AutomationTrigger = ['habit_checkin', 'goal_progress', 'weekly'] as const
export type AutomationTrigger = (typeof AutomationTrigger)[number]

export const AutomationAction = ['create_task', 'notify'] as const
export type AutomationAction = (typeof AutomationAction)[number]

export const createAutomationSchema = z.object({
  name: z.string().min(1).max(200),
  trigger: z.enum(AutomationTrigger),
  triggerConfig: z.record(z.string(), z.unknown()),
  action: z.enum(AutomationAction),
  actionConfig: z.record(z.string(), z.unknown()),
})
export type CreateAutomationInput = z.infer<typeof createAutomationSchema>

export const updateAutomationSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  enabled: z.boolean().optional(),
})
export type UpdateAutomationInput = z.infer<typeof updateAutomationSchema>

export interface AutomationRun {
  id: string
  automationId: string
  ranAt: string
  success: boolean
  note: string | null
}

export interface Automation {
  id: string
  userId: string
  name: string
  trigger: AutomationTrigger
  triggerConfig: Record<string, unknown>
  action: AutomationAction
  actionConfig: Record<string, unknown>
  enabled: boolean
  lastRunAt: string | null
  createdAt: string
  updatedAt: string
  runs: AutomationRun[]
}
