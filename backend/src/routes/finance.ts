import { Router } from 'express'
import {
  createTransactionSchema,
  setBudgetSchema,
  updateTransactionSchema,
} from '@life-os/shared'
import { validateBody } from '../middleware/validate.js'
import { requireAuth } from '../middleware/requireAuth.js'
import {
  handleListTransactions,
  handleCreateTransaction,
  handleUpdateTransaction,
  handleDeleteTransaction,
  handleBudgetOverview,
  handleSetBudget,
} from '../controllers/financeController.js'

export const financeRouter = Router()

financeRouter.use(requireAuth)

financeRouter.get('/transactions', handleListTransactions)
financeRouter.post(
  '/transactions',
  validateBody(createTransactionSchema),
  handleCreateTransaction,
)
financeRouter.patch(
  '/transactions/:id',
  validateBody(updateTransactionSchema),
  handleUpdateTransaction,
)
financeRouter.delete('/transactions/:id', handleDeleteTransaction)

financeRouter.get('/budget', handleBudgetOverview)
financeRouter.patch('/budget', validateBody(setBudgetSchema), handleSetBudget)
