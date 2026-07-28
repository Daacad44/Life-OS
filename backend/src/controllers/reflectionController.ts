import type { Request, Response } from 'express'
import type { ReflectionPromptQuery } from '@life-os/shared'
import * as reflectionService from '../services/reflectionService.js'

export async function handleList(req: Request, res: Response) {
  const reflections = await reflectionService.listForUser(req.user!.id)
  res.json({ success: true, data: reflections })
}

export async function handlePrompt(req: Request, res: Response) {
  const query = req.validatedQuery as ReflectionPromptQuery
  const result = await reflectionService.getPrompt(req.user!.id, query.period)
  res.json({ success: true, data: result })
}

export async function handleCreate(req: Request, res: Response) {
  const reflection = await reflectionService.create(req.user!.id, req.body)
  res.status(201).json({ success: true, data: reflection })
}
