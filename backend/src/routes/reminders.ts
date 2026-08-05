import { Router } from 'express'
import { createReminderSchema, listRemindersQuerySchema } from '@life-os/shared'
import { validateBody, validateQuery } from '../middleware/validate.js'
import { requireAuth } from '../middleware/requireAuth.js'
import {
  handleList,
  handleCreate,
  handleDelete,
} from '../controllers/reminderController.js'

export const remindersRouter = Router()

remindersRouter.use(requireAuth)

remindersRouter.get('/', validateQuery(listRemindersQuerySchema), handleList)
remindersRouter.post('/', validateBody(createReminderSchema), handleCreate)
remindersRouter.delete('/:id', handleDelete)
