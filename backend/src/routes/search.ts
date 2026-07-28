import { Router } from 'express'
import { searchQuerySchema } from '@life-os/shared'
import { validateBody } from '../middleware/validate.js'
import { requireAuth } from '../middleware/requireAuth.js'
import { handleSearch, handleAiSearch } from '../controllers/searchController.js'

export const searchRouter = Router()
searchRouter.use(requireAuth)
searchRouter.post('/', validateBody(searchQuerySchema), handleSearch)

export const aiSearchRouter = Router()
aiSearchRouter.use(requireAuth)
aiSearchRouter.post('/', validateBody(searchQuerySchema), handleAiSearch)
