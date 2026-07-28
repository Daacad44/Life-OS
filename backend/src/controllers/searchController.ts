import type { Request, Response } from 'express'
import * as searchService from '../services/searchService.js'

export async function handleSearch(req: Request, res: Response) {
  const results = await searchService.search(req.user!.id, req.body.query)
  res.json({ success: true, data: { results, answer: null } })
}

export async function handleAiSearch(req: Request, res: Response) {
  const result = await searchService.searchWithAnswer(req.user!.id, req.body.query)
  res.json({ success: true, data: result })
}
