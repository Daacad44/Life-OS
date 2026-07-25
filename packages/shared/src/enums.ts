// Mirrors the Prisma enums in prisma/schema.prisma — see docs/.../03-Architecture/Database.md
export const TaskStatus = ['TODO', 'IN_PROGRESS', 'DONE'] as const
export type TaskStatus = (typeof TaskStatus)[number]

export const Priority = ['LOW', 'MEDIUM', 'HIGH'] as const
export type Priority = (typeof Priority)[number]

export const HabitFrequency = ['DAILY', 'WEEKLY'] as const
export type HabitFrequency = (typeof HabitFrequency)[number]
