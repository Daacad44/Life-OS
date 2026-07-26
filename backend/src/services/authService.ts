import type { User } from '@prisma/client'
import type { PublicUser, SignupInput, LoginInput } from '@life-os/shared'
import { ApiError } from '../middleware/errorHandler.js'
import { hashPassword, verifyPassword } from '../utils/password.js'
import { findUserByEmail, createUser } from '../repositories/userRepository.js'

export function toPublicUser(user: User): PublicUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    timezone: user.timezone,
    createdAt: user.createdAt.toISOString(),
  }
}

export async function signup(input: SignupInput): Promise<User> {
  const existing = await findUserByEmail(input.email)
  if (existing) {
    throw new ApiError(409, 'EMAIL_TAKEN', 'An account with this email already exists')
  }

  const passwordHash = await hashPassword(input.password)
  return createUser({ email: input.email, name: input.name, passwordHash })
}

export async function login(input: LoginInput): Promise<User> {
  const user = await findUserByEmail(input.email)
  if (!user?.passwordHash) {
    throw new ApiError(401, 'INVALID_CREDENTIALS', 'Incorrect email or password')
  }

  const valid = await verifyPassword(input.password, user.passwordHash)
  if (!valid) {
    throw new ApiError(401, 'INVALID_CREDENTIALS', 'Incorrect email or password')
  }

  return user
}
