import type { Request, Response } from 'express'
import type { ListTasksQuery } from '@life-os/shared'
import * as taskService from '../services/taskService.js'
import * as recurringTaskService from '../services/recurringTaskService.js'

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

// --- Subtasks ---------------------------------------------------------------

export async function handleAddSubtask(req: Request, res: Response) {
  const subtask = await taskService.addSubtask(
    req.user!.id,
    req.params.id as string,
    req.body,
  )
  res.status(201).json({ success: true, data: subtask })
}

export async function handleUpdateSubtask(req: Request, res: Response) {
  const subtask = await taskService.editSubtask(
    req.user!.id,
    req.params.subtaskId as string,
    req.body,
  )
  res.json({ success: true, data: subtask })
}

export async function handleDeleteSubtask(req: Request, res: Response) {
  await taskService.removeSubtask(req.user!.id, req.params.subtaskId as string)
  res.status(204).send()
}

// --- Recurring tasks --------------------------------------------------------

export async function handleListRecurring(req: Request, res: Response) {
  const items = await recurringTaskService.listForUser(req.user!.id)
  res.json({ success: true, data: items })
}

export async function handleCreateRecurring(req: Request, res: Response) {
  const item = await recurringTaskService.create(req.user!.id, req.body)
  res.status(201).json({ success: true, data: item })
}

export async function handleUpdateRecurring(req: Request, res: Response) {
  const item = await recurringTaskService.update(
    req.user!.id,
    req.params.id as string,
    req.body,
  )
  res.json({ success: true, data: item })
}

export async function handleDeleteRecurring(req: Request, res: Response) {
  await recurringTaskService.remove(req.user!.id, req.params.id as string)
  res.status(204).send()
}
