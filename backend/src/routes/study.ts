import { Router } from 'express'
import {
  createStudySessionSchema,
  createSubjectSchema,
  generateStudyPlanSchema,
  updateStudySessionSchema,
} from '@life-os/shared'
import { validateBody } from '../middleware/validate.js'
import { requireAuth } from '../middleware/requireAuth.js'
import {
  handleListSubjects,
  handleCreateSubject,
  handleCreateSession,
  handleUpdateSession,
  handleDeleteSubject,
  handleDeleteSession,
  handleGeneratePlan,
} from '../controllers/studyController.js'

export const studyRouter = Router()

studyRouter.use(requireAuth)

studyRouter.get('/subjects', handleListSubjects)
studyRouter.post('/subjects', validateBody(createSubjectSchema), handleCreateSubject)
studyRouter.post('/sessions', validateBody(createStudySessionSchema), handleCreateSession)
studyRouter.patch(
  '/sessions/:id',
  validateBody(updateStudySessionSchema),
  handleUpdateSession,
)
studyRouter.delete('/subjects/:id', handleDeleteSubject)
studyRouter.delete('/sessions/:id', handleDeleteSession)
studyRouter.post('/plan', validateBody(generateStudyPlanSchema), handleGeneratePlan)
