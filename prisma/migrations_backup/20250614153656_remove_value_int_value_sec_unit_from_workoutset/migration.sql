/*
  Warnings:

  - You are about to drop the column `unit` on the `workout_sets` table. All the data in the column will be lost.
  - You are about to drop the column `valueInt` on the `workout_sets` table. All the data in the column will be lost.
  - You are about to drop the column `valueSec` on the `workout_sets` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "workout_sets" DROP COLUMN "unit",
DROP COLUMN "valueInt",
DROP COLUMN "valueSec";
