import type { Request, Response } from 'express'
import * as gamificationService from '../services/gamificationService.js'

export async function handleProfile(req: Request, res: Response) {
  const profile = await gamificationService.getProfile(req.user!.id)
  res.json({ success: true, data: profile })
}

export async function handleAchievements(req: Request, res: Response) {
  const achievements = await gamificationService.listAchievements(req.user!.id)
  res.json({ success: true, data: achievements })
}
