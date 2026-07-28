import type { Request, Response } from 'express'
import * as habitService from '../services/habitService.js'

export async function handleList(req: Request, res: Response) {
  const habits = await habitService.listForUser(req.user!.id)
  res.json({ success: true, data: habits })
}

export async function handleCreate(req: Request, res: Response) {
  const habit = await habitService.create(req.user!.id, req.body)
  res.status(201).json({ success: true, data: habit })
}

export async function handleUpdate(req: Request, res: Response) {
  const habit = await habitService.update(req.user!.id, req.params.id as string, req.body)
  res.json({ success: true, data: habit })
}

export async function handleDelete(req: Request, res: Response) {
  await habitService.remove(req.user!.id, req.params.id as string)
  res.status(204).send()
}

export async function handleCheckin(req: Request, res: Response) {
  const result = await habitService.checkin(req.user!.id, req.params.id as string)
  res.status(201).json({ success: true, data: result })
}

export async function handleInsight(req: Request, res: Response) {
  const insight = await habitService.getInsight(req.user!.id, req.params.id as string)
  res.json({ success: true, data: insight })
}
