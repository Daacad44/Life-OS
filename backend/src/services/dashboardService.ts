import * as plannerService from './plannerService.js'
import * as goalService from './goalService.js'
import * as habitService from './habitService.js'

function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

// Aggregates existing features — no new tables, per Dashboard.md, Section 7.
export async function getDashboard(userId: string) {
  const [plan, goals, habits] = await Promise.all([
    plannerService.getPlanForDate(userId, todayStr()),
    goalService.listForUser(userId),
    habitService.listForUser(userId),
  ])

  return {
    todayTasks: plan.tasks,
    overdueTasks: plan.overdue,
    goals,
    habits,
  }
}
