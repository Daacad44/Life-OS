import type { Request, Response } from 'express'
import * as studyService from '../services/studyService.js'

export async function handleListSubjects(req: Request, res: Response) {
  const subjects = await studyService.listForUser(req.user!.id)
  res.json({ success: true, data: subjects })
}

export async function handleCreateSubject(req: Request, res: Response) {
  const subject = await studyService.createSubject(req.user!.id, req.body)
  res.status(201).json({ success: true, data: subject })
}

export async function handleCreateSession(req: Request, res: Response) {
  const session = await studyService.createSession(req.user!.id, req.body)
  res.status(201).json({ success: true, data: session })
}

export async function handleUpdateSession(req: Request, res: Response) {
  const session = await studyService.updateSession(
    req.user!.id,
    req.params.id as string,
    req.body.done,
  )
  res.json({ success: true, data: session })
}

export async function handleGeneratePlan(req: Request, res: Response) {
  const result = await studyService.generatePlan(req.user!.id, req.body)
  res.status(201).json({ success: true, data: result })
}
