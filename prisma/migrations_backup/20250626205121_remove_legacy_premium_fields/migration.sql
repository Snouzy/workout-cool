/*
  Warnings:

  - You are about to drop the column `isPremium` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `premiumUntil` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "isPremium",
DROP COLUMN "premiumUntil";
