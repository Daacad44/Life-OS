import { Router } from 'express'
import { updateProfileSchema } from '@life-os/shared'
import { validateBody } from '../middleware/validate.js'
import { requireAuth } from '../middleware/requireAuth.js'
import {
  handleUpdateProfile,
  handleExportData,
  handleDeleteAccount,
} from '../controllers/userController.js'

export const usersRouter = Router()

usersRouter.use(requireAuth)
usersRouter.patch('/me', validateBody(updateProfileSchema), handleUpdateProfile)
usersRouter.get('/me/export', handleExportData)
usersRouter.delete('/me', handleDeleteAccount)
