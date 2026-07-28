import type { Goal, Habit, Task } from '@prisma/client'

interface CoachContext {
  todayTasks: Task[]
  overdueTasks: Task[]
  goals: Goal[]
  habits: Habit[]
  memories: { content: string }[]
}

export function coachSystemPrompt(): string {
  return [
    'You are the AI Personal Coach inside Life OS, a personal productivity and growth app.',
    "You read the user's real tasks, goals, habits, and what you remember about them, then coach them: guidance, encouragement, planning, and kind accountability.",
    'Be warm, direct, and specific — reference their actual data instead of speaking generically.',
    'You only suggest; the user stays in control. Keep responses concise (a few short paragraphs at most) unless asked for more detail.',
  ].join(' ')
}

export function formatCoachContext(ctx: CoachContext): string {
  const lines: string[] = []
  lines.push(
    `Today's tasks (${ctx.todayTasks.length}): ${ctx.todayTasks.map((t) => t.title).join(', ') || 'none'}`,
  )
  if (ctx.overdueTasks.length > 0) {
    lines.push(`Overdue tasks: ${ctx.overdueTasks.map((t) => t.title).join(', ')}`)
  }
  lines.push(
    `Active goals: ${ctx.goals.map((g) => `${g.title} (${g.progress}%)`).join(', ') || 'none'}`,
  )
  lines.push(
    `Habits: ${ctx.habits.map((h) => `${h.title} (streak ${h.streak})`).join(', ') || 'none'}`,
  )
  if (ctx.memories.length > 0) {
    lines.push('What you remember about this user:')
    for (const memory of ctx.memories) lines.push(`- ${memory.content}`)
  }
  return lines.join('\n')
}

export function goalBreakdownSystemPrompt(): string {
  return [
    'You are an expert productivity coach helping break a goal into an actionable plan.',
    'Given a goal, propose concrete sub-goals (milestones) and specific first tasks the user can start this week.',
    'Respond with ONLY JSON in this exact shape: {"subGoals": string[], "firstTasks": string[], "advice": string}',
    '- subGoals: 3-5 concrete, achievable milestones',
    '- firstTasks: 2-4 specific, actionable tasks for this week',
    '- advice: one short, encouraging sentence of next-action guidance',
  ].join('\n')
}

export function goalBreakdownUserPrompt(goal: {
  title: string
  description: string | null
  targetDate: Date | null
}): string {
  const lines = [`Goal: ${goal.title}`]
  if (goal.description) lines.push(`Description: ${goal.description}`)
  if (goal.targetDate)
    lines.push(`Target date: ${goal.targetDate.toISOString().slice(0, 10)}`)
  return lines.join('\n')
}

export function habitInsightSystemPrompt(): string {
  return [
    "You analyze a user's habit check-in history to assess risk and offer a short nudge.",
    'Respond with ONLY JSON in this exact shape: {"atRisk": boolean, "message": string}',
    '- atRisk: true if the streak looks likely to break (current period not yet checked in, or a pattern of recent misses)',
    '- message: one short, encouraging or nudging sentence (max 2 sentences), speaking directly to the user',
  ].join('\n')
}

export function habitInsightUserPrompt(
  habit: { title: string; frequency: string; streak: number },
  recentCheckinDates: Date[],
): string {
  return [
    `Habit: ${habit.title} (${habit.frequency})`,
    `Current streak: ${habit.streak}`,
    `Recent check-in dates: ${recentCheckinDates.map((d) => d.toISOString().slice(0, 10)).join(', ') || 'none yet'}`,
  ].join('\n')
}

export function reflectionPromptSystemPrompt(period: 'daily' | 'weekly'): string {
  return period === 'daily'
    ? 'Generate one short, warm, thoughtful daily reflection question for the user based on their day. Return ONLY the question text — no preamble, no quotes.'
    : "Generate one short, warm, thoughtful weekly reflection question reviewing the user's week. Return ONLY the question text — no preamble, no quotes."
}

export function reflectionPromptUserPrompt(ctx: {
  tasksDone: number
  totalTasks: number
  goalsInProgress: number
  habitsOnStreak: number
}): string {
  return [
    `Tasks completed today: ${ctx.tasksDone}/${ctx.totalTasks}`,
    `Active goals: ${ctx.goalsInProgress}`,
    `Habits currently on a streak: ${ctx.habitsOnStreak}`,
  ].join('\n')
}

export function reflectionInsightSystemPrompt(): string {
  return [
    'You are a supportive reflection companion. The user just answered a reflection prompt.',
    'Respond with ONLY JSON in this exact shape: {"insights": string, "memoryFacts": string[]}',
    '- insights: a short (2-3 sentence), warm, supportive reflection on what they wrote — acknowledge it and offer one gentle observation or encouragement',
    '- memoryFacts: 0-3 short, durable facts or preferences worth remembering long-term (e.g. "Prefers working out in the morning"). Empty array if nothing durable stands out.',
  ].join('\n')
}

export function reflectionInsightUserPrompt(prompt: string, answer: string): string {
  return `Reflection prompt: ${prompt}\nUser's answer: ${answer}`
}

export function memoryExtractionSystemPrompt(): string {
  return [
    'Extract any new durable facts, preferences, or important context about the user from this conversation exchange, suitable for long-term memory.',
    'Respond with ONLY JSON in this exact shape: {"facts": string[]}',
    '- Only include genuinely durable, reusable facts (goals, preferences, life details, recurring patterns) — not one-off logistics.',
    '- Return an empty array if nothing durable was shared.',
  ].join('\n')
}

export function memoryExtractionUserPrompt(
  userMessage: string,
  assistantReply: string,
): string {
  return `User: ${userMessage}\nCoach: ${assistantReply}`
}

export function weeklyReviewSystemPrompt(): string {
  return [
    "You are reviewing a user's week for Life OS, an AI-powered personal operating system.",
    'Write an honest, encouraging weekly review from their real stats.',
    'Respond with ONLY JSON in this exact shape: {"summary": string, "wins": string[], "focusAreas": string[], "nextWeekPlan": string}',
    '- summary: 2-3 sentences on how the week went overall',
    '- wins: 1-4 short, specific things worth celebrating (empty array if genuinely none)',
    '- focusAreas: 1-3 short, specific things that need attention next week',
    '- nextWeekPlan: 1-2 sentences suggesting priorities for next week',
    'If the week was sparse (little data), keep it concise and still encouraging — do not invent detail that is not in the stats.',
  ].join('\n')
}

export function weeklyReviewUserPrompt(stats: {
  tasksCompleted: number
  tasksCreated: number
  habitConsistency: { title: string; ratio: number }[]
  goals: { title: string; progress: number }[]
  reflectionsLogged: number
}): string {
  const lines = [
    `Tasks completed this week: ${stats.tasksCompleted}`,
    `Tasks created this week: ${stats.tasksCreated}`,
    `Habit consistency: ${
      stats.habitConsistency
        .map((h) => `${h.title} (${Math.round(h.ratio * 100)}%)`)
        .join(', ') || 'no habits tracked'
    }`,
    `Active goals: ${stats.goals.map((g) => `${g.title} (${g.progress}%)`).join(', ') || 'none'}`,
    `Reflections logged: ${stats.reflectionsLogged}`,
  ]
  return lines.join('\n')
}

export function analyticsInsightsSystemPrompt(): string {
  return [
    "You interpret a user's productivity analytics for Life OS.",
    'Respond with ONLY JSON in this exact shape: {"insights": string[]}',
    '- 1-4 short, specific, plain-language observations or suggestions grounded ONLY in the given numbers',
    '- Do not invent patterns not supported by the data. If the data is too sparse to say anything meaningful, return a single encouraging "keep going" style insight instead.',
  ].join('\n')
}

export function analyticsInsightsUserPrompt(overview: {
  range: string
  tasksCompleted: number
  tasksCreated: number
  taskCompletionRate: number
  habits: { title: string; checkins: number; expected: number }[]
  goals: { title: string; progress: number }[]
  notesCreated: number
  focusMinutes: number
  focusSessions: number
  reflectionsLogged: number
}): string {
  return [
    `Range: last 1 ${overview.range}`,
    `Tasks: ${overview.tasksCompleted} completed / ${overview.tasksCreated} created (${Math.round(overview.taskCompletionRate * 100)}% completion rate)`,
    `Habits: ${
      overview.habits
        .map((h) => `${h.title} ${h.checkins}/${h.expected} check-ins`)
        .join(', ') || 'none tracked'
    }`,
    `Goals: ${overview.goals.map((g) => `${g.title} at ${g.progress}%`).join(', ') || 'none active'}`,
    `Notes created: ${overview.notesCreated}`,
    `Focus time: ${overview.focusMinutes} minutes across ${overview.focusSessions} sessions`,
    `Reflections logged: ${overview.reflectionsLogged}`,
  ].join('\n')
}
