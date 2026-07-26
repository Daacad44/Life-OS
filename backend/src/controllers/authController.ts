import type { Request, Response } from 'express'
import { signup, login, toPublicUser } from '../services/authService.js'
import {
  createSession,
  destroySession,
  readSessionToken,
  setSessionCookie,
  clearSessionCookie,
} from '../services/sessionService.js'

export async function handleSignup(req: Request, res: Response) {
  const user = await signup(req.body)
  const token = await createSession(user.id)
  setSessionCookie(res, token)
  res.status(201).json({ success: true, data: toPublicUser(user) })
}

export async function handleLogin(req: Request, res: Response) {
  const user = await login(req.body)
  const token = await createSession(user.id)
  setSessionCookie(res, token)
  res.json({ success: true, data: toPublicUser(user) })
}

export async function handleLogout(req: Request, res: Response) {
  const token = readSessionToken(req)
  if (token) {
    await destroySession(token)
  }
  clearSessionCookie(res)
  res.json({ success: true, data: null })
}

export function handleMe(req: Request, res: Response) {
  res.json({ success: true, data: toPublicUser(req.user!) })
}
