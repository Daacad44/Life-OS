import { Router } from 'express'
import {
  createEventSchema,
  updateEventSchema,
  listEventsQuerySchema,
} from '@life-os/shared'
import { validateBody, validateQuery } from '../middleware/validate.js'
import { requireAuth } from '../middleware/requireAuth.js'
import {
  handleList,
  handleGetOne,
  handleCreate,
  handleUpdate,
  handleDelete,
} from '../controllers/calendarController.js'

export const eventsRouter = Router()

eventsRouter.use(requireAuth)

eventsRouter.get('/', validateQuery(listEventsQuerySchema), handleList)
eventsRouter.post('/', validateBody(createEventSchema), handleCreate)
eventsRouter.get('/:id', handleGetOne)
eventsRouter.patch('/:id', validateBody(updateEventSchema), handleUpdate)
eventsRouter.delete('/:id', handleDelete)
