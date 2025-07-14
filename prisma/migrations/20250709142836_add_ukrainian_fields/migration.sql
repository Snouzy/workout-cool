/*
  Warnings:

  - Added the required column `descriptionUa` to the `program_sessions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slugUa` to the `program_sessions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `titleUa` to the `program_sessions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "program_sessions" ADD COLUMN     "descriptionUa" TEXT NOT NULL,
ADD COLUMN     "slugUa" TEXT NOT NULL,
ADD COLUMN     "titleUa" TEXT NOT NULL;
