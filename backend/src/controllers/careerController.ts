import type { Request, Response } from 'express'
import * as careerService from '../services/careerService.js'

export async function handleOverview(req: Request, res: Response) {
  const overview = await careerService.getOverview(req.user!.id)
  res.json({ success: true, data: overview })
}

export async function handleCreateCareerGoal(req: Request, res: Response) {
  const goal = await careerService.createCareerGoal(req.user!.id, req.body)
  res.status(201).json({ success: true, data: goal })
}

export async function handleCreateSkill(req: Request, res: Response) {
  const skill = await careerService.createSkill(req.user!.id, req.body)
  res.status(201).json({ success: true, data: skill })
}

export async function handleCreateMilestone(req: Request, res: Response) {
  const milestone = await careerService.createMilestone(req.user!.id, req.body)
  res.status(201).json({ success: true, data: milestone })
}

export async function handleUpdateMilestone(req: Request, res: Response) {
  const milestone = await careerService.updateMilestone(
    req.user!.id,
    req.params.id as string,
    req.body.done,
  )
  res.json({ success: true, data: milestone })
}

export async function handleGeneratePlan(req: Request, res: Response) {
  const result = await careerService.generatePlan(req.user!.id, req.body)
  res.status(201).json({ success: true, data: result })
}
