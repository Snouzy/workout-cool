/*
  Warnings:

  - A unique constraint covering the columns `[slugKo]` on the table `programs` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `instructionsKo` to the `program_session_exercises` table without a default value. This is not possible if the table is not empty.
  - Added the required column `descriptionKo` to the `program_sessions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slugKo` to the `program_sessions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `titleKo` to the `program_sessions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `descriptionKo` to the `program_weeks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `titleKo` to the `program_weeks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `descriptionKo` to the `programs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slugKo` to the `programs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `titleKo` to the `programs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "program_session_exercises" ADD COLUMN     "instructionsKo" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "program_sessions" ADD COLUMN     "descriptionKo" TEXT NOT NULL,
ADD COLUMN     "slugKo" TEXT NOT NULL,
ADD COLUMN     "titleKo" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "program_weeks" ADD COLUMN     "descriptionKo" TEXT NOT NULL,
ADD COLUMN     "titleKo" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "programs" ADD COLUMN     "descriptionKo" TEXT NOT NULL,
ADD COLUMN     "slugKo" TEXT NOT NULL,
ADD COLUMN     "titleKo" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "programs_slugKo_key" ON "programs"("slugKo");
