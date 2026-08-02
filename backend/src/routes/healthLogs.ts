import { Router } from 'express'
import { createHealthLogSchema, healthTrendsQuerySchema } from '@life-os/shared'
import { validateBody, validateQuery } from '../middleware/validate.js'
import { requireAuth } from '../middleware/requireAuth.js'
import {
  handleList,
  handleCreate,
  handleTrends,
} from '../controllers/healthLogController.js'

// Mounted at /health-metrics — /health is already the unauthenticated infra
// liveness check (see routes/health.ts), so the Health Tracker feature can't
// live at the PRD's literal /health/* path without colliding with it.
export const healthLogsRouter = Router()

healthLogsRouter.use(requireAuth)

healthLogsRouter.get('/logs', handleList)
healthLogsRouter.post('/logs', validateBody(createHealthLogSchema), handleCreate)
healthLogsRouter.get('/trends', validateQuery(healthTrendsQuerySchema), handleTrends)
