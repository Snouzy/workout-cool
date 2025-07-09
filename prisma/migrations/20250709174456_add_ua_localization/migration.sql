/*
  Warnings:

  - Added the required column `instructionsUa` to the `program_session_exercises` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "program_session_exercises" ADD COLUMN     "instructionsUa" TEXT NOT NULL;
