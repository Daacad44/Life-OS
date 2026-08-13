import type { Request, Response } from 'express'
import { prisma } from '../config/db.js'
import { updateUser } from '../repositories/userRepository.js'
import { toPublicUser } from '../services/authService.js'
import {
  readSessionToken,
  destroySession,
  clearSessionCookie,
} from '../services/sessionService.js'
import { isStorageConfigured, uploadObject } from '../services/storageService.js'

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

// Custom alarm ringtone (Global Requirement A). Accepts a single MP3 (≤3 MB),
// stores it in object storage, and points the user's customRingtoneUrl at it.
export async function handleUploadRingtone(req: Request, res: Response) {
  if (!isStorageConfigured()) {
    return res.status(501).json({
      success: false,
      error: 'Ringtone upload is not configured on this server.',
    })
  }
  const file = req.file
  if (!file) {
    return res.status(400).json({ success: false, error: 'No file uploaded.' })
  }
  const okType =
    file.mimetype === 'audio/mpeg' || file.originalname.toLowerCase().endsWith('.mp3')
  if (!okType) {
    return res.status(400).json({ success: false, error: 'Ringtone must be an MP3.' })
  }
  const { url } = await uploadObject('ringtones', file.buffer, 'audio/mpeg', 'mp3')
  const user = await updateUser(req.user!.id, { customRingtoneUrl: url })
  res.json({ success: true, data: toPublicUser(user) })
}

// Clear the custom ringtone, reverting the user to their chosen preset chime.
export async function handleDeleteRingtone(req: Request, res: Response) {
  const user = await updateUser(req.user!.id, { customRingtoneUrl: null })
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
