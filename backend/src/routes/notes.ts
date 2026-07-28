import { Router } from 'express'
import { createNoteSchema, listNotesQuerySchema, updateNoteSchema } from '@life-os/shared'
import { validateBody, validateQuery } from '../middleware/validate.js'
import { requireAuth } from '../middleware/requireAuth.js'
import {
  handleList,
  handleGetOne,
  handleCreate,
  handleUpdate,
  handleDelete,
} from '../controllers/noteController.js'

export const notesRouter = Router()

notesRouter.use(requireAuth)

notesRouter.get('/', validateQuery(listNotesQuerySchema), handleList)
notesRouter.post('/', validateBody(createNoteSchema), handleCreate)
notesRouter.get('/:id', handleGetOne)
notesRouter.patch('/:id', validateBody(updateNoteSchema), handleUpdate)
notesRouter.delete('/:id', handleDelete)
