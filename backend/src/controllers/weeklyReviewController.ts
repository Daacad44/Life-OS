import type { Request, Response } from 'express'
import * as weeklyReviewService from '../services/weeklyReviewService.js'

export async function handleCurrent(req: Request, res: Response) {
  const review = await weeklyReviewService.getCurrent(req.user!.id)
  res.json({ success: true, data: review })
}

export async function handleGenerate(req: Request, res: Response) {
  const review = await weeklyReviewService.generate(req.user!.id)
  res.status(201).json({ success: true, data: review })
}

export async function handleList(req: Request, res: Response) {
  const reviews = await weeklyReviewService.listPast(req.user!.id)
  res.json({ success: true, data: reviews })
}
