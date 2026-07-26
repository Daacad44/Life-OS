import { randomBytes } from 'node:crypto'
import { serialize, parse } from 'cookie'
import type { Request, Response } from 'express'
import { redis } from '../config/redis.js'
import { env } from '../config/env.js'

export const SESSION_COOKIE_NAME = 'life_os_session'
const SESSION_TTL_SECONDS = 7 * 24 * 60 * 60 // 7 days

function sessionKey(token: string) {
  return `session:${token}`
}

export async function createSession(userId: string): Promise<string> {
  const token = randomBytes(32).toString('hex')
  await redis.set(sessionKey(token), userId, 'EX', SESSION_TTL_SECONDS)
  return token
}

export async function getSessionUserId(token: string): Promise<string | null> {
  return redis.get(sessionKey(token))
}

export async function destroySession(token: string): Promise<void> {
  await redis.del(sessionKey(token))
}

export function readSessionToken(req: Request): string | undefined {
  const cookies = parse(req.headers.cookie ?? '')
  return cookies[SESSION_COOKIE_NAME]
}

export function setSessionCookie(res: Response, token: string): void {
  res.setHeader(
    'Set-Cookie',
    serialize(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: SESSION_TTL_SECONDS,
    }),
  )
}

export function clearSessionCookie(res: Response): void {
  res.setHeader(
    'Set-Cookie',
    serialize(SESSION_COOKIE_NAME, '', {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    }),
  )
}
