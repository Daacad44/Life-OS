import type { CreateHabitInput, HabitInsight, UpdateHabitInput } from '@life-os/shared'
import { ApiError } from '../middleware/errorHandler.js'
import { calculateStreak } from '../utils/streak.js'
import * as habitRepo from '../repositories/habitRepository.js'
import * as aiService from '../ai/service.js'
import { habitInsightSystemPrompt, habitInsightUserPrompt } from '../ai/prompts.js'

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
  await getOne(userId, id)
  return habitRepo.updateHabit(id, input)
}

export async function remove(userId: string, id: string) {
  await getOne(userId, id)
  await habitRepo.deleteHabit(id)
}

// Idempotent: a second check-in in the same period returns the existing one.
export async function checkin(userId: string, id: string) {
  const habit = await getOne(userId, id)
  const { start, end } = currentPeriodRange(habit.frequency)

  const existing = await habitRepo.findCheckinInRange(id, start, end)
  const record = existing ?? (await habitRepo.createCheckin(id, new Date()))

  const allDates = await habitRepo.allCheckinDates(id)
  const streak = calculateStreak(allDates, habit.frequency)
  await habitRepo.setStreak(id, streak)

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
