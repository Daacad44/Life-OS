import type { NextFunction, Request, Response } from 'express'
import type { ZodType } from 'zod'
import { ApiError } from './errorHandler.js'

declare module 'express-serve-static-core' {
  interface Request {
    // Express 5's req.query has no setter, so validated query params land here instead.
    validatedQuery?: unknown
  }
}

function validationError(error: import('zod').ZodError) {
  return new ApiError(
    400,
    'VALIDATION_ERROR',
    error.issues.map((i) => i.message).join(', '),
    error.issues,
  )
}

// Parses/validates req.body against a Zod schema, replacing it with the parsed value.
export function validateBody(schema: ZodType) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
      next(validationError(result.error))
      return
    }
    req.body = result.data
    next()
  }
}

// Parses/validates req.query, exposing the result as req.validatedQuery.
export function validateQuery(schema: ZodType) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query)
    if (!result.success) {
      next(validationError(result.error))
      return
    }
    req.validatedQuery = result.data
    next()
  }
}
