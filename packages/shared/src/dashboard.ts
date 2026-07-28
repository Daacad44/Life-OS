import type { Task } from './task.js'
import type { Goal } from './goal.js'
import type { Habit } from './habit.js'

export interface DashboardResponse {
  todayTasks: Task[]
  overdueTasks: Task[]
  goals: Goal[]
  habits: Habit[]
}
