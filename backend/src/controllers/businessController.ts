import type { Request, Response } from 'express'
import * as businessService from '../services/businessService.js'

export async function handleListProjects(req: Request, res: Response) {
  const projects = await businessService.listProjects(req.user!.id)
  res.json({ success: true, data: projects })
}

export async function handleCreateProject(req: Request, res: Response) {
  const project = await businessService.createProject(req.user!.id, req.body)
  res.status(201).json({ success: true, data: project })
}

export async function handleUpdateProject(req: Request, res: Response) {
  const project = await businessService.updateProject(
    req.user!.id,
    req.params.id as string,
    req.body,
  )
  res.json({ success: true, data: project })
}

export async function handleDeleteProject(req: Request, res: Response) {
  await businessService.deleteProject(req.user!.id, req.params.id as string)
  res.status(204).send()
}

export async function handleDeleteClient(req: Request, res: Response) {
  await businessService.deleteClient(req.user!.id, req.params.id as string)
  res.status(204).send()
}

export async function handleListClients(req: Request, res: Response) {
  const clients = await businessService.listClients(req.user!.id)
  res.json({ success: true, data: clients })
}

export async function handleCreateClient(req: Request, res: Response) {
  const client = await businessService.createClient(req.user!.id, req.body)
  res.status(201).json({ success: true, data: client })
}
