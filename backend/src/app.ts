import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'

import { env } from './config/env.js'
import { healthRouter } from './routes/health.js'
import { authRouter } from './routes/auth.js'
import { usersRouter } from './routes/users.js'
import { tasksRouter } from './routes/tasks.js'
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js'

export const app = express()

app.use(helmet())
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }))
app.use(express.json())
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: true,
    legacyHeaders: false,
  }),
)

// Infra-level health check (not versioned — used by load balancers/Coolify)
app.use('/health', healthRouter)

// Versioned API surface. Feature routers (tasks, goals, habits, ai, ...)
// mount here as they're built — see docs/.../03-Architecture/API.md
const v1 = express.Router()
v1.use('/health', healthRouter)
v1.use('/auth', authRouter)
v1.use('/users', usersRouter)
v1.use('/tasks', tasksRouter)
app.use('/v1', v1)

app.use(notFoundHandler)
app.use(errorHandler)

if (process.env.NODE_ENV !== 'test') {
  app.listen(env.PORT, () => {
    console.log(`Life OS API listening on http://localhost:${env.PORT}`)
  })
}
