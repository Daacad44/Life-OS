import type { Request, Response } from 'express'
import type { AnalyticsRangeQuery } from '@life-os/shared'
import * as analyticsService from '../services/analyticsService.js'

export async function handleOverview(req: Request, res: Response) {
  const query = req.validatedQuery as AnalyticsRangeQuery
  const overview = await analyticsService.getOverview(req.user!.id, query.range)
  res.json({ success: true, data: overview })
}

export async function handleInsights(req: Request, res: Response) {
  const query = req.validatedQuery as AnalyticsRangeQuery
  const insights = await analyticsService.getInsights(req.user!.id, query.range)
  res.json({ success: true, data: { insights } })
}
