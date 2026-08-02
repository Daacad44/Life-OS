import { Router } from 'express'
import { requireAuth } from '../middleware/requireAuth.js'
import {
  handleList,
  handleAccept,
  handleDismiss,
} from '../controllers/recommendationController.js'

export const recommendationsRouter = Router()

recommendationsRouter.use(requireAuth)

recommendationsRouter.get('/', handleList)
recommendationsRouter.post('/:id/accept', handleAccept)
recommendationsRouter.post('/:id/dismiss', handleDismiss)
