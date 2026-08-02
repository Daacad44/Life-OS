import { Router } from 'express'
import {
  connectSchema,
  optInSchema,
  respondToConnectionSchema,
  shareGoalSchema,
} from '@life-os/shared'
import { validateBody } from '../middleware/validate.js'
import { requireAuth } from '../middleware/requireAuth.js'
import {
  handleGetOptIn,
  handleSetOptIn,
  handleListConnections,
  handleConnect,
  handleRespondToConnection,
  handleShare,
  handleFeed,
  handleReportPost,
} from '../controllers/communityController.js'

export const communityRouter = Router()

communityRouter.use(requireAuth)

communityRouter.get('/opt-in', handleGetOptIn)
communityRouter.patch('/opt-in', validateBody(optInSchema), handleSetOptIn)
communityRouter.get('/connections', handleListConnections)
communityRouter.post('/connect', validateBody(connectSchema), handleConnect)
communityRouter.patch(
  '/connect/:id',
  validateBody(respondToConnectionSchema),
  handleRespondToConnection,
)
communityRouter.post('/share', validateBody(shareGoalSchema), handleShare)
communityRouter.get('/feed', handleFeed)
communityRouter.post('/posts/:id/report', handleReportPost)
