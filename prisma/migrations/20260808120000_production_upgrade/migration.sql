-- Production upgrade: audible-alarm settings, reminder ack/offset, recurring
-- tasks + subtasks + tags, goal/sub-goal timing, habit time-of-day, note folders.

-- User: audible-alarm settings (Global Requirement A)
ALTER TABLE "User"
  ADD COLUMN "soundEnabled" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN "alarmSound"   TEXT    NOT NULL DEFAULT 'chime',
  ADD COLUMN "alarmVolume"  INTEGER NOT NULL DEFAULT 70;

-- Reminder: on-screen alarm acknowledgement + offset label
ALTER TABLE "Reminder"
  ADD COLUMN "offsetLabel"    TEXT,
  ADD COLUMN "acknowledgedAt" TIMESTAMP(3);
CREATE INDEX "Reminder_userId_acknowledgedAt_idx" ON "Reminder"("userId", "acknowledgedAt");

-- Task: tags + link to recurring template
ALTER TABLE "Task"
  ADD COLUMN "tags"            TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN "recurringTaskId" TEXT;
CREATE INDEX "Task_recurringTaskId_idx" ON "Task"("recurringTaskId");

-- Subtask
CREATE TABLE "Subtask" (
    "id"        TEXT NOT NULL,
    "taskId"    TEXT NOT NULL,
    "title"     TEXT NOT NULL,
    "done"      BOOLEAN NOT NULL DEFAULT false,
    "order"     INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Subtask_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "Subtask_taskId_idx" ON "Subtask"("taskId");

-- RecurringTask
CREATE TABLE "RecurringTask" (
    "id"                    TEXT NOT NULL,
    "userId"                TEXT NOT NULL,
    "title"                 TEXT NOT NULL,
    "description"           TEXT,
    "priority"              "Priority" NOT NULL DEFAULT 'MEDIUM',
    "tags"                  TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "goalId"                TEXT,
    "freq"                  TEXT NOT NULL,
    "interval"              INTEGER NOT NULL DEFAULT 1,
    "byWeekday"             INTEGER[] NOT NULL DEFAULT ARRAY[]::INTEGER[],
    "timeOfDay"             TEXT NOT NULL,
    "reminderMinutesBefore" INTEGER,
    "startDate"             TIMESTAMP(3) NOT NULL,
    "endDate"              TIMESTAMP(3),
    "active"                BOOLEAN NOT NULL DEFAULT true,
    "lastGeneratedFor"      TIMESTAMP(3),
    "createdAt"             TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"             TIMESTAMP(3) NOT NULL,
    CONSTRAINT "RecurringTask_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "RecurringTask_userId_idx" ON "RecurringTask"("userId");
CREATE INDEX "RecurringTask_active_idx" ON "RecurringTask"("active");

-- Goal / SubGoal timing
ALTER TABLE "Goal"    ADD COLUMN "startDate" TIMESTAMP(3);
ALTER TABLE "SubGoal" ADD COLUMN "dueDate"   TIMESTAMP(3);

-- Habit time-of-day
ALTER TABLE "Habit" ADD COLUMN "timeOfDay" TEXT;

-- Note folders
ALTER TABLE "Note" ADD COLUMN "folder" TEXT;

-- Foreign keys
ALTER TABLE "Task" ADD CONSTRAINT "Task_recurringTaskId_fkey"
  FOREIGN KEY ("recurringTaskId") REFERENCES "RecurringTask"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Subtask" ADD CONSTRAINT "Subtask_taskId_fkey"
  FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "RecurringTask" ADD CONSTRAINT "RecurringTask_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
