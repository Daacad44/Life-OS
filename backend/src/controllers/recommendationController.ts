import type { Request, Response } from 'express'
import * as recommendationService from '../services/recommendationService.js'

export async function handleList(req: Request, res: Response) {
  const recommendations = await recommendationService.listForUser(req.user!.id)
  res.json({ success: true, data: recommendations })
}

export async function handleAccept(req: Request, res: Response) {
  const rec = await recommendationService.accept(req.user!.id, req.params.id as string)
  res.json({ success: true, data: rec })
}

export async function handleDismiss(req: Request, res: Response) {
  const rec = await recommendationService.dismiss(req.user!.id, req.params.id as string)
  res.json({ success: true, data: rec })
}
