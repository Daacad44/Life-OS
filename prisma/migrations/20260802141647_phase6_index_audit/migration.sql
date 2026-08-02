-- CreateIndex
CREATE INDEX "CommunityPost_userId_idx" ON "CommunityPost"("userId");

-- CreateIndex
CREATE INDEX "HabitCheckin_habitId_date_idx" ON "HabitCheckin"("habitId", "date");

-- CreateIndex
CREATE INDEX "StudySession_subjectId_idx" ON "StudySession"("subjectId");

-- CreateIndex
CREATE INDEX "SubGoal_goalId_idx" ON "SubGoal"("goalId");
