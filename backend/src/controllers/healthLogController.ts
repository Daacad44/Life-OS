import type { Request, Response } from 'express'
import type { HealthTrendsQuery } from '@life-os/shared'
import * as healthService from '../services/healthService.js'

export async function handleList(req: Request, res: Response) {
  const logs = await healthService.listForUser(req.user!.id)
  res.json({ success: true, data: logs })
}

export async function handleCreate(req: Request, res: Response) {
  const log = await healthService.create(req.user!.id, req.body)
  res.status(201).json({ success: true, data: log })
}

export async function handleTrends(req: Request, res: Response) {
  const query = req.validatedQuery as HealthTrendsQuery
  const trends = await healthService.getTrends(req.user!.id, query.range)
  res.json({ success: true, data: trends })
}
