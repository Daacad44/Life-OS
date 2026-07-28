-- AlterTable
ALTER TABLE "CalendarEvent" ADD COLUMN     "allDay" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "CalendarEvent_startTime_idx" ON "CalendarEvent"("startTime");
