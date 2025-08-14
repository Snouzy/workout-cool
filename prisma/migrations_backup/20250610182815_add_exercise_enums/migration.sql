/*
  Warnings:

  - The values [MUSCLE_GROUP,DIFFICULTY,MOVEMENT_TYPE] on the enum `ExerciseAttributeNameEnum` will be removed. If these variants are still used in the database, this will fail.
  - The values [CHEST,BACK,ARMS,LEGS,CORE,DUMBBELL,BODYWEIGHT,MACHINE,BEGINNER,INTERMEDIATE,ADVANCED,PUSH,PULL,SQUAT,HINGE] on the enum `ExerciseAttributeValueEnum` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[attributeNameId,value]` on the table `exercise_attribute_values` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ExerciseAttributeNameEnum_new" AS ENUM ('TYPE', 'PRIMARY_MUSCLE', 'SECONDARY_MUSCLE', 'EQUIPMENT', 'MECHANICS_TYPE');
ALTER TABLE "exercise_attribute_names" ALTER COLUMN "name" TYPE "ExerciseAttributeNameEnum_new" USING ("name"::text::"ExerciseAttributeNameEnum_new");
ALTER TYPE "ExerciseAttributeNameEnum" RENAME TO "ExerciseAttributeNameEnum_old";
ALTER TYPE "ExerciseAttributeNameEnum_new" RENAME TO "ExerciseAttributeNameEnum";
DROP TYPE "ExerciseAttributeNameEnum_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "ExerciseAttributeValueEnum_new" AS ENUM ('STRENGTH', 'PLYOMETRICS', 'CROSSFIT', 'CARDIO', 'QUADRICEPS', 'SHOULDERS', 'FULL_BODY', 'GLUTES', 'HAMSTRINGS', 'FOREARMS', 'BARBELL', 'BAR', 'CABLE', 'ROPE', 'BENCH', 'COMPOUND', 'ISOLATION');
ALTER TABLE "exercise_attribute_values" ALTER COLUMN "value" TYPE "ExerciseAttributeValueEnum_new" USING ("value"::text::"ExerciseAttributeValueEnum_new");
ALTER TYPE "ExerciseAttributeValueEnum" RENAME TO "ExerciseAttributeValueEnum_old";
ALTER TYPE "ExerciseAttributeValueEnum_new" RENAME TO "ExerciseAttributeValueEnum";
DROP TYPE "ExerciseAttributeValueEnum_old";
COMMIT;

-- CreateIndex
CREATE UNIQUE INDEX "exercise_attribute_values_attributeNameId_value_key" ON "exercise_attribute_values"("attributeNameId", "value");
