import { Router } from 'express'
import { createTaskSchema, updateTaskSchema, listTasksQuerySchema } from '@life-os/shared'
import { validateBody, validateQuery } from '../middleware/validate.js'
import { requireAuth } from '../middleware/requireAuth.js'
import {
  handleList,
  handleGetOne,
  handleCreate,
  handleUpdate,
  handleDelete,
} from '../controllers/taskController.js'

export const tasksRouter = Router()

tasksRouter.use(requireAuth)

tasksRouter.get('/', validateQuery(listTasksQuerySchema), handleList)
tasksRouter.post('/', validateBody(createTaskSchema), handleCreate)
tasksRouter.get('/:id', handleGetOne)
tasksRouter.patch('/:id', validateBody(updateTaskSchema), handleUpdate)
tasksRouter.delete('/:id', handleDelete)
