import { Router } from 'express'
import {
  createGoalSchema,
  updateGoalSchema,
  createSubGoalSchema,
  updateSubGoalSchema,
} from '@life-os/shared'
import { validateBody } from '../middleware/validate.js'
import { requireAuth } from '../middleware/requireAuth.js'
import {
  handleList,
  handleGetOne,
  handleCreate,
  handleUpdate,
  handleDelete,
  handleAddSubGoal,
  handleUpdateSubGoal,
  handleDeleteSubGoal,
} from '../controllers/goalController.js'

export const goalsRouter = Router()

goalsRouter.use(requireAuth)

goalsRouter.get('/', handleList)
goalsRouter.post('/', validateBody(createGoalSchema), handleCreate)
goalsRouter.get('/:id', handleGetOne)
goalsRouter.patch('/:id', validateBody(updateGoalSchema), handleUpdate)
goalsRouter.delete('/:id', handleDelete)

goalsRouter.post('/:id/subgoals', validateBody(createSubGoalSchema), handleAddSubGoal)
goalsRouter.patch(
  '/:id/subgoals/:subGoalId',
  validateBody(updateSubGoalSchema),
  handleUpdateSubGoal,
)
goalsRouter.delete('/:id/subgoals/:subGoalId', handleDeleteSubGoal)
