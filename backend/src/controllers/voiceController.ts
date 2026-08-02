import type { Request, Response } from 'express'
import * as voiceService from '../services/voiceService.js'

export async function handleCommand(req: Request, res: Response) {
  const result = await voiceService.handleCommand(req.user!.id, req.body.text)
  res.json({ success: true, data: result })
}
