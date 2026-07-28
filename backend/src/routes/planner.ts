import { Router } from 'express'
import { reorderSchema } from '@life-os/shared'
import { validateBody } from '../middleware/validate.js'
import { requireAuth } from '../middleware/requireAuth.js'
import {
  handleToday,
  handleForDate,
  handleReorder,
} from '../controllers/plannerController.js'

export const plannerRouter = Router()

plannerRouter.use(requireAuth)

plannerRouter.get('/today', handleToday)
plannerRouter.patch('/reorder', validateBody(reorderSchema), handleReorder)
plannerRouter.get('/:date', handleForDate)
