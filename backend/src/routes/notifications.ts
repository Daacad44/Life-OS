import { Router } from 'express'
import { updateNotificationPreferencesSchema } from '@life-os/shared'
import { validateBody } from '../middleware/validate.js'
import { requireAuth } from '../middleware/requireAuth.js'
import {
  handleList,
  handleMarkRead,
  handleMarkAllRead,
  handleGetPreferences,
  handleUpdatePreferences,
} from '../controllers/notificationController.js'

export const notificationsRouter = Router()

notificationsRouter.use(requireAuth)

notificationsRouter.get('/', handleList)
notificationsRouter.get('/preferences', handleGetPreferences)
notificationsRouter.patch(
  '/preferences',
  validateBody(updateNotificationPreferencesSchema),
  handleUpdatePreferences,
)
notificationsRouter.patch('/read-all', handleMarkAllRead)
notificationsRouter.patch('/:id/read', handleMarkRead)
