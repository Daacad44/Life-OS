import { Router } from 'express'
import { createReflectionSchema, reflectionPromptQuerySchema } from '@life-os/shared'
import { validateBody, validateQuery } from '../middleware/validate.js'
import { requireAuth } from '../middleware/requireAuth.js'
import {
  handleList,
  handlePrompt,
  handleCreate,
} from '../controllers/reflectionController.js'

export const reflectionsRouter = Router()

reflectionsRouter.use(requireAuth)

reflectionsRouter.get('/', handleList)
reflectionsRouter.get('/prompt', validateQuery(reflectionPromptQuerySchema), handlePrompt)
reflectionsRouter.post('/', validateBody(createReflectionSchema), handleCreate)
