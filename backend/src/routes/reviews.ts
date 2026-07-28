import { Router } from 'express'
import { requireAuth } from '../middleware/requireAuth.js'
import {
  handleCurrent,
  handleGenerate,
  handleList,
} from '../controllers/weeklyReviewController.js'

export const reviewsRouter = Router()

reviewsRouter.use(requireAuth)

reviewsRouter.get('/', handleList)
reviewsRouter.get('/weekly', handleCurrent)
reviewsRouter.post('/weekly/generate', handleGenerate)
