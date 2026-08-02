import { Router } from 'express'
import { createClientSchema, createProjectSchema } from '@life-os/shared'
import { validateBody } from '../middleware/validate.js'
import { requireAuth } from '../middleware/requireAuth.js'
import {
  handleListProjects,
  handleCreateProject,
  handleListClients,
  handleCreateClient,
} from '../controllers/businessController.js'

export const businessRouter = Router()

businessRouter.use(requireAuth)

businessRouter.get('/projects', handleListProjects)
businessRouter.post('/projects', validateBody(createProjectSchema), handleCreateProject)
businessRouter.get('/clients', handleListClients)
businessRouter.post('/clients', validateBody(createClientSchema), handleCreateClient)
