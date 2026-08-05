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
