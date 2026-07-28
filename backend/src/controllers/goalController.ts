import type { Request, Response } from 'express'
import * as goalService from '../services/goalService.js'

export async function handleList(req: Request, res: Response) {
  const goals = await goalService.listForUser(req.user!.id)
  res.json({ success: true, data: goals })
}

export async function handleGetOne(req: Request, res: Response) {
  const goal = await goalService.getOne(req.user!.id, req.params.id as string)
  res.json({ success: true, data: goal })
}

export async function handleCreate(req: Request, res: Response) {
  const goal = await goalService.create(req.user!.id, req.body)
  res.status(201).json({ success: true, data: goal })
}

export async function handleUpdate(req: Request, res: Response) {
  const goal = await goalService.update(req.user!.id, req.params.id as string, req.body)
  res.json({ success: true, data: goal })
}

export async function handleDelete(req: Request, res: Response) {
  await goalService.remove(req.user!.id, req.params.id as string)
  res.status(204).send()
}

export async function handleAddSubGoal(req: Request, res: Response) {
  const subGoal = await goalService.addSubGoal(
    req.user!.id,
    req.params.id as string,
    req.body,
  )
  res.status(201).json({ success: true, data: subGoal })
}

export async function handleUpdateSubGoal(req: Request, res: Response) {
  const subGoal = await goalService.updateSubGoal(
    req.user!.id,
    req.params.id as string,
    req.params.subGoalId as string,
    req.body,
  )
  res.json({ success: true, data: subGoal })
}

export async function handleDeleteSubGoal(req: Request, res: Response) {
  await goalService.removeSubGoal(
    req.user!.id,
    req.params.id as string,
    req.params.subGoalId as string,
  )
  res.status(204).send()
}
