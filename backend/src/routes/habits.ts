import { Router } from 'express'
import { createHabitSchema, updateHabitSchema } from '@life-os/shared'
import { validateBody } from '../middleware/validate.js'
import { requireAuth } from '../middleware/requireAuth.js'
import {
  handleList,
  handleCreate,
  handleUpdate,
  handleDelete,
  handleCheckin,
  handleInsight,
} from '../controllers/habitController.js'

export const habitsRouter = Router()

habitsRouter.use(requireAuth)

habitsRouter.get('/', handleList)
habitsRouter.post('/', validateBody(createHabitSchema), handleCreate)
habitsRouter.post('/:id/checkin', handleCheckin)
habitsRouter.get('/:id/insight', handleInsight)
habitsRouter.patch('/:id', validateBody(updateHabitSchema), handleUpdate)
habitsRouter.delete('/:id', handleDelete)
