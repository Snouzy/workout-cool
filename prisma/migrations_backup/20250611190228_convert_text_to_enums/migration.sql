/*
  Warnings:

  - Changed the type of `name` on the `exercise_attribute_names` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `value` on the `exercise_attribute_values` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/

-- Safe migration for exercise_attribute_names
-- 1. Add temporary column with enum type
ALTER TABLE "exercise_attribute_names" ADD COLUMN "name_temp" "ExerciseAttributeNameEnum";

-- 2. Migrate data from text to enum (cast text to enum)
UPDATE "exercise_attribute_names" SET "name_temp" = "name"::"ExerciseAttributeNameEnum";

-- 3. Drop old column and rename temp column
ALTER TABLE "exercise_attribute_names" DROP COLUMN "name";
ALTER TABLE "exercise_attribute_names" RENAME COLUMN "name_temp" TO "name";

-- 4. Set NOT NULL constraint
ALTER TABLE "exercise_attribute_names" ALTER COLUMN "name" SET NOT NULL;

-- Safe migration for exercise_attribute_values  
-- 1. Add temporary column with enum type
ALTER TABLE "exercise_attribute_values" ADD COLUMN "value_temp" "ExerciseAttributeValueEnum";

-- 2. Migrate data from text to enum (cast text to enum)
UPDATE "exercise_attribute_values" SET "value_temp" = "value"::"ExerciseAttributeValueEnum";

-- 3. Drop old column and rename temp column
ALTER TABLE "exercise_attribute_values" DROP COLUMN "value";
ALTER TABLE "exercise_attribute_values" RENAME COLUMN "value_temp" TO "value";

-- 4. Set NOT NULL constraint
ALTER TABLE "exercise_attribute_values" ALTER COLUMN "value" SET NOT NULL;

-- Recreate indexes
CREATE UNIQUE INDEX "exercise_attribute_names_name_key" ON "exercise_attribute_names"("name");
CREATE UNIQUE INDEX "exercise_attribute_values_attributeNameId_value_key" ON "exercise_attribute_values"("attributeNameId", "value");
