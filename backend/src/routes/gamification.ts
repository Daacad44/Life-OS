import { Router } from 'express'
import { requireAuth } from '../middleware/requireAuth.js'
import {
  handleProfile,
  handleAchievements,
} from '../controllers/gamificationController.js'

export const gamificationRouter = Router()

gamificationRouter.use(requireAuth)

gamificationRouter.get('/profile', handleProfile)
gamificationRouter.get('/achievements', handleAchievements)
