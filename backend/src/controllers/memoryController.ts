import type { Request, Response } from 'express'
import * as memoryService from '../services/memoryService.js'

export async function handleList(req: Request, res: Response) {
  const memories = await memoryService.listForUser(req.user!.id)
  res.json({ success: true, data: memories })
}

export async function handleCreate(req: Request, res: Response) {
  const memory = await memoryService.store(req.user!.id, req.body.content, req.body.type)
  res.status(201).json({ success: true, data: memory })
}

export async function handleSearch(req: Request, res: Response) {
  const results = await memoryService.search(req.user!.id, req.body.query, req.body.topK)
  res.json({ success: true, data: results })
}

export async function handleDelete(req: Request, res: Response) {
  await memoryService.remove(req.user!.id, req.params.id as string)
  res.status(204).send()
}
