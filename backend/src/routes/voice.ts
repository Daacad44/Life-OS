import { Router } from 'express'
import { sendVoiceCommandSchema } from '@life-os/shared'
import { validateBody } from '../middleware/validate.js'
import { requireAuth } from '../middleware/requireAuth.js'
import { handleCommand } from '../controllers/voiceController.js'

// No POST /voice/transcribe — see voiceService.ts's note on why transcription
// happens client-side instead.
export const voiceRouter = Router()

voiceRouter.use(requireAuth)

voiceRouter.post('/command', validateBody(sendVoiceCommandSchema), handleCommand)
