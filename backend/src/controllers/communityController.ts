import type { Request, Response } from 'express'
import * as communityService from '../services/communityService.js'

export async function handleGetOptIn(req: Request, res: Response) {
  const optIn = await communityService.getOptIn(req.user!.id)
  res.json({ success: true, data: { optIn } })
}

export async function handleSetOptIn(req: Request, res: Response) {
  const optIn = await communityService.setOptIn(req.user!.id, req.body.optIn)
  res.json({ success: true, data: { optIn } })
}

export async function handleListConnections(req: Request, res: Response) {
  const connections = await communityService.listConnections(req.user!.id)
  res.json({ success: true, data: connections })
}

export async function handleConnect(req: Request, res: Response) {
  const connection = await communityService.connect(req.user!.id, req.body.partnerEmail)
  res.status(201).json({ success: true, data: connection })
}

export async function handleRespondToConnection(req: Request, res: Response) {
  const connection = await communityService.respondToConnection(
    req.user!.id,
    req.params.id as string,
    req.body.status,
  )
  res.json({ success: true, data: connection })
}

export async function handleShare(req: Request, res: Response) {
  const post = await communityService.shareGoal(req.user!.id, req.body)
  res.status(201).json({ success: true, data: post })
}

export async function handleFeed(req: Request, res: Response) {
  const posts = await communityService.getFeed(req.user!.id)
  res.json({ success: true, data: posts })
}

export async function handleReportPost(req: Request, res: Response) {
  await communityService.reportPost(req.user!.id, req.params.id as string)
  res.status(204).send()
}
