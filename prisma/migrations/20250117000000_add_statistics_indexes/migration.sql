-- CreateIndex for exercise statistics queries
-- Index for workout_session_exercises by exerciseId and session date
CREATE INDEX "workout_session_exercises_exerciseId_idx" ON "workout_session_exercises"("exerciseId");

-- Index for workout_sessions by userId and createdAt
CREATE INDEX "workout_sessions_userId_createdAt_idx" ON "workout_sessions"("userId", "createdAt");

-- Index for workout_sets by completed status and types array
CREATE INDEX "workout_sets_completed_idx" ON "workout_sets"("completed");

-- Composite index for efficient statistics queries
CREATE INDEX "workout_sessions_userId_createdAt_desc_idx" ON "workout_sessions"("userId", "createdAt" DESC);

-- Index for workoutSessionExerciseId lookups
CREATE INDEX "workout_sets_workoutSessionExerciseId_idx" ON "workout_sets"("workoutSessionExerciseId");