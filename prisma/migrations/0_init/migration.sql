-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('admin', 'user');

-- CreateEnum
CREATE TYPE "ExercisePrivacy" AS ENUM ('PUBLIC', 'PRIVATE');

-- CreateEnum
CREATE TYPE "ExerciseAttributeNameEnum" AS ENUM ('TYPE', 'PRIMARY_MUSCLE', 'SECONDARY_MUSCLE', 'EQUIPMENT', 'MECHANICS_TYPE');

-- CreateEnum
CREATE TYPE "ExerciseAttributeValueEnum" AS ENUM ('BODYWEIGHT', 'STRENGTH', 'POWERLIFTING', 'CALISTHENIC', 'PLYOMETRICS', 'STRETCHING', 'STRONGMAN', 'CARDIO', 'STABILIZATION', 'POWER', 'RESISTANCE', 'CROSSFIT', 'WEIGHTLIFTING', 'BICEPS', 'SHOULDERS', 'CHEST', 'BACK', 'GLUTES', 'TRICEPS', 'HAMSTRINGS', 'QUADRICEPS', 'FOREARMS', 'CALVES', 'TRAPS', 'ABDOMINALS', 'NECK', 'LATS', 'ADDUCTORS', 'ABDUCTORS', 'OBLIQUES', 'GROIN', 'FULL_BODY', 'ROTATOR_CUFF', 'HIP_FLEXOR', 'ACHILLES_TENDON', 'FINGERS', 'DUMBBELL', 'KETTLEBELLS', 'BARBELL', 'SMITH_MACHINE', 'BODY_ONLY', 'OTHER', 'BANDS', 'EZ_BAR', 'MACHINE', 'DESK', 'PULLUP_BAR', 'NONE', 'CABLE', 'MEDICINE_BALL', 'SWISS_BALL', 'FOAM_ROLL', 'WEIGHT_PLATE', 'TRX', 'BOX', 'ROPES', 'SPIN_BIKE', 'STEP', 'BOSU', 'TYRE', 'SANDBAG', 'POLE', 'BENCH', 'WALL', 'BAR', 'RACK', 'CAR', 'SLED', 'CHAIN', 'SKIERG', 'ROPE', 'NA', 'ISOLATION', 'COMPOUND');

-- CreateEnum
CREATE TYPE "WorkoutSetType" AS ENUM ('TIME', 'WEIGHT', 'REPS', 'BODYWEIGHT', 'NA');

-- CreateEnum
CREATE TYPE "WorkoutSetUnit" AS ENUM ('kg', 'lbs');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'TRIAL', 'CANCELLED', 'EXPIRED', 'PAUSED');

-- CreateEnum
CREATE TYPE "Platform" AS ENUM ('WEB', 'IOS', 'ANDROID');

-- CreateEnum
CREATE TYPE "PaymentProcessor" AS ENUM ('STRIPE', 'PAYPAL', 'LEMONSQUEEZY', 'PADDLE', 'APPLE_PAY', 'GOOGLE_PAY', 'REVENUECAT', 'NONE', 'OTHER');

-- CreateEnum
CREATE TYPE "ProgramLevel" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT');

-- CreateEnum
CREATE TYPE "ProgramVisibility" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL DEFAULT '',
    "lastName" TEXT NOT NULL DEFAULT '',
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL,
    "image" TEXT,
    "locale" TEXT DEFAULT 'fr',
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "role" "UserRole" DEFAULT 'user',
    "banned" BOOLEAN DEFAULT false,
    "banReason" TEXT,
    "banExpires" TIMESTAMP(3),
    "isPremium" BOOLEAN DEFAULT false,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_favorite_exercises" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "exerciseId" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_favorite_exercises_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,
    "impersonatedBy" TEXT,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feedbacks" (
    "id" TEXT NOT NULL,
    "review" INTEGER NOT NULL,
    "message" TEXT NOT NULL,
    "email" TEXT,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "feedbacks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exercises" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameEn" TEXT,
    "description" TEXT,
    "descriptionEn" TEXT,
    "fullVideoUrl" TEXT,
    "fullVideoImageUrl" TEXT,
    "introduction" TEXT,
    "introductionEn" TEXT,
    "slug" TEXT,
    "slugEn" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "exercises_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exercise_attribute_names" (
    "id" TEXT NOT NULL,
    "name" "ExerciseAttributeNameEnum" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "exercise_attribute_names_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exercise_attribute_values" (
    "id" TEXT NOT NULL,
    "attributeNameId" TEXT NOT NULL,
    "value" "ExerciseAttributeValueEnum" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "exercise_attribute_values_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exercise_attributes" (
    "id" TEXT NOT NULL,
    "exerciseId" TEXT NOT NULL,
    "attributeNameId" TEXT NOT NULL,
    "attributeValueId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "exercise_attributes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workout_sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "endedAt" TIMESTAMP(3),
    "duration" INTEGER,
    "muscles" "ExerciseAttributeValueEnum"[] DEFAULT ARRAY[]::"ExerciseAttributeValueEnum"[],
    "rating" INTEGER,
    "ratingComment" TEXT,

    CONSTRAINT "workout_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workout_session_exercises" (
    "id" TEXT NOT NULL,
    "workoutSessionId" TEXT NOT NULL,
    "exerciseId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "workout_session_exercises_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workout_sets" (
    "id" TEXT NOT NULL,
    "workoutSessionExerciseId" TEXT NOT NULL,
    "setIndex" INTEGER NOT NULL,
    "type" "WorkoutSetType" NOT NULL,
    "types" "WorkoutSetType"[] DEFAULT ARRAY[]::"WorkoutSetType"[],
    "valuesInt" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "valuesSec" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "units" "WorkoutSetUnit"[] DEFAULT ARRAY[]::"WorkoutSetUnit"[],
    "completed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "workout_sets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscription_plans" (
    "id" TEXT NOT NULL,
    "priceMonthly" DECIMAL(10,2),
    "priceYearly" DECIMAL(10,2),
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "interval" TEXT NOT NULL DEFAULT 'month',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "availableRegions" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscription_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plan_provider_mappings" (
    "id" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "provider" "PaymentProcessor" NOT NULL,
    "externalId" TEXT NOT NULL,
    "region" TEXT,
    "metadata" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "plan_provider_mappings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "revenueCatUserId" TEXT,
    "status" "SubscriptionStatus" NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "currentPeriodEnd" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "platform" "Platform",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "licenses" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "userId" TEXT,
    "validFrom" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "validUntil" TIMESTAMP(3),
    "maxUsers" INTEGER DEFAULT 1,
    "features" JSONB,
    "activatedAt" TIMESTAMP(3),
    "lastCheckedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "licenses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "revenuecat_webhook_events" (
    "id" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "eventTimestamp" TIMESTAMP(3) NOT NULL,
    "appUserId" TEXT NOT NULL,
    "environment" TEXT NOT NULL,
    "productId" TEXT,
    "transactionId" TEXT,
    "originalTransactionId" TEXT,
    "entitlementIds" TEXT,
    "processed" BOOLEAN NOT NULL DEFAULT false,
    "processingError" TEXT,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "rawEventData" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "revenuecat_webhook_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "programs" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "slugEn" TEXT NOT NULL,
    "slugEs" TEXT NOT NULL,
    "slugPt" TEXT NOT NULL,
    "slugRu" TEXT NOT NULL,
    "slugZhCn" TEXT NOT NULL,
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
    "visibility" "ProgramVisibility" NOT NULL DEFAULT 'DRAFT',
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
    "slug" TEXT NOT NULL,
    "slugEn" TEXT NOT NULL,
    "slugEs" TEXT NOT NULL,
    "slugPt" TEXT NOT NULL,
    "slugRu" TEXT NOT NULL,
    "slugZhCn" TEXT NOT NULL,
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
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_favorite_exercises_userId_exerciseId_key" ON "user_favorite_exercises"("userId", "exerciseId");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "session"("token");

-- CreateIndex
CREATE UNIQUE INDEX "exercises_slug_key" ON "exercises"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "exercises_slugEn_key" ON "exercises"("slugEn");

-- CreateIndex
CREATE UNIQUE INDEX "exercise_attribute_names_name_key" ON "exercise_attribute_names"("name");

-- CreateIndex
CREATE UNIQUE INDEX "exercise_attribute_values_attributeNameId_value_key" ON "exercise_attribute_values"("attributeNameId", "value");

-- CreateIndex
CREATE UNIQUE INDEX "exercise_attributes_exerciseId_attributeNameId_attributeVal_key" ON "exercise_attributes"("exerciseId", "attributeNameId", "attributeValueId");

-- CreateIndex
CREATE INDEX "plan_provider_mappings_provider_externalId_idx" ON "plan_provider_mappings"("provider", "externalId");

-- CreateIndex
CREATE UNIQUE INDEX "plan_provider_mappings_planId_provider_region_key" ON "plan_provider_mappings"("planId", "provider", "region");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_userId_platform_key" ON "subscriptions"("userId", "platform");

-- CreateIndex
CREATE UNIQUE INDEX "licenses_key_key" ON "licenses"("key");

-- CreateIndex
CREATE INDEX "revenuecat_webhook_events_appUserId_idx" ON "revenuecat_webhook_events"("appUserId");

-- CreateIndex
CREATE INDEX "revenuecat_webhook_events_eventType_idx" ON "revenuecat_webhook_events"("eventType");

-- CreateIndex
CREATE INDEX "revenuecat_webhook_events_processed_idx" ON "revenuecat_webhook_events"("processed");

-- CreateIndex
CREATE INDEX "revenuecat_webhook_events_eventTimestamp_idx" ON "revenuecat_webhook_events"("eventTimestamp");

-- CreateIndex
CREATE UNIQUE INDEX "programs_slug_key" ON "programs"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "programs_slugEn_key" ON "programs"("slugEn");

-- CreateIndex
CREATE UNIQUE INDEX "programs_slugEs_key" ON "programs"("slugEs");

-- CreateIndex
CREATE UNIQUE INDEX "programs_slugPt_key" ON "programs"("slugPt");

-- CreateIndex
CREATE UNIQUE INDEX "programs_slugRu_key" ON "programs"("slugRu");

-- CreateIndex
CREATE UNIQUE INDEX "programs_slugZhCn_key" ON "programs"("slugZhCn");

-- CreateIndex
CREATE UNIQUE INDEX "program_weeks_programId_weekNumber_key" ON "program_weeks"("programId", "weekNumber");

-- CreateIndex
CREATE UNIQUE INDEX "program_sessions_weekId_sessionNumber_key" ON "program_sessions"("weekId", "sessionNumber");

-- CreateIndex
CREATE UNIQUE INDEX "program_sessions_weekId_slug_key" ON "program_sessions"("weekId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "program_sessions_weekId_slugEn_key" ON "program_sessions"("weekId", "slugEn");

-- CreateIndex
CREATE UNIQUE INDEX "program_sessions_weekId_slugEs_key" ON "program_sessions"("weekId", "slugEs");

-- CreateIndex
CREATE UNIQUE INDEX "program_sessions_weekId_slugPt_key" ON "program_sessions"("weekId", "slugPt");

-- CreateIndex
CREATE UNIQUE INDEX "program_sessions_weekId_slugRu_key" ON "program_sessions"("weekId", "slugRu");

-- CreateIndex
CREATE UNIQUE INDEX "program_sessions_weekId_slugZhCn_key" ON "program_sessions"("weekId", "slugZhCn");

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
ALTER TABLE "user_favorite_exercises" ADD CONSTRAINT "user_favorite_exercises_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_favorite_exercises" ADD CONSTRAINT "user_favorite_exercises_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "exercises"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedbacks" ADD CONSTRAINT "feedbacks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exercise_attribute_values" ADD CONSTRAINT "exercise_attribute_values_attributeNameId_fkey" FOREIGN KEY ("attributeNameId") REFERENCES "exercise_attribute_names"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exercise_attributes" ADD CONSTRAINT "exercise_attributes_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "exercises"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exercise_attributes" ADD CONSTRAINT "exercise_attributes_attributeNameId_fkey" FOREIGN KEY ("attributeNameId") REFERENCES "exercise_attribute_names"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exercise_attributes" ADD CONSTRAINT "exercise_attributes_attributeValueId_fkey" FOREIGN KEY ("attributeValueId") REFERENCES "exercise_attribute_values"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout_sessions" ADD CONSTRAINT "workout_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout_session_exercises" ADD CONSTRAINT "workout_session_exercises_workoutSessionId_fkey" FOREIGN KEY ("workoutSessionId") REFERENCES "workout_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout_session_exercises" ADD CONSTRAINT "workout_session_exercises_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "exercises"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout_sets" ADD CONSTRAINT "workout_sets_workoutSessionExerciseId_fkey" FOREIGN KEY ("workoutSessionExerciseId") REFERENCES "workout_session_exercises"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plan_provider_mappings" ADD CONSTRAINT "plan_provider_mappings_planId_fkey" FOREIGN KEY ("planId") REFERENCES "subscription_plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_planId_fkey" FOREIGN KEY ("planId") REFERENCES "subscription_plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "licenses" ADD CONSTRAINT "licenses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

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

