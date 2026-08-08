import { Router } from 'express'
import {
  createReminderSchema,
  listRemindersQuerySchema,
  snoozeReminderSchema,
} from '@life-os/shared'
import { validateBody, validateQuery } from '../middleware/validate.js'
import { requireAuth } from '../middleware/requireAuth.js'
import {
  handleList,
  handleCreate,
  handleDelete,
  handlePendingAlarms,
  handleAcknowledge,
  handleSnooze,
} from '../controllers/reminderController.js'

export const remindersRouter = Router()

remindersRouter.use(requireAuth)

remindersRouter.get('/', validateQuery(listRemindersQuerySchema), handleList)
remindersRouter.get('/alarms', handlePendingAlarms)
remindersRouter.post('/', validateBody(createReminderSchema), handleCreate)
remindersRouter.post('/:id/acknowledge', handleAcknowledge)
remindersRouter.post('/:id/snooze', validateBody(snoozeReminderSchema), handleSnooze)
remindersRouter.delete('/:id', handleDelete)
