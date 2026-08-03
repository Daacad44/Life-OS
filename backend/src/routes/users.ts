import { Router } from 'express'
import { updateProfileSchema } from '@life-os/shared'
import { validateBody } from '../middleware/validate.js'
import { requireAuth } from '../middleware/requireAuth.js'
import {
  handleUpdateProfile,
  handleExportData,
  handleDeleteAccount,
  handleCompleteOnboarding,
} from '../controllers/userController.js'

export const usersRouter = Router()

usersRouter.use(requireAuth)
usersRouter.patch('/me', validateBody(updateProfileSchema), handleUpdateProfile)
usersRouter.post('/me/complete-onboarding', handleCompleteOnboarding)
usersRouter.get('/me/export', handleExportData)
usersRouter.delete('/me', handleDeleteAccount)
