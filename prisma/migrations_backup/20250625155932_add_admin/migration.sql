-- CreateEnum
CREATE TYPE "ProgramLevel" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT');

-- CreateTable
CREATE TABLE "programs" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "titleEs" TEXT NOT NULL,
    "titlePt" TEXT NOT NULL,
    "titleRu" TEXT NOT NULL,
    "titleZhCn" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "descriptionEn" TEXT NOT NULL,
    "descriptionEs" TEXT NOT NULL,
    "descriptionPt" TEXT NOT NULL,
    "descriptionRu" TEXT NOT NULL,
    "descriptionZhCn" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "level" "ProgramLevel" NOT NULL,
    "type" "ExerciseAttributeValueEnum" NOT NULL,
    "durationWeeks" INTEGER NOT NULL DEFAULT 4,
    "sessionsPerWeek" INTEGER NOT NULL DEFAULT 3,
    "sessionDurationMin" INTEGER NOT NULL DEFAULT 30,
    "equipment" "ExerciseAttributeValueEnum"[] DEFAULT ARRAY[]::"ExerciseAttributeValueEnum"[],
    "isPremium" BOOLEAN NOT NULL DEFAULT true,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "emoji" TEXT,
    "participantCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "programs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "program_coaches" (
    "id" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "program_coaches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "program_weeks" (
    "id" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "weekNumber" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "titleEs" TEXT NOT NULL,
    "titlePt" TEXT NOT NULL,
    "titleRu" TEXT NOT NULL,
    "titleZhCn" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "descriptionEn" TEXT NOT NULL,
    "descriptionEs" TEXT NOT NULL,
    "descriptionPt" TEXT NOT NULL,
    "descriptionRu" TEXT NOT NULL,
    "descriptionZhCn" TEXT NOT NULL,

    CONSTRAINT "program_weeks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "program_sessions" (
    "id" TEXT NOT NULL,
    "weekId" TEXT NOT NULL,
    "sessionNumber" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "titleEs" TEXT NOT NULL,
    "titlePt" TEXT NOT NULL,
    "titleRu" TEXT NOT NULL,
    "titleZhCn" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "descriptionEn" TEXT NOT NULL,
    "descriptionEs" TEXT NOT NULL,
    "descriptionPt" TEXT NOT NULL,
    "descriptionRu" TEXT NOT NULL,
    "descriptionZhCn" TEXT NOT NULL,
    "equipment" "ExerciseAttributeValueEnum"[] DEFAULT ARRAY[]::"ExerciseAttributeValueEnum"[],
    "estimatedMinutes" INTEGER NOT NULL,
    "isPremium" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "program_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "program_session_exercises" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "exerciseId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "instructions" TEXT NOT NULL,
    "instructionsEn" TEXT NOT NULL,
    "instructionsEs" TEXT NOT NULL,
    "instructionsPt" TEXT NOT NULL,
    "instructionsRu" TEXT NOT NULL,
    "instructionsZhCn" TEXT NOT NULL,

    CONSTRAINT "program_session_exercises_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "program_suggested_sets" (
    "id" TEXT NOT NULL,
    "programSessionExerciseId" TEXT NOT NULL,
    "setIndex" INTEGER NOT NULL,
    "types" "WorkoutSetType"[] DEFAULT ARRAY[]::"WorkoutSetType"[],
    "valuesInt" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "valuesSec" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "units" "WorkoutSetUnit"[] DEFAULT ARRAY[]::"WorkoutSetUnit"[],

    CONSTRAINT "program_suggested_sets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_program_enrollments" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "enrolledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "currentWeek" INTEGER NOT NULL DEFAULT 1,
    "currentSession" INTEGER NOT NULL DEFAULT 1,
    "completedSessions" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "user_program_enrollments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_session_progress" (
    "id" TEXT NOT NULL,
    "enrollmentId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "workoutSessionId" TEXT,

    CONSTRAINT "user_session_progress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "programs_slug_key" ON "programs"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "program_weeks_programId_weekNumber_key" ON "program_weeks"("programId", "weekNumber");

-- CreateIndex
CREATE UNIQUE INDEX "program_sessions_weekId_sessionNumber_key" ON "program_sessions"("weekId", "sessionNumber");

-- CreateIndex
CREATE UNIQUE INDEX "program_session_exercises_sessionId_order_key" ON "program_session_exercises"("sessionId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "program_suggested_sets_programSessionExerciseId_setIndex_key" ON "program_suggested_sets"("programSessionExerciseId", "setIndex");

-- CreateIndex
CREATE UNIQUE INDEX "user_program_enrollments_userId_programId_key" ON "user_program_enrollments"("userId", "programId");

-- CreateIndex
CREATE UNIQUE INDEX "user_session_progress_workoutSessionId_key" ON "user_session_progress"("workoutSessionId");

-- CreateIndex
CREATE UNIQUE INDEX "user_session_progress_enrollmentId_sessionId_key" ON "user_session_progress"("enrollmentId", "sessionId");

-- AddForeignKey
ALTER TABLE "program_coaches" ADD CONSTRAINT "program_coaches_programId_fkey" FOREIGN KEY ("programId") REFERENCES "programs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "program_weeks" ADD CONSTRAINT "program_weeks_programId_fkey" FOREIGN KEY ("programId") REFERENCES "programs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "program_sessions" ADD CONSTRAINT "program_sessions_weekId_fkey" FOREIGN KEY ("weekId") REFERENCES "program_weeks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "program_session_exercises" ADD CONSTRAINT "program_session_exercises_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "program_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "program_session_exercises" ADD CONSTRAINT "program_session_exercises_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "exercises"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "program_suggested_sets" ADD CONSTRAINT "program_suggested_sets_programSessionExerciseId_fkey" FOREIGN KEY ("programSessionExerciseId") REFERENCES "program_session_exercises"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_program_enrollments" ADD CONSTRAINT "user_program_enrollments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_program_enrollments" ADD CONSTRAINT "user_program_enrollments_programId_fkey" FOREIGN KEY ("programId") REFERENCES "programs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_session_progress" ADD CONSTRAINT "user_session_progress_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "user_program_enrollments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_session_progress" ADD CONSTRAINT "user_session_progress_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "program_sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_session_progress" ADD CONSTRAINT "user_session_progress_workoutSessionId_fkey" FOREIGN KEY ("workoutSessionId") REFERENCES "workout_sessions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
