import { Router } from 'express'
import {
  createCareerGoalSchema,
  createMilestoneSchema,
  createSkillSchema,
  generateCareerPlanSchema,
  updateMilestoneSchema,
} from '@life-os/shared'
import { validateBody } from '../middleware/validate.js'
import { requireAuth } from '../middleware/requireAuth.js'
import {
  handleOverview,
  handleCreateCareerGoal,
  handleCreateSkill,
  handleCreateMilestone,
  handleUpdateMilestone,
  handleGeneratePlan,
} from '../controllers/careerController.js'

export const careerRouter = Router()

careerRouter.use(requireAuth)

careerRouter.get('/overview', handleOverview)
// Not in the PRD's literal endpoint table, but required — there's no other way
// to create the CareerGoal that skills/milestones/plan all hang off of.
careerRouter.post('/goals', validateBody(createCareerGoalSchema), handleCreateCareerGoal)
careerRouter.post('/skills', validateBody(createSkillSchema), handleCreateSkill)
careerRouter.post(
  '/milestones',
  validateBody(createMilestoneSchema),
  handleCreateMilestone,
)
careerRouter.patch(
  '/milestones/:id',
  validateBody(updateMilestoneSchema),
  handleUpdateMilestone,
)
careerRouter.post('/plan', validateBody(generateCareerPlanSchema), handleGeneratePlan)
