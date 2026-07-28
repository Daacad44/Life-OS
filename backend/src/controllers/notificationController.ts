import type { Request, Response } from 'express'
import * as notificationService from '../services/notificationService.js'

export async function handleList(req: Request, res: Response) {
  const notifications = await notificationService.listForUser(req.user!.id)
  res.json({ success: true, data: notifications })
}

export async function handleMarkRead(req: Request, res: Response) {
  const notification = await notificationService.markRead(
    req.user!.id,
    req.params.id as string,
  )
  res.json({ success: true, data: notification })
}

export async function handleMarkAllRead(req: Request, res: Response) {
  await notificationService.markAllRead(req.user!.id)
  res.json({ success: true, data: null })
}

export async function handleGetPreferences(req: Request, res: Response) {
  const preferences = await notificationService.getPreferences(req.user!.id)
  res.json({ success: true, data: preferences })
}

export async function handleUpdatePreferences(req: Request, res: Response) {
  const preferences = await notificationService.updatePreferences(req.user!.id, req.body)
  res.json({ success: true, data: preferences })
}
