import type { Request, Response } from 'express'
import * as plannerService from '../services/plannerService.js'

function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

export async function handleToday(req: Request, res: Response) {
  const plan = await plannerService.getPlanForDate(req.user!.id, todayStr())
  res.json({ success: true, data: plan })
}

export async function handleForDate(req: Request, res: Response) {
  const plan = await plannerService.getPlanForDate(
    req.user!.id,
    req.params.date as string,
  )
  res.json({ success: true, data: plan })
}

export async function handleReorder(req: Request, res: Response) {
  await plannerService.reorder(req.user!.id, req.body.taskIds)
  res.json({ success: true, data: null })
}
