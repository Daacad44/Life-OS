import { Router } from 'express'
import {
  createTaskSchema,
  updateTaskSchema,
  listTasksQuerySchema,
  createSubtaskSchema,
  updateSubtaskSchema,
  createRecurringTaskSchema,
  updateRecurringTaskSchema,
} from '@life-os/shared'
import { validateBody, validateQuery } from '../middleware/validate.js'
import { requireAuth } from '../middleware/requireAuth.js'
import {
  handleList,
  handleGetOne,
  handleCreate,
  handleUpdate,
  handleDelete,
  handleAddSubtask,
  handleUpdateSubtask,
  handleDeleteSubtask,
  handleListRecurring,
  handleCreateRecurring,
  handleUpdateRecurring,
  handleDeleteRecurring,
} from '../controllers/taskController.js'

export const tasksRouter = Router()

tasksRouter.use(requireAuth)

// Recurring templates — declared before /:id so "recurring" isn't read as an id.
tasksRouter.get('/recurring', handleListRecurring)
tasksRouter.post(
  '/recurring',
  validateBody(createRecurringTaskSchema),
  handleCreateRecurring,
)
tasksRouter.patch(
  '/recurring/:id',
  validateBody(updateRecurringTaskSchema),
  handleUpdateRecurring,
)
tasksRouter.delete('/recurring/:id', handleDeleteRecurring)

tasksRouter.get('/', validateQuery(listTasksQuerySchema), handleList)
tasksRouter.post('/', validateBody(createTaskSchema), handleCreate)
tasksRouter.get('/:id', handleGetOne)
tasksRouter.patch('/:id', validateBody(updateTaskSchema), handleUpdate)
tasksRouter.delete('/:id', handleDelete)

// Subtasks
tasksRouter.post('/:id/subtasks', validateBody(createSubtaskSchema), handleAddSubtask)
tasksRouter.patch(
  '/subtasks/:subtaskId',
  validateBody(updateSubtaskSchema),
  handleUpdateSubtask,
)
tasksRouter.delete('/subtasks/:subtaskId', handleDeleteSubtask)
