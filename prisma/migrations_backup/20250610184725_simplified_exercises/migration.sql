/*
  Warnings:

  - You are about to drop the column `deletedAt` on the `exercise_attribute_names` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `exercise_attribute_values` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `exercise_attributes` table. All the data in the column will be lost.
  - You are about to drop the column `coachId` on the `exercises` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `exercises` table. All the data in the column will be lost.
  - You are about to drop the column `isArchived` on the `exercises` table. All the data in the column will be lost.
  - You are about to drop the column `metaDescription` on the `exercises` table. All the data in the column will be lost.
  - You are about to drop the column `metaDescriptionEn` on the `exercises` table. All the data in the column will be lost.
  - You are about to drop the column `metaTitle` on the `exercises` table. All the data in the column will be lost.
  - You are about to drop the column `metaTitleEn` on the `exercises` table. All the data in the column will be lost.
  - You are about to drop the column `privacy` on the `exercises` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `exercise_attribute_names` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `name` on the `exercise_attribute_names` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `value` on the `exercise_attribute_values` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "exercise_attribute_names" DROP COLUMN "deletedAt",
DROP COLUMN "name",
ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "exercise_attribute_values" DROP COLUMN "deletedAt",
DROP COLUMN "value",
ADD COLUMN     "value" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "exercise_attributes" DROP COLUMN "deletedAt";

-- AlterTable
ALTER TABLE "exercises" DROP COLUMN "coachId",
DROP COLUMN "deletedAt",
DROP COLUMN "isArchived",
DROP COLUMN "metaDescription",
DROP COLUMN "metaDescriptionEn",
DROP COLUMN "metaTitle",
DROP COLUMN "metaTitleEn",
DROP COLUMN "privacy";

-- CreateIndex
CREATE UNIQUE INDEX "exercise_attribute_names_name_key" ON "exercise_attribute_names"("name");

-- CreateIndex
CREATE UNIQUE INDEX "exercise_attribute_values_attributeNameId_value_key" ON "exercise_attribute_values"("attributeNameId", "value");
