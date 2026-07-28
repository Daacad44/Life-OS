export interface WeeklyReview {
  id: string
  userId: string
  weekStart: string
  summary: string
  wins: string[]
  focusAreas: string[]
  nextWeekPlan: string | null
  createdAt: string
  updatedAt: string
}
