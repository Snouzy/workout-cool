/*
  Warnings:

  - A unique constraint covering the columns `[weekId,slug]` on the table `program_sessions` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[weekId,slugEn]` on the table `program_sessions` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[weekId,slugEs]` on the table `program_sessions` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[weekId,slugPt]` on the table `program_sessions` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[weekId,slugRu]` on the table `program_sessions` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[weekId,slugZhCn]` on the table `program_sessions` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slugEn]` on the table `programs` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slugEs]` on the table `programs` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slugPt]` on the table `programs` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slugRu]` on the table `programs` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slugZhCn]` on the table `programs` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `program_sessions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slugEn` to the `program_sessions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slugEs` to the `program_sessions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slugPt` to the `program_sessions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slugRu` to the `program_sessions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slugZhCn` to the `program_sessions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slugEn` to the `programs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slugEs` to the `programs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slugPt` to the `programs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slugRu` to the `programs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slugZhCn` to the `programs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "program_sessions" ADD COLUMN     "slug" TEXT NOT NULL,
ADD COLUMN     "slugEn" TEXT NOT NULL,
ADD COLUMN     "slugEs" TEXT NOT NULL,
ADD COLUMN     "slugPt" TEXT NOT NULL,
ADD COLUMN     "slugRu" TEXT NOT NULL,
ADD COLUMN     "slugZhCn" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "programs" ADD COLUMN     "slugEn" TEXT NOT NULL,
ADD COLUMN     "slugEs" TEXT NOT NULL,
ADD COLUMN     "slugPt" TEXT NOT NULL,
ADD COLUMN     "slugRu" TEXT NOT NULL,
ADD COLUMN     "slugZhCn" TEXT NOT NULL;

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
CREATE UNIQUE INDEX "programs_slugEn_key" ON "programs"("slugEn");

-- CreateIndex
CREATE UNIQUE INDEX "programs_slugEs_key" ON "programs"("slugEs");

-- CreateIndex
CREATE UNIQUE INDEX "programs_slugPt_key" ON "programs"("slugPt");

-- CreateIndex
CREATE UNIQUE INDEX "programs_slugRu_key" ON "programs"("slugRu");

-- CreateIndex
CREATE UNIQUE INDEX "programs_slugZhCn_key" ON "programs"("slugZhCn");
