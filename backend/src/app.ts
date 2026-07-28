import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'

import { env } from './config/env.js'
import { healthRouter } from './routes/health.js'
import { authRouter } from './routes/auth.js'
import { usersRouter } from './routes/users.js'
import { tasksRouter } from './routes/tasks.js'
import { plannerRouter } from './routes/planner.js'
import { goalsRouter } from './routes/goals.js'
import { eventsRouter } from './routes/events.js'
import { habitsRouter } from './routes/habits.js'
import { dashboardRouter } from './routes/dashboard.js'
import { memoryRouter } from './routes/memory.js'
import { coachRouter } from './routes/coach.js'
import { reflectionsRouter } from './routes/reflections.js'
import { notesRouter } from './routes/notes.js'
import { searchRouter, aiSearchRouter } from './routes/search.js'
import { reviewsRouter } from './routes/reviews.js'
import { analyticsRouter } from './routes/analytics.js'
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
v1.use('/planner', plannerRouter)
v1.use('/goals', goalsRouter)
v1.use('/events', eventsRouter)
v1.use('/habits', habitsRouter)
v1.use('/dashboard', dashboardRouter)
v1.use('/memory', memoryRouter)
v1.use('/ai/coach', coachRouter)
v1.use('/reflections', reflectionsRouter)
v1.use('/notes', notesRouter)
v1.use('/search', searchRouter)
v1.use('/ai/search', aiSearchRouter)
v1.use('/reviews', reviewsRouter)
v1.use('/analytics', analyticsRouter)
app.use('/v1', v1)

app.use(notFoundHandler)
app.use(errorHandler)

if (process.env.NODE_ENV !== 'test') {
  app.listen(env.PORT, () => {
    console.log(`Life OS API listening on http://localhost:${env.PORT}`)
  })
}
