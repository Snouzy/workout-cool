/*
  Warnings:

  - You are about to drop the `plan` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `plan_variant` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `subscription` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ExercisePrivacy" AS ENUM ('PUBLIC', 'PRIVATE');

-- CreateEnum
CREATE TYPE "ExerciseAttributeNameEnum" AS ENUM ('MUSCLE_GROUP', 'EQUIPMENT', 'DIFFICULTY', 'MOVEMENT_TYPE');

-- CreateEnum
CREATE TYPE "ExerciseAttributeValueEnum" AS ENUM ('CHEST', 'BACK', 'SHOULDERS', 'ARMS', 'LEGS', 'CORE', 'BARBELL', 'DUMBBELL', 'BODYWEIGHT', 'MACHINE', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'PUSH', 'PULL', 'SQUAT', 'HINGE');

-- DropForeignKey
ALTER TABLE "plan_variant" DROP CONSTRAINT "plan_variant_planId_fkey";

-- DropForeignKey
ALTER TABLE "subscription" DROP CONSTRAINT "subscription_planVariantId_fkey";

-- DropForeignKey
ALTER TABLE "subscription" DROP CONSTRAINT "subscription_userId_fkey";

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "locale" TEXT DEFAULT 'fr';

-- DropTable
DROP TABLE "plan";

-- DropTable
DROP TABLE "plan_variant";

-- DropTable
DROP TABLE "subscription";

-- CreateTable
CREATE TABLE "exercises" (
    "id" TEXT NOT NULL,
    "coachId" TEXT,
    "privacy" "ExercisePrivacy" NOT NULL DEFAULT 'PUBLIC',
    "name" TEXT NOT NULL,
    "nameEn" TEXT,
    "introduction" TEXT,
    "introductionEn" TEXT,
    "description" TEXT,
    "descriptionEn" TEXT,
    "fullVideoUrl" TEXT,
    "fullVideoImageUrl" TEXT,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "slug" TEXT,
    "slugEn" TEXT,
    "metaTitle" TEXT,
    "metaTitleEn" TEXT,
    "metaDescription" TEXT,
    "metaDescriptionEn" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "exercises_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exercise_attribute_names" (
    "id" TEXT NOT NULL,
    "name" "ExerciseAttributeNameEnum" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "exercise_attribute_names_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exercise_attribute_values" (
    "id" TEXT NOT NULL,
    "attributeNameId" TEXT NOT NULL,
    "value" "ExerciseAttributeValueEnum" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

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
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "exercise_attributes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "exercises_slug_key" ON "exercises"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "exercises_slugEn_key" ON "exercises"("slugEn");

-- CreateIndex
CREATE UNIQUE INDEX "exercise_attributes_exerciseId_attributeNameId_attributeVal_key" ON "exercise_attributes"("exerciseId", "attributeNameId", "attributeValueId");

-- AddForeignKey
ALTER TABLE "exercise_attribute_values" ADD CONSTRAINT "exercise_attribute_values_attributeNameId_fkey" FOREIGN KEY ("attributeNameId") REFERENCES "exercise_attribute_names"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exercise_attributes" ADD CONSTRAINT "exercise_attributes_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "exercises"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exercise_attributes" ADD CONSTRAINT "exercise_attributes_attributeNameId_fkey" FOREIGN KEY ("attributeNameId") REFERENCES "exercise_attribute_names"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exercise_attributes" ADD CONSTRAINT "exercise_attributes_attributeValueId_fkey" FOREIGN KEY ("attributeValueId") REFERENCES "exercise_attribute_values"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
