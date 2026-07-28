import { Router } from 'express'
import { endFocusSessionSchema, startFocusSessionSchema } from '@life-os/shared'
import { validateBody } from '../middleware/validate.js'
import { requireAuth } from '../middleware/requireAuth.js'
import { handleStart, handleEnd, handleList } from '../controllers/focusController.js'

export const focusRouter = Router()

focusRouter.use(requireAuth)

focusRouter.post('/start', validateBody(startFocusSessionSchema), handleStart)
focusRouter.post('/end', validateBody(endFocusSessionSchema), handleEnd)
focusRouter.get('/sessions', handleList)
