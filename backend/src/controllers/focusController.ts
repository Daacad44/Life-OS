import type { Request, Response } from 'express'
import * as focusService from '../services/focusService.js'

export async function handleStart(req: Request, res: Response) {
  const session = await focusService.start(req.user!.id, req.body)
  res.status(201).json({ success: true, data: session })
}

export async function handleEnd(req: Request, res: Response) {
  const session = await focusService.end(req.user!.id, req.body.sessionId)
  res.json({ success: true, data: session })
}

export async function handleList(req: Request, res: Response) {
  const sessions = await focusService.listForUser(req.user!.id)
  res.json({ success: true, data: sessions })
}
