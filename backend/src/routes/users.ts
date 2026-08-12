import { Router } from 'express'
import multer from 'multer'
import { updateProfileSchema } from '@life-os/shared'
import { validateBody } from '../middleware/validate.js'
import { requireAuth } from '../middleware/requireAuth.js'
import {
  handleUpdateProfile,
  handleExportData,
  handleDeleteAccount,
  handleCompleteOnboarding,
  handleUploadRingtone,
  handleDeleteRingtone,
} from '../controllers/userController.js'

// In-memory upload, capped at 3 MB — ringtones are short clips, not tracks.
const ringtoneUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 3 * 1024 * 1024, files: 1 },
})

export const usersRouter = Router()

usersRouter.use(requireAuth)
usersRouter.patch('/me', validateBody(updateProfileSchema), handleUpdateProfile)
usersRouter.post('/me/complete-onboarding', handleCompleteOnboarding)
usersRouter.post('/me/ringtone', ringtoneUpload.single('ringtone'), handleUploadRingtone)
usersRouter.delete('/me/ringtone', handleDeleteRingtone)
usersRouter.get('/me/export', handleExportData)
usersRouter.delete('/me', handleDeleteAccount)
