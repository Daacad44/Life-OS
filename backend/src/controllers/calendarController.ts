import type { Request, Response } from 'express'
import type { ListEventsQuery } from '@life-os/shared'
import * as calendarService from '../services/calendarService.js'

export async function handleList(req: Request, res: Response) {
  const query = req.validatedQuery as ListEventsQuery
  const events = await calendarService.listForUser(req.user!.id, query)
  res.json({ success: true, data: events })
}

export async function handleGetOne(req: Request, res: Response) {
  const event = await calendarService.getOne(req.user!.id, req.params.id as string)
  res.json({ success: true, data: event })
}

export async function handleCreate(req: Request, res: Response) {
  const event = await calendarService.create(req.user!.id, req.body)
  res.status(201).json({ success: true, data: event })
}

export async function handleUpdate(req: Request, res: Response) {
  const event = await calendarService.update(
    req.user!.id,
    req.params.id as string,
    req.body,
  )
  res.json({ success: true, data: event })
}

export async function handleDelete(req: Request, res: Response) {
  await calendarService.remove(req.user!.id, req.params.id as string)
  res.status(204).send()
}
