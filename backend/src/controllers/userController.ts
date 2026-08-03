import type { Request, Response } from 'express'
import { prisma } from '../config/db.js'
import { updateUser } from '../repositories/userRepository.js'
import { toPublicUser } from '../services/authService.js'
import {
  readSessionToken,
  destroySession,
  clearSessionCookie,
} from '../services/sessionService.js'

export async function handleUpdateProfile(req: Request, res: Response) {
  const user = await updateUser(req.user!.id, req.body)
  res.json({ success: true, data: toPublicUser(user) })
}

// First-run wizard completion — see UX.md Section 4. Idempotent: re-calling
// just refreshes the timestamp rather than erroring.
export async function handleCompleteOnboarding(req: Request, res: Response) {
  const user = await updateUser(req.user!.id, { onboardedAt: new Date() })
  res.json({ success: true, data: toPublicUser(user) })
}

// Data Rights & Compliance — see docs/.../03-Architecture/Security.md, Section 9.
export async function handleExportData(req: Request, res: Response) {
  const data = await prisma.user.findUnique({
    where: { id: req.user!.id },
    omit: { passwordHash: true },
    include: {
      tasks: true,
      goals: { include: { subGoals: true } },
      habits: { include: { checkins: true } },
      events: true,
      notes: true,
      notifications: true,
      memories: true,
    },
  })
  res.json({ success: true, data })
}

export async function handleDeleteAccount(req: Request, res: Response) {
  const token = readSessionToken(req)
  if (token) {
    await destroySession(token)
  }
  await prisma.user.delete({ where: { id: req.user!.id } })
  clearSessionCookie(res)
  res.json({ success: true, data: null })
}
