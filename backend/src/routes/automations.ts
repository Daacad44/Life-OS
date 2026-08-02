import { Router } from 'express'
import { createAutomationSchema, updateAutomationSchema } from '@life-os/shared'
import { validateBody } from '../middleware/validate.js'
import { requireAuth } from '../middleware/requireAuth.js'
import {
  handleList,
  handleCreate,
  handleUpdate,
  handleDelete,
} from '../controllers/automationController.js'

export const automationsRouter = Router()

automationsRouter.use(requireAuth)

automationsRouter.get('/', handleList)
automationsRouter.post('/', validateBody(createAutomationSchema), handleCreate)
automationsRouter.patch('/:id', validateBody(updateAutomationSchema), handleUpdate)
automationsRouter.delete('/:id', handleDelete)
