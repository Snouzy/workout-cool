-- AlterTable
ALTER TABLE "user" ADD COLUMN     "username" TEXT,
ADD COLUMN     "isProfilePublic" BOOLEAN NOT NULL DEFAULT true;
