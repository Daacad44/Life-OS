import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../repositories/gamificationRepository.js', () => ({
  getOrCreateProgress: vi.fn(),
  setProgress: vi.fn(),
  listAchievements: vi.fn(),
  unlockAchievement: vi.fn(),
}))

const repo = await import('../repositories/gamificationRepository.js')
const { award } = await import('./gamificationService.js')

beforeEach(() => {
  vi.resetAllMocks()
  vi.mocked(repo.listAchievements).mockResolvedValue([])
  vi.mocked(repo.unlockAchievement).mockResolvedValue({} as any)
})

describe('gamificationService.award', () => {
  it('adds the points for the reason on top of existing points', async () => {
    vi.mocked(repo.getOrCreateProgress).mockResolvedValue({ points: 40, level: 1 } as any)

    await award('user-1', 'task_completed')

    expect(repo.setProgress).toHaveBeenCalledWith('user-1', 50, 1)
  })

  it('levels up once points cross a 100-point boundary', async () => {
    vi.mocked(repo.getOrCreateProgress).mockResolvedValue({ points: 95, level: 1 } as any)

    await award('user-1', 'task_completed')

    expect(repo.setProgress).toHaveBeenCalledWith('user-1', 105, 2)
  })

  it('caps focus-session points at 60 minutes even if more are reported', async () => {
    vi.mocked(repo.getOrCreateProgress).mockResolvedValue({ points: 0, level: 1 } as any)

    await award('user-1', 'focus_session_minute', { minutes: 200 })

    expect(repo.setProgress).toHaveBeenCalledWith('user-1', 60, 1)
  })

  it('is a server-authoritative economy: callers cannot pass arbitrary points', async () => {
    vi.mocked(repo.getOrCreateProgress).mockResolvedValue({ points: 0, level: 1 } as any)

    await award('user-1', 'habit_checkin')

    expect(repo.setProgress).toHaveBeenCalledWith('user-1', 5, 1)
  })

  it('swallows a duplicate-achievement unlock instead of throwing', async () => {
    vi.mocked(repo.getOrCreateProgress).mockResolvedValue({ points: 0, level: 1 } as any)
    vi.mocked(repo.unlockAchievement).mockRejectedValue(new Error('unique constraint'))

    await expect(award('user-1', 'task_completed')).resolves.toBeUndefined()
  })
})
