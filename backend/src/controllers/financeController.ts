import type { Request, Response } from 'express'
import * as financeService from '../services/financeService.js'

export async function handleListTransactions(req: Request, res: Response) {
  const transactions = await financeService.listForUser(req.user!.id)
  res.json({ success: true, data: transactions })
}

export async function handleCreateTransaction(req: Request, res: Response) {
  const transaction = await financeService.create(req.user!.id, req.body)
  res.status(201).json({ success: true, data: transaction })
}

export async function handleUpdateTransaction(req: Request, res: Response) {
  const transaction = await financeService.update(
    req.user!.id,
    req.params.id as string,
    req.body,
  )
  res.json({ success: true, data: transaction })
}

export async function handleDeleteTransaction(req: Request, res: Response) {
  await financeService.remove(req.user!.id, req.params.id as string)
  res.status(204).send()
}

export async function handleBudgetOverview(req: Request, res: Response) {
  const overview = await financeService.getOverview(req.user!.id)
  res.json({ success: true, data: overview })
}

export async function handleSetBudget(req: Request, res: Response) {
  const budget = await financeService.setBudget(req.user!.id, req.body)
  res.json({ success: true, data: budget })
}
