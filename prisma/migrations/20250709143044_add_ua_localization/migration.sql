/*
  Warnings:

  - A unique constraint covering the columns `[weekId,slugUa]` on the table `program_sessions` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slugUa]` on the table `programs` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `descriptionUa` to the `program_weeks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `titleUa` to the `program_weeks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `descriptionUa` to the `programs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slugUa` to the `programs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `titleUa` to the `programs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "program_weeks" ADD COLUMN     "descriptionUa" TEXT NOT NULL,
ADD COLUMN     "titleUa" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "programs" ADD COLUMN     "descriptionUa" TEXT NOT NULL,
ADD COLUMN     "slugUa" TEXT NOT NULL,
ADD COLUMN     "titleUa" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "program_sessions_weekId_slugUa_key" ON "program_sessions"("weekId", "slugUa");

-- CreateIndex
CREATE UNIQUE INDEX "programs_slugUa_key" ON "programs"("slugUa");
