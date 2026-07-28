import { Router } from 'express'
import { analyticsRangeQuerySchema } from '@life-os/shared'
import { validateQuery } from '../middleware/validate.js'
import { requireAuth } from '../middleware/requireAuth.js'
import { handleOverview, handleInsights } from '../controllers/analyticsController.js'

export const analyticsRouter = Router()

analyticsRouter.use(requireAuth)

analyticsRouter.get('/overview', validateQuery(analyticsRangeQuerySchema), handleOverview)
analyticsRouter.get('/insights', validateQuery(analyticsRangeQuerySchema), handleInsights)
