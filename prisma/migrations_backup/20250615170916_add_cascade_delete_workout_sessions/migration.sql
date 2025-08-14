-- DropForeignKey
ALTER TABLE "workout_session_exercises" DROP CONSTRAINT "workout_session_exercises_workoutSessionId_fkey";

-- DropForeignKey
ALTER TABLE "workout_sets" DROP CONSTRAINT "workout_sets_workoutSessionExerciseId_fkey";

-- AddForeignKey
ALTER TABLE "workout_session_exercises" ADD CONSTRAINT "workout_session_exercises_workoutSessionId_fkey" FOREIGN KEY ("workoutSessionId") REFERENCES "workout_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout_sets" ADD CONSTRAINT "workout_sets_workoutSessionExerciseId_fkey" FOREIGN KEY ("workoutSessionExerciseId") REFERENCES "workout_session_exercises"("id") ON DELETE CASCADE ON UPDATE CASCADE;
