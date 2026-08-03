import type { Request, Response } from 'express'
import * as coachService from '../services/coachService.js'

export async function handleHistory(req: Request, res: Response) {
  const messages = await coachService.getHistory(req.user!.id)
  res.json({ success: true, data: messages })
}

export async function handleSendMessage(req: Request, res: Response) {
  // Headers are only set on the first actual chunk — if the AI call fails before
  // streaming starts, this lets the error fall through as a normal JSON response
  // instead of being mislabeled text/plain.
  let started = false
  function writeDelta(delta: string) {
    if (!started) {
      res.setHeader('Content-Type', 'text/plain; charset=utf-8')
      res.setHeader('Cache-Control', 'no-cache')
      started = true
    }
    res.write(delta)
  }

  try {
    await coachService.sendMessage(req.user!.id, req.body.message, writeDelta)
    res.end()
  } catch (err) {
    if (res.headersSent) {
      req.log.error(err, 'Coach stream error mid-stream')
      res.end()
      return
    }
    throw err
  }
}
