import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../repositories/automationRepository.js', () => ({
  findEnabledByTrigger: vi.fn(),
  recordRun: vi.fn(),
}))
vi.mock('../repositories/taskRepository.js', () => ({
  createTask: vi.fn(),
}))
vi.mock('./notificationService.js', () => ({
  notify: vi.fn(),
}))

const automationRepo = await import('../repositories/automationRepository.js')
const taskRepo = await import('../repositories/taskRepository.js')
const notificationService = await import('./notificationService.js')
const { runGoalProgressTriggers, runHabitCheckinTriggers } =
  await import('./automationService.js')

function goalAutomation(overrides: Partial<Record<string, unknown>> = {}) {
  return {
    id: 'auto-1',
    userId: 'user-1',
    trigger: 'goal_progress',
    triggerConfig: { goalId: 'goal-1', threshold: 100 },
    action: 'create_task',
    actionConfig: { title: 'Celebrate' },
    enabled: true,
    lastRunAt: null,
    ...overrides,
  } as any
}

beforeEach(() => {
  vi.resetAllMocks()
  vi.mocked(automationRepo.recordRun).mockResolvedValue(undefined as any)
  vi.mocked(taskRepo.createTask).mockResolvedValue({} as any)
  vi.mocked(notificationService.notify).mockResolvedValue(undefined as any)
})

describe('automationService.runGoalProgressTriggers — fires at most once', () => {
  it('does not fire an automation that has already run (lastRunAt set)', async () => {
    vi.mocked(automationRepo.findEnabledByTrigger).mockResolvedValue([
      goalAutomation({ lastRunAt: new Date() }),
    ])

    await runGoalProgressTriggers('user-1', 'goal-1', 100)

    expect(taskRepo.createTask).not.toHaveBeenCalled()
  })

  it('does not fire below the configured threshold', async () => {
    vi.mocked(automationRepo.findEnabledByTrigger).mockResolvedValue([goalAutomation()])

    await runGoalProgressTriggers('user-1', 'goal-1', 40)

    expect(taskRepo.createTask).not.toHaveBeenCalled()
  })

  it('does not fire for a different goal', async () => {
    vi.mocked(automationRepo.findEnabledByTrigger).mockResolvedValue([goalAutomation()])

    await runGoalProgressTriggers('user-1', 'some-other-goal', 100)

    expect(taskRepo.createTask).not.toHaveBeenCalled()
  })

  it('fires exactly once when progress first reaches the threshold', async () => {
    vi.mocked(automationRepo.findEnabledByTrigger).mockResolvedValue([goalAutomation()])

    await runGoalProgressTriggers('user-1', 'goal-1', 100)

    await vi.waitFor(() => {
      expect(taskRepo.createTask).toHaveBeenCalledWith('user-1', { title: 'Celebrate' })
      expect(automationRepo.recordRun).toHaveBeenCalledWith('auto-1', true, null)
    })
  })
})

describe('automationService.runHabitCheckinTriggers', () => {
  it('only fires automations configured for the checked-in habit', async () => {
    vi.mocked(automationRepo.findEnabledByTrigger).mockResolvedValue([
      goalAutomation({
        id: 'auto-2',
        trigger: 'habit_checkin',
        triggerConfig: { habitId: 'habit-1' },
        action: 'notify',
        actionConfig: { message: 'Nice streak' },
      }),
    ])

    await runHabitCheckinTriggers('user-1', 'habit-other')
    expect(notificationService.notify).not.toHaveBeenCalled()

    await runHabitCheckinTriggers('user-1', 'habit-1')
    await vi.waitFor(() => {
      expect(notificationService.notify).toHaveBeenCalledWith(
        'user-1',
        'automationRan',
        'Automation ran',
        'Nice streak',
      )
    })
  })
})
