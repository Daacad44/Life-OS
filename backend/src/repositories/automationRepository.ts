import type { Prisma } from '@prisma/client'
import { prisma } from '../config/db.js'

export function listAutomations(userId: string) {
  return prisma.automation.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: { runs: { orderBy: { ranAt: 'desc' }, take: 10 } },
  })
}

export function findAutomationById(userId: string, id: string) {
  return prisma.automation.findFirst({
    where: { id, userId },
    include: { runs: { orderBy: { ranAt: 'desc' }, take: 10 } },
  })
}

export function createAutomation(
  userId: string,
  data: {
    name: string
    trigger: string
    triggerConfig: Prisma.InputJsonValue
    action: string
    actionConfig: Prisma.InputJsonValue
  },
) {
  return prisma.automation.create({ data: { ...data, userId } })
}

export function updateAutomation(id: string, data: Prisma.AutomationUpdateInput) {
  return prisma.automation.update({ where: { id }, data })
}

export function deleteAutomation(id: string) {
  return prisma.automation.delete({ where: { id } })
}

// Enabled automations matching a trigger type, for a given user — used to find
// which rules to evaluate when a triggering event happens synchronously.
export function findEnabledByTrigger(userId: string, trigger: string) {
  return prisma.automation.findMany({ where: { userId, trigger, enabled: true } })
}

export async function recordRun(
  automationId: string,
  success: boolean,
  note: string | null,
) {
  await prisma.automationRun.create({ data: { automationId, success, note } })
  await prisma.automation.update({
    where: { id: automationId },
    data: { lastRunAt: new Date() },
  })
}
