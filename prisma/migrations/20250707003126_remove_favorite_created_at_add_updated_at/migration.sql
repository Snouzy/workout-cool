/*
  Warnings:

  - Added the required column `updatedAt` to the `user_favorite_exercises` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user_favorite_exercises" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
