import type { Request, Response } from 'express'
import type { ListNotesQuery } from '@life-os/shared'
import * as noteService from '../services/noteService.js'

export async function handleList(req: Request, res: Response) {
  const query = req.validatedQuery as ListNotesQuery
  const notes = await noteService.listForUser(req.user!.id, query)
  res.json({ success: true, data: notes })
}

export async function handleGetOne(req: Request, res: Response) {
  const note = await noteService.getOne(req.user!.id, req.params.id as string)
  res.json({ success: true, data: note })
}

export async function handleCreate(req: Request, res: Response) {
  const note = await noteService.create(req.user!.id, req.body)
  res.status(201).json({ success: true, data: note })
}

export async function handleUpdate(req: Request, res: Response) {
  const note = await noteService.update(req.user!.id, req.params.id as string, req.body)
  res.json({ success: true, data: note })
}

export async function handleDelete(req: Request, res: Response) {
  await noteService.remove(req.user!.id, req.params.id as string)
  res.status(204).send()
}
