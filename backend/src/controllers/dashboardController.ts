import type { Request, Response } from 'express'
import * as dashboardService from '../services/dashboardService.js'

export async function handleGet(req: Request, res: Response) {
  const data = await dashboardService.getDashboard(req.user!.id)
  res.json({ success: true, data })
}
