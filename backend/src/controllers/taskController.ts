import type { Request, Response } from 'express'
import type { ListTasksQuery } from '@life-os/shared'
import * as taskService from '../services/taskService.js'

export async function handleList(req: Request, res: Response) {
  const query = req.validatedQuery as ListTasksQuery
  const { items, total } = await taskService.listForUser(req.user!.id, query)
  res.json({
    success: true,
    data: items,
    meta: { page: query.page, pageSize: query.pageSize, total },
  })
}

export async function handleGetOne(req: Request, res: Response) {
  const task = await taskService.getOne(req.user!.id, req.params.id as string)
  res.json({ success: true, data: task })
}

export async function handleCreate(req: Request, res: Response) {
  const task = await taskService.create(req.user!.id, req.body)
  res.status(201).json({ success: true, data: task })
}

export async function handleUpdate(req: Request, res: Response) {
  const task = await taskService.update(req.user!.id, req.params.id as string, req.body)
  res.json({ success: true, data: task })
}

export async function handleDelete(req: Request, res: Response) {
  await taskService.remove(req.user!.id, req.params.id as string)
  res.status(204).send()
}
