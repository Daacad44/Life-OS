import type { CreateHabitInput, HabitInsight, UpdateHabitInput } from '@life-os/shared'
import { ApiError } from '../middleware/errorHandler.js'
import { calculateStreak } from '../utils/streak.js'
import * as habitRepo from '../repositories/habitRepository.js'
import * as reminderRepo from '../repositories/reminderRepository.js'
import * as aiService from '../ai/service.js'
import * as notificationService from './notificationService.js'
import * as automationService from './automationService.js'
import * as gamificationService from './gamificationService.js'
import { habitInsightSystemPrompt, habitInsightUserPrompt } from '../ai/prompts.js'

const STREAK_MILESTONES = [7, 30, 100, 365]

function currentPeriodRange(frequency: 'DAILY' | 'WEEKLY') {
  const now = new Date()
  if (frequency === 'DAILY') {
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const end = new Date(start)
    end.setDate(end.getDate() + 1)
    return { start, end }
  }
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  start.setDate(start.getDate() - start.getDay())
  const end = new Date(start)
  end.setDate(end.getDate() + 7)
  return { start, end }
}

export function listForUser(userId: string) {
  return habitRepo.listHabits(userId)
}

export async function getOne(userId: string, id: string) {
  const habit = await habitRepo.findHabitById(userId, id)
  if (!habit) {
    throw new ApiError(404, 'NOT_FOUND', 'Habit not found')
  }
  return habit
}

export function create(userId: string, input: CreateHabitInput) {
  return habitRepo.createHabit(userId, input)
}

export async function update(userId: string, id: string, input: UpdateHabitInput) {
  const existing = await getOne(userId, id)
  const habit = await habitRepo.updateHabit(id, input)
  // If the time changed/cleared, drop queued reminders so the generator re-queues
  // at the new time instead of firing at the old one.
  if (input.timeOfDay !== undefined && input.timeOfDay !== existing.timeOfDay) {
    await reminderRepo.deleteForEntity(userId, 'habit', id)
  }
  return habit
}

export async function remove(userId: string, id: string) {
  await getOne(userId, id)
  await reminderRepo.deleteForEntity(userId, 'habit', id)
  await habitRepo.deleteHabit(id)
}

// Idempotent: a second check-in in the same period returns the existing one.
export async function checkin(userId: string, id: string) {
  const habit = await getOne(userId, id)
  const { start, end } = currentPeriodRange(habit.frequency)

  const existing = await habitRepo.findCheckinInRange(id, start, end)
  const isNewCheckin = !existing
  const record = existing ?? (await habitRepo.createCheckin(id, new Date()))

  if (isNewCheckin) {
    void automationService.runHabitCheckinTriggers(userId, id)
  }

  const allDates = await habitRepo.allCheckinDates(id)
  const streak = calculateStreak(allDates, habit.frequency)
  await habitRepo.setStreak(id, streak)

  if (isNewCheckin) {
    void gamificationService.award(userId, 'habit_checkin', { streak })
  }

  if (STREAK_MILESTONES.includes(streak)) {
    void notificationService.notify(
      userId,
      'habitMilestones',
      `🔥 ${streak}-streak on ${habit.title}`,
      `You've kept up "${habit.title}" for ${streak} ${habit.frequency === 'DAILY' ? 'days' : 'weeks'} in a row. Nice work.`,
    )
  }

  return { checkin: record, streak }
}

// AI risk/pattern insight — see Habit System.md Section 6 and AI Architecture.md.
export async function getInsight(userId: string, id: string): Promise<HabitInsight> {
  const habit = await getOne(userId, id)
  const recentCheckinDates = habit.checkins.slice(0, 14).map((c) => c.date)

  return aiService.generateJson<HabitInsight>({
    userId,
    feature: 'habit_insight',
    system: habitInsightSystemPrompt(),
    messages: [
      {
        role: 'user',
        content: habitInsightUserPrompt(
          { title: habit.title, frequency: habit.frequency, streak: habit.streak },
          recentCheckinDates,
        ),
      },
    ],
    maxTokens: 300,
  })
}
