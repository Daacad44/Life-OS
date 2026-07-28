import { Router } from 'express'
import { createMemorySchema, searchMemorySchema } from '@life-os/shared'
import { validateBody } from '../middleware/validate.js'
import { requireAuth } from '../middleware/requireAuth.js'
import {
  handleList,
  handleCreate,
  handleSearch,
  handleDelete,
} from '../controllers/memoryController.js'

export const memoryRouter = Router()

memoryRouter.use(requireAuth)

memoryRouter.get('/', handleList)
memoryRouter.post('/', validateBody(createMemorySchema), handleCreate)
memoryRouter.post('/search', validateBody(searchMemorySchema), handleSearch)
memoryRouter.delete('/:id', handleDelete)
