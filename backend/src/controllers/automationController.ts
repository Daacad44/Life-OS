import type { Request, Response } from 'express'
import * as automationService from '../services/automationService.js'

export async function handleList(req: Request, res: Response) {
  const automations = await automationService.listForUser(req.user!.id)
  res.json({ success: true, data: automations })
}

export async function handleCreate(req: Request, res: Response) {
  const automation = await automationService.create(req.user!.id, req.body)
  res.status(201).json({ success: true, data: automation })
}

export async function handleUpdate(req: Request, res: Response) {
  const automation = await automationService.update(
    req.user!.id,
    req.params.id as string,
    req.body,
  )
  res.json({ success: true, data: automation })
}

export async function handleDelete(req: Request, res: Response) {
  await automationService.remove(req.user!.id, req.params.id as string)
  res.status(204).send()
}
