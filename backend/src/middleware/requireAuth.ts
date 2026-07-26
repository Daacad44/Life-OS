import type { NextFunction, Request, Response } from 'express'
import type { User } from '@prisma/client'
import { readSessionToken, getSessionUserId } from '../services/sessionService.js'
import { findUserById } from '../repositories/userRepository.js'
import { ApiError } from './errorHandler.js'

declare module 'express-serve-static-core' {
  interface Request {
    user?: User
  }
}

export async function requireAuth(req: Request, _res: Response, next: NextFunction) {
  try {
    const token = readSessionToken(req)
    const userId = token ? await getSessionUserId(token) : null
    if (!userId) {
      throw new ApiError(401, 'UNAUTHORIZED', 'Authentication required')
    }

    const user = await findUserById(userId)
    if (!user) {
      throw new ApiError(401, 'UNAUTHORIZED', 'Authentication required')
    }

    req.user = user
    next()
  } catch (err) {
    next(err)
  }
}

export function requireRole(...roles: User['role'][]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      next(new ApiError(403, 'FORBIDDEN', 'You do not have access to this resource'))
      return
    }
    next()
  }
}
