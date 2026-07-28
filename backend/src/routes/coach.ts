import { Router } from 'express'
import { sendCoachMessageSchema } from '@life-os/shared'
import { validateBody } from '../middleware/validate.js'
import { requireAuth } from '../middleware/requireAuth.js'
import { handleHistory, handleSendMessage } from '../controllers/coachController.js'

export const coachRouter = Router()

coachRouter.use(requireAuth)

coachRouter.get('/history', handleHistory)
coachRouter.post('/', validateBody(sendCoachMessageSchema), handleSendMessage)
