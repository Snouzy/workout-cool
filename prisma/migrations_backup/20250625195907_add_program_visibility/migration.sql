-- CreateEnum
CREATE TYPE "ProgramVisibility" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- AlterTable
ALTER TABLE "programs" ADD COLUMN     "visibility" "ProgramVisibility" NOT NULL DEFAULT 'DRAFT';
