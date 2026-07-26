import type { NextFunction, Request, Response } from 'express'
import type { ZodType } from 'zod'
import { ApiError } from './errorHandler.js'

// Parses/validates req.body against a Zod schema, replacing it with the parsed value.
export function validateBody(schema: ZodType) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
      next(
        new ApiError(
          400,
          'VALIDATION_ERROR',
          result.error.issues.map((i) => i.message).join(', '),
          result.error.issues,
        ),
      )
      return
    }
    req.body = result.data
    next()
  }
}
