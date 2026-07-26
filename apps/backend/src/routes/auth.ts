import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { signupSchema, loginSchema } from '@life-os/shared'
import { validateBody } from '../middleware/validate.js'
import { requireAuth } from '../middleware/requireAuth.js'
import {
  handleSignup,
  handleLogin,
  handleLogout,
  handleMe,
} from '../controllers/authController.js'

export const authRouter = Router()

// Stricter limit on auth endpoints — see Security.md, Section 3.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
})

authRouter.post('/signup', authLimiter, validateBody(signupSchema), handleSignup)
authRouter.post('/login', authLimiter, validateBody(loginSchema), handleLogin)
authRouter.post('/logout', handleLogout)
authRouter.get('/me', requireAuth, handleMe)
