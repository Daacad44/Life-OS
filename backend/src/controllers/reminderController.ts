import type { Request, Response } from 'express'
import type { ListRemindersQuery } from '@life-os/shared'
import * as reminderService from '../services/reminderService.js'

export async function handleList(req: Request, res: Response) {
  const query = (req.validatedQuery ?? {}) as ListRemindersQuery
  const reminders = await reminderService.listForUser(req.user!.id, query)
  res.json({ success: true, data: reminders })
}

export async function handleCreate(req: Request, res: Response) {
  const reminder = await reminderService.createForUser(req.user!.id, req.body)
  res.status(201).json({ success: true, data: reminder })
}

export async function handleDelete(req: Request, res: Response) {
  await reminderService.deleteForUser(req.user!.id, req.params.id as string)
  res.status(204).send()
}

// Fired-but-undismissed reminders — the client polls this to raise the alarm.
export async function handlePendingAlarms(req: Request, res: Response) {
  const alarms = await reminderService.pendingAlarmsForUser(req.user!.id)
  res.json({ success: true, data: alarms })
}

export async function handleAcknowledge(req: Request, res: Response) {
  await reminderService.acknowledgeForUser(req.user!.id, req.params.id as string)
  res.json({ success: true, data: null })
}

export async function handleSnooze(req: Request, res: Response) {
  const { minutes } = req.body as { minutes: number }
  const reminder = await reminderService.snoozeForUser(
    req.user!.id,
    req.params.id as string,
    minutes,
  )
  res.json({ success: true, data: reminder })
}
