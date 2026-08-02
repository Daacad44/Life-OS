import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ApiError } from '../middleware/errorHandler.js'

vi.mock('../repositories/userRepository.js', () => ({
  findUserByEmail: vi.fn(),
  createUser: vi.fn(),
}))
vi.mock('../utils/password.js', () => ({
  hashPassword: vi.fn(),
  verifyPassword: vi.fn(),
}))

const userRepo = await import('../repositories/userRepository.js')
const password = await import('../utils/password.js')
const { signup, login } = await import('./authService.js')

const baseUser = {
  id: 'user-1',
  email: 'a@b.com',
  name: 'A',
  role: 'USER',
  timezone: 'UTC',
  passwordHash: 'hashed',
  createdAt: new Date(),
  updatedAt: new Date(),
  communityOptIn: false,
} as any

beforeEach(() => {
  vi.resetAllMocks()
})

describe('authService.signup', () => {
  it('rejects an email that is already taken', async () => {
    vi.mocked(userRepo.findUserByEmail).mockResolvedValue(baseUser)

    await expect(
      signup({ email: 'a@b.com', password: 'password123', name: 'A' }),
    ).rejects.toMatchObject({
      status: 409,
      code: 'EMAIL_TAKEN',
    } satisfies Partial<ApiError>)
    expect(userRepo.createUser).not.toHaveBeenCalled()
  })

  it('hashes the password and creates the user when the email is free', async () => {
    vi.mocked(userRepo.findUserByEmail).mockResolvedValue(null)
    vi.mocked(password.hashPassword).mockResolvedValue('hashed-pw')
    vi.mocked(userRepo.createUser).mockResolvedValue(baseUser)

    const result = await signup({ email: 'a@b.com', password: 'password123', name: 'A' })

    expect(password.hashPassword).toHaveBeenCalledWith('password123')
    expect(userRepo.createUser).toHaveBeenCalledWith({
      email: 'a@b.com',
      name: 'A',
      passwordHash: 'hashed-pw',
    })
    expect(result).toBe(baseUser)
  })
})

describe('authService.login', () => {
  it('rejects an unknown email without leaking whether the account exists', async () => {
    vi.mocked(userRepo.findUserByEmail).mockResolvedValue(null)

    await expect(login({ email: 'nobody@b.com', password: 'x' })).rejects.toMatchObject({
      status: 401,
      code: 'INVALID_CREDENTIALS',
    })
  })

  it('rejects a wrong password', async () => {
    vi.mocked(userRepo.findUserByEmail).mockResolvedValue(baseUser)
    vi.mocked(password.verifyPassword).mockResolvedValue(false)

    await expect(login({ email: 'a@b.com', password: 'wrong' })).rejects.toMatchObject({
      status: 401,
      code: 'INVALID_CREDENTIALS',
    })
  })

  it('returns the user on correct credentials', async () => {
    vi.mocked(userRepo.findUserByEmail).mockResolvedValue(baseUser)
    vi.mocked(password.verifyPassword).mockResolvedValue(true)

    const result = await login({ email: 'a@b.com', password: 'password123' })
    expect(result).toBe(baseUser)
  })
})
